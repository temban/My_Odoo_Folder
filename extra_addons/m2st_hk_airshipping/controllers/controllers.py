from odoo import http
from odoo.http import request, Response
import json
import datetime
import subprocess


class NotificationLogController(http.Controller):

    @http.route('/air/notification_log/<int:partner_id>', type='json', website=True, csrf=False, auth='none', methods=['POST'])
    def get_notifications(self, partner_id, **kwargs):
        notifications = request.env['air.notification.log'].sudo().search([
            '|',
            '&', ('sender_partner_id', '=', int(partner_id)), ('disable_sender', '=', False),
            '&', ('receiver_partner_id', '=', int(partner_id)), ('disable_receiver', '=', False),
        ])

        notification_data = []
        for notification in notifications:
            notification_data.append({
                'id': notification.id,
                'sender_partner_id': notification.sender_partner_id.id,
                'receiver_partner_id': notification.receiver_partner_id.id,
                'message_title': notification.message_title,
                'message_body': notification.message_body,
                'is_seen_sender': notification.is_seen_sender,
                'is_seen_receiver': notification.is_seen_receiver,
                'disable_sender': notification.disable_sender,
                'disable_receiver': notification.disable_receiver,
                'date': notification.date,
            })

        return notification_data

    @http.route('/air/notification_log/mark_seen/<int:notification_id>/<int:partner_id>', type='json', auth='none',
                methods=['PUT'], website=True, csrf=False)
    def mark_notification_seen(self, notification_id, partner_id, **kwargs):
        notification = request.env['air.notification.log'].sudo().browse(notification_id)

        if notification:
            if partner_id == notification.sender_partner_id.id:
                notification.sudo().write({'is_seen_sender': True})
                return {'success': 'seen as sender'}
            elif partner_id == notification.receiver_partner_id.id:
                notification.sudo().write({'is_seen_receiver': True})
                return {'success': 'seen as receiver'}
            else:
                return {'success': False, 'error': 'Partner ID does not correspond to sender or receiver'}
        else:
            return {'success': False, 'error': 'Notification not found'}

    @http.route('/air/notification_log/disable/<int:notification_id>/<int:partner_id>', type='json', auth='none',
                methods=['PUT'], website=True, csrf=False)
    def notification_disable(self, notification_id, partner_id, **kwargs):
        notification = request.env['air.notification.log'].sudo().browse(notification_id)

        if notification:
            if partner_id == notification.sender_partner_id.id:
                notification.sudo().write({'disable_sender': True})
                return {'success': 'Sender Disabled!'}
            elif partner_id == notification.receiver_partner_id.id:
                notification.sudo().write({'disable_receiver': True})
                return {'success': 'Receiver Disabled!'}
            else:
                return {'success': False, 'error': 'Partner ID does not correspond to sender or receiver'}
        else:
            return {'success': False, 'error': 'Notification not found'}


class AirResUsers(http.Controller):

    @http.route('/air/mobile/get_user_by_email', type='http', auth='none', website=True, csrf=False, methods=['POST'])
    def get_air_mobile_user_by_email(self, email, **kw):
        print(email)
        user = request.env['res.users'].sudo().search([('login', '=', email)], limit=1)

        if user:
            user_data = {
                'user_id': user.id,
                'user_name': user.name,
                'user_email': user.login,
                'partner_id': user.partner_id.id,
                'partner_name': user.partner_id.name
            }
            return json.dumps(user_data)
        else:
            return json.dumps({'error': 'User not found'})


class MyPortal(http.Controller):

    @http.route('/air/update/travel_id/<int:travelbooking_id>/shipping', type='http', auth="none", website=True,
                methods=['GET'])
    def update_air_shipping_by_travel_id(self, travelbooking_id, **kwargs):
        shipping_ids = kwargs.get('shipping_ids', [])

        if not travelbooking_id:  # Corrected condition
            return {'error': 'Travelbooking ID is required.'}

        shipping_ids = [int(id) for id in shipping_ids.split(',') if id.isdigit()]
        shipping_data = []

        Shipping = request.env['m2st_hk_airshipping.shipping'].sudo()

        for shipping_id in shipping_ids:
            shipping = Shipping.browse(shipping_id)
            if shipping:
                # Update the travelbooking_id for the shipping record
                shipping.sudo().write({'travelbooking_id': travelbooking_id})

                shipping_data.append({
                    'shipping_id': shipping.id,
                    'travelbooking_id': shipping.travelbooking_id,
                    'name': shipping.name,
                    'partner_id': shipping.partner_id.id,
                    'booking_type': shipping.booking_type,
                    'state': shipping.state,
                    # 'total_weight': shipping.total_weight,
                    'receiver_partner_id': shipping.receiver_partner_id.id,
                    'receiver_email': shipping.receiver_email,
                    'receiver_phone': shipping.receiver_phone,
                    'receiver_address': shipping.receiver_address,
                    'shipping_date': shipping.shipping_date.strftime('%Y-%m-%d %H:%M:%S'),
                    'register_receiver': shipping.register_receiver,
                    'receiver_source': shipping.receiver_source,
                    'receiver_city_id': shipping.receiver_city_id.id,
                    'shipping_departure_city_id': shipping.shipping_departure_city_id.id,
                    'shipping_arrival_city_id': shipping.shipping_arrival_city_id.id,
                    'shipping_departure_date': shipping.shipping_departure_date.strftime('%Y-%m-%d %H:%M:%S'),
                    'shipping_arrival_date': shipping.shipping_arrival_date.strftime('%Y-%m-%d %H:%M:%S'),
                    'travel_code': shipping.travel_code,
                    'travel_partner_name': shipping.travel_partner_name,
                    'travel_departure_city_name': shipping.travel_departure_city_name,
                    'travel_arrival_city_name': shipping.travel_arrival_city_name,
                })
        return json.dumps({
            'message': 'success',
            'shipping_data': shipping_data,
        }, indent=4, default=str, ensure_ascii=False, sort_keys=True)

    @http.route('/paginate/air/shipping', auth='none', website=True, type='json', methods=['POST'])
    def paginate_air_shipping(self, **kw):
        # Define the number of items per page
        items_per_page = 6
        # Retrieve the shipping records with no travelbooking_id
        shipping_records = request.env['m2st_hk_airshipping.shipping'].sudo().search(
            [('travelbooking_id', '=', False), ('state', '=', 'pending')])

        # Extract the current page number from the request parameters
        page = int(kw.get('page', 1))

        # Calculate the total number of pages
        total_pages = (len(shipping_records) + items_per_page - 1) // items_per_page
        # Calculate the offset to slice the records for the current page
        offset = (page - 1) * items_per_page
        # Paginate the shipping records
        paginated_shipping = shipping_records[offset:offset + items_per_page]

        # Construct a list of JSON objects for the paginated records
        shipping_data = []
        for shipping in paginated_shipping:
            receiver_city_name = shipping.receiver_city_id.name if shipping.receiver_city_id.name else None
            country_name = shipping.receiver_city_id.country_name if shipping.receiver_city_id.country_name else None
            shipping_data.append({
                'id': shipping.id,
                'name': shipping.name,
                'partner_id': shipping.partner_id.id,
                'state': shipping.state,
                'booking_type': shipping.booking_type,
                'total_weight': shipping.total_weight,
                'receiver_email': shipping.receiver_email,
                'receiver_phone': shipping.receiver_phone,
                'receiver_address': shipping.receiver_address,
                'shipping_date': shipping.shipping_date.strftime('%Y-%m-%d %H:%M:%S'),
                'register_receiver': shipping.register_receiver,
                'receiver_source': shipping.receiver_source,
                'create_date': shipping.create_date,
                'receiver_partner_id': [shipping.receiver_partner_id.id, shipping.receiver_partner_id.name],
                'receiver_city_id': [
                    shipping.receiver_city_id.id,
                    f"{receiver_city_name} ({country_name})"
                ],
                'shipping_departure_city_id': [
                    shipping.shipping_departure_city_id.id,
                    shipping.shipping_departure_city_id.name + " (" + shipping.shipping_departure_city_id.country_name + ")",
                ],
                'shipping_arrival_city_id': [
                    shipping.shipping_arrival_city_id.id,
                    shipping.shipping_arrival_city_id.name + " (" + shipping.shipping_arrival_city_id.country_name + ")",
                ],
                'shipping_departure_date': shipping.shipping_departure_date.strftime('%Y-%m-%d %H:%M:%S'),
                'shipping_arrival_date': shipping.shipping_arrival_date.strftime('%Y-%m-%d %H:%M:%S'),
                'travel_code': shipping.travel_code,
                'travel_partner_name': shipping.travel_partner_name,
                'travel_departure_city_name': shipping.travel_departure_city_name,
                'travel_arrival_city_name': shipping.travel_arrival_city_name,
                # Add other fields as needed
            })

        # Build the JSON response
        response = {
            'shipping_data': shipping_data,
            'page': page,
            'total_pages': total_pages
        }

        return response

    @http.route('/mobile/all/hub_air/travels', auth='none', website=True, csrf=False, type='json', methods=['POST'])
    def mobile_air_paginate_travels(self, **kw):

        travels_due = request.env['m2st_hk_airshipping.travelbooking'].sudo().search([])

        # Get the current date
        current_date = datetime.date.today()

        # Check and update the travel_due field
        for travel in travels_due:
            if travel.departure_date.date() < current_date:
                # If the arrival_date is in the past, set travel_due to True
                travel.sudo().write({'travel_due': True})

        travels = request.env['m2st_hk_airshipping.travelbooking'].sudo().search([('state', '=', 'negotiating'),
                                                                                   ('travel_due', '=', False)])

        # Pagination parameters
        page = int(kw.get('page', 1))
        items_per_page = 9
        offset = (page - 1) * items_per_page
        total_pages = (len(travels) + items_per_page - 1) // items_per_page

        # Paginating the travels
        paginated_travels = travels[offset: offset + items_per_page]

        # Converting the travels to JSON
        travels_json = []
        for travel in paginated_travels:
            exist = bool(travel.partner_id.image_1920)
            travel_json = {
                'id': travel.id,
                'partner_id': [travel.partner_id.id, travel.partner_id.name],
                'state': travel.state,
                'air_average_rating': travel.partner_id.air_average_rating,
                'travel_due': travel.travel_due,
                'bank_account': travel.bank_account,
                'booking_date': travel.booking_date.strftime('%Y-%m-%d'),
                'shipping_ids': [(shipping.id, shipping.name) for shipping in travel.shipping_ids],
                'booking_type': travel.booking_type,
                'departure_city_id': [
                    travel.departure_city_id.id,
                    travel.departure_city_id.name + " (" + travel.departure_city_id.country_name + ")",
                ],
                'arrival_city_id': [
                    travel.arrival_city_id.id,
                    travel.arrival_city_id.name + " (" + travel.arrival_city_id.country_name + ")",
                ],
                'departure_date': travel.departure_date.strftime('%Y-%m-%d'),
                'arrival_date': travel.arrival_date.strftime('%Y-%m-%d'),

                # Add all the model fields here
                'name': travel.name,
                'code': travel.code,
                'luggage_types': [luggage.id for luggage in travel.luggage_types],
                'flight_docs': [doc.id for doc in travel.flight_docs],
                'state_id': [travel.state_id.id, travel.state_id.name],
                'country_id': [travel.country_id.id, travel.country_id.name],
                'city': [
                    travel.city.id,
                    travel.city.name + " (" + travel.city.country_name + ")",
                ],
                'street': travel.street,
                'street2': travel.street2,
                'zip': travel.zip,
                # 'total_weight': travel.total_weight,
                # 'booking_price': travel.booking_price,
                'local_currency_id': [travel.local_currency_id.id, travel.local_currency_id.currency_unit_label],
                'partner_image_1920': exist,
                'move_ids': [(move.id, move.name) for move in travel.move_ids],
            }
            travels_json.append(travel_json)

        # Building the JSON response
        response = {
            'travels': travels_json,
            'page': page,
            'total_pages': total_pages
        }
        # Returning the JSON response
        return response

    @http.route('/air/frontend/all/travels', auth='none', website=True, csrf=False, type='http', method=['GET'])
    def frontend_all_air_travels(self, **kw):

        travels_due = request.env['m2st_hk_airshipping.travelbooking'].sudo().search([])

        # Get the current date
        current_date = datetime.date.today()

        # Check and update the travel_due field
        for travel in travels_due:
            if travel.departure_date.date() < current_date:
                # If the arrival_date is in the past, set travel_due to True
                travel.sudo().write({'travel_due': True})

        travels = request.env['m2st_hk_airshipping.travelbooking'].sudo().search([('state', '=', 'negotiating'),
                                                                                   ('travel_due', '=', False)])

        # Converting the travels to JSON
        travels_json = []
        for travel in travels:
            exist = bool(travel.partner_id.image_1920)
            travel_json = {
                'id': travel.id,
                'partner_id': [travel.partner_id.id, travel.partner_id.name],
                'state': travel.state,
                'air_average_rating': travel.partner_id.air_average_rating,
                'travel_due': travel.travel_due,
                'bank_account': travel.bank_account,
                'booking_date': travel.booking_date.strftime('%Y-%m-%d'),
                'shipping_ids': [(shipping.id, shipping.name) for shipping in travel.shipping_ids],
                'booking_type': travel.booking_type,
                'departure_city_id': [
                    travel.departure_city_id.id,
                    travel.departure_city_id.name + " (" + travel.departure_city_id.country_name + ")",
                ],
                'arrival_city_id': [
                    travel.arrival_city_id.id,
                    travel.arrival_city_id.name + " (" + travel.arrival_city_id.country_name + ")",
                ],
                'departure_date': travel.departure_date.strftime('%Y-%m-%d'),
                'arrival_date': travel.arrival_date.strftime('%Y-%m-%d'),

                # Add all the model fields here
                'name': travel.name,
                'code': travel.code,
                'luggage_types': [luggage.id for luggage in travel.luggage_types],
                'flight_docs': [doc.id for doc in travel.flight_docs],
                'state_id': [travel.state_id.id, travel.state_id.name],
                'country_id': [travel.country_id.id, travel.country_id.name],
                'city': [
                    travel.city.id,
                    travel.city.name + " (" + travel.city.country_name + ")",
                ],
                'street': travel.street,
                'street2': travel.street2,
                'zip': travel.zip,
                #'luggage_ids': [(luggage.id, luggage.name) for luggage in travel.luggage_ids],
                #'total_weight': travel.total_weight,
                # 'booking_price': travel.booking_price,
                'local_currency_id': [travel.local_currency_id.id, travel.local_currency_id.currency_unit_label],
                'partner_image_1920': exist,
                'move_ids': [(move.id, move.name) for move in travel.move_ids],
            }
            travels_json.append(travel_json)

        # Building the JSON response
        response = {
            'travels': travels_json,
        }

        # Returning the JSON response
        return json.dumps(response)

    @http.route('/mobile/air/receiver/shipping/get_details', auth='none', type='json', methods=['POST'])
    def mobile_get_receiver_air_shipping_details(self, **kw):
        partner_id = kw.get('partner_id')
        shipping_model = request.env['m2st_hk_airshipping.shipping']
        if shipping_model.sudo().search([('receiver_partner_id', '=', partner_id)]):
            shippings = shipping_model.sudo().search([('receiver_partner_id', '=', partner_id)])
            print("receiver=========================================")
            shipping_details = []
            for shipping in shippings:
                shipping_details.append({
                    'shipping_id': shipping.id,
                    'name': shipping.name,
                    'shipping_partner_id': shipping.partner_id.id,
                    'shipping_partner_name': shipping.partner_id.name,
                    'travelbooking_id': shipping.travelbooking_id.id,
                    'booking_type': shipping.booking_type,
                    'state': shipping.state,
                    'disable': shipping.disable,
                    'travel_partner_latitude': shipping.travel_partner_latitude,
                    'travel_partner_longitude': shipping.travel_partner_longitude,
                    # 'luggage_ids': [(l.id, l.name) for l in shipping.luggage_ids],
                    'receiver_partner_id': shipping.receiver_partner_id.id,
                    'receiver_name': shipping.receiver_partner_id.name,
                    'receiver_email': shipping.receiver_email,
                    'receiver_phone': shipping.receiver_phone,
                    'receiver_address': shipping.receiver_address,
                    'shipping_date': shipping.shipping_date,
                    # 'travelmessage_ids': [(m.id, m.name) for m in shipping.travelmessage_ids],
                    'receiver_name_set': shipping.receiver_name_set,
                    'receiver_email_set': shipping.receiver_email_set,
                    'receiver_phone_set': shipping.receiver_phone_set,
                    'receiver_street_set': shipping.receiver_street_set,
                    'register_receiver': shipping.register_receiver,
                    'receiver_source': shipping.receiver_source,
                    'receiver_city_id': shipping.receiver_city_id.id,
                    'directory_partner_list_ids': shipping.directory_partner_list_ids,
                    'shipping_price': shipping.shipping_price,
                    'luggage_cost': shipping.luggage_cost,
                    'amount_deducted': shipping.amount_deducted,
                    'total_cost': shipping.total_cost,
                    'currency_id': shipping.currency_id.id,
                    'include_luggage_price': shipping.include_luggage_price,
                    'is_paid': shipping.is_paid,
                    'payment_method_line_id': shipping.payment_method_line_id.id,
                    'move_id': shipping.move_id.id,
                    'travel_code': shipping.travel_code,
                    'travel_partner_name': shipping.travel_partner_name,
                    'travel_departure_city_name': shipping.travel_departure_city_name,
                    'travel_arrival_city_name': shipping.travel_arrival_city_name
                })

            return {'status': 200, 'response': shipping_details, 'message': 'success'}
        else:
            return "No Parcel Found!"
