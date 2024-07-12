from odoo import http
from odoo.http import request, Response
import json
import base64
from odoo.addons.portal.controllers.portal import CustomerPortal, pager as portal_pager
import os
import datetime

module_path = os.path.dirname(os.path.abspath(__file__))


class PartnerRatingController(http.Controller):

    @http.route('/partner/get_ratings', type='http', auth='public', methods=['GET'])
    def get_ratings(self, rated_partner_id=None, **kwargs):
        if rated_partner_id is None:
            return json.dumps({'error': 'rated_partner_id parameter is missing'})

        ratings = request.env['res.partner.rating'].sudo().search([('rated_id', '=', int(rated_partner_id))])
        rating_data = []

        for rating in ratings:
            rater_id = rating.rater_id.id
            rater_image = rating.rater_id.image_1920 if rating.rater_id.image_1920 else False
            if rater_image:
                rater_image = base64.b64encode(rater_image).decode('utf-8')

            rating_data.append({
                'rating': rating.rating,
                'comment': rating.comment,
                'rating_date': rating.rating_date.strftime('%Y-%m-%d'),
                'rater_id': rater_id,
                'rater_name': rating.rater_id.name,
                'average_rating': rating.average_rating,
                'rater_image': rater_image,
            })

        return json.dumps({'ratings': rating_data})


class ResUsers(http.Controller):

    @http.route('/get_user_by_email', type='http', auth='none', website=True, csrf=False, methods=['POST'])
    def get_a_user_by_email(self, email, **kw):
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


class MyTravels(CustomerPortal):

    def _prepare_home_portal_values(self, counters):
        values = super()._prepare_home_portal_values(counters)
        if 'travel_count' in counters:
            travel_count = request.env['m1st_hk_roadshipping.travelbooking'].sudo().search_count(
                [('partner_id', '=', request.env.user.partner_id.id)])
            values['travel_count'] = travel_count
        return values


class TravelMessageControllers(http.Controller):

    @http.route('/m1st_hk_roadshipping/get_messages_by_shipping_id', type='json', auth='none', methods=['POST'])
    def get_messages_by_shipping_id(self, **post_data):
        shipping_id = post_data.get('shipping_id', None)

        if shipping_id is None:
            return {'error': 'Shipping ID is required.'}

        messages = request.env['m1st_hk_roadshipping.travelmessage'].sudo().search([('shipping_id', '=', shipping_id)])

        message_list = []
        for message in messages:
            sender_image_exists = bool(message.sender_partner_id.image_1920)

            message_data = {
                'id': message.id,
                'name': message.name,
                'date': message.date,
                'sender_partner_id': [message.sender_partner_id.id, message.sender_partner_id.name],
                'receiver_partner_id': [message.receiver_partner_id.id, message.receiver_partner_id.name],
                'price': message.price,
                'state': message.state,
                'shipper_validate': message.shipper_validate,
                'msg_flow': message.msg_flow,
                'parent_id': message.parent_id.name if message.parent_id else None,
                'child_ids': [child.name for child in message.child_ids],
                'travelbooking_id': message.travelbooking_id.id,
                'shipping_id': message.shipping_id.id,
                'travel_partner_id': message.travel_partner_id.name if message.travel_partner_id else None,
                'shipping_partner_id': [message.shipping_partner_id.id, message.shipping_partner_id.name],
                'mail_channel_id': message.mail_channel_id.name if message.mail_channel_id else None,
                'mail_record_name': message.mail_record_name,
                'sender_image': sender_image_exists,
            }
            message_list.append(message_data)

        return {'messages': message_list}


class MyShipping(CustomerPortal):
    def _prepare_home_portal_values(self, counters):
        values = super()._prepare_home_portal_values(counters)
        if 'ship_count' in counters:
            ship_count = request.env['m1st_hk_roadshipping.shipping'].sudo().search_count(
                [('partner_id', '=', request.env.user.partner_id.id)])
            values['ship_count'] = ship_count
        return values


class MyParcels(CustomerPortal):
    def _prepare_home_portal_values(self, counters):
        values = super()._prepare_home_portal_values(counters)
        if 'parcel_count' in counters:
            parcel_count = request.env['m1st_hk_roadshipping.shipping'].sudo().search_count(
                [('receiver_partner_id', '=', request.env.user.partner_id.id)])
            values['parcel_count'] = parcel_count
        return values


class PartnerController(http.Controller):
    @http.route('/all/partners', type='http', auth='none', methods=['GET'])
    def get_partners_as_json(self):
        partners = request.env['res.partner'].sudo().search([])
        partner_data = []

        for partner in partners:
            image_data = partner.image_1920 if partner.image_1920 else b''
            encoded_image = base64.b64encode(image_data).decode('utf-8')

            partner_data.append({
                'id': partner.id,
                'name': partner.name,
                'email': partner.email,
                'image': encoded_image
            })
        return json.dumps(partner_data)


class MyPortal(http.Controller):
    @http.route('/add/travel', website=True, type='http', auth='user')
    def my_ajouter_voyage_page(self, **kw):
        cities = request.env['res.city'].search([])

        return http.request.render('hubkilo_website.ajouter', {
            'cities': cities,
        })

    @http.route('/profile', website=True, auth='user')
    def portal_main(selfself, **kwargs):
        return request.render('hubkilo_website.profile_page', {})

    @http.route('/', website=True, type='http', auth='public')
    def my_home_page(self, **kw):
        return request.render('hubkilo_website.hub_home', {})

    @http.route(['/travels/<departure_town>/<arrival_town>/<travel_type>', '/travels'], website=True, type='http',
                auth='public')
    def my_voyages_page(self, departure_town=None, arrival_town=None, travel_type=None, **kwargs):
        return request.render('hubkilo_website.voyages', {})

    @http.route('/modifier/<int:travel_id>', website=True, type='http', auth='user')
    def my_modifier_page(self, **kw):
        cities = request.env['res.city'].search([])

        return http.request.render('hubkilo_website.modifier', {
            'cities': cities,
        })

    @http.route('/booking/page/<type>/<int:travel_id>', website=True, type='http', auth='user')
    def my_travel_page(self, **kw):
        return request.render('hubkilo_website.voyages_page', {})

    @http.route('/modifier_ma_reservation/<int:booking_id>', website=True, type='http', auth='user')
    def my_reservation_page_modifier(self, **kw):
        return request.render('hubkilo_website.modifier_la_reservation_page', {})

    @http.route('/updateProfile', website=True, type='http', auth='user')
    def updateProfile(self, **kw):
        cities = request.env['res.city'].search([])

        return http.request.render('hubkilo_website.updateProfile', {
            'cities': cities,
        })

    @http.route('/my_negotiation', website=True, type='http', auth='user')
    def my_negotiation(self, **kw):
        return request.render('hubkilo_website.my_negotiation_page', {})

    @http.route('/identification', website=True, type='http', auth='user')
    def identification_page(self, **kw):
        return request.render('hubkilo_website.identification_page', {})

    @http.route('/city', type='http', auth='user', website=True, )
    def city_list(self, **kw):
        cities = request.env['res.city'].search([])

        return http.request.render('hubkilo_website.ajouter', {
            'cities': cities,
        })

    @http.route('/all/road/search/travel', type='json', auth='none', csrf=False, website=True, methods=['POST'],
                cors='*')
    def road_travel_search(self, **kw):
        departure_city_id = kw.get('departure_city_id')
        arrival_city_id = kw.get('arrival_city_id')
        booking_type = kw.get('booking_type')
        roadshippings = request.env['m1st_hk_roadshipping.travelbooking'].sudo().search(
            [('booking_type', '=', booking_type), ('departure_city_id', '=', int(departure_city_id)),
             ('arrival_city_id', '=', int(arrival_city_id))])
        travels_search = []
        if roadshippings:
            for travel in roadshippings:
                travels_results = {
                    'id': travel.id,
                    'average_rating': travel.partner_id.average_rating,
                    'partner_id': [travel.partner_id.id, travel.partner_id.name],
                    'name': travel.name,
                    'code': travel.code,
                    'state': travel.state,
                    'booking_date': travel.booking_date,
                    'shipping_ids': [(shipping.id, shipping.name) for shipping in travel.shipping_ids],
                    'travelmessage_ids': [(message.id, message.name) for message in travel.travelmessage_ids],
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
                }
                travels_search.append(travels_results)
            result = {'status': 200, 'response': travels_search, 'message': 'success'}
            return result
        else:
            return 'Empty!'

    @http.route('/road/receiver/shipping/get_details/<int:partner_id>', auth='none', type='json', methods=['POST'])
    def get_receiver_shipping_details(self, partner_id, **kw):
        shipping_model = request.env['m1st_hk_roadshipping.shipping']
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
                    'position': shipping.position,
                    'luggage_ids': [(l.id, l.name) for l in shipping.luggage_ids],
                    'receiver_partner_id': shipping.receiver_partner_id.id,
                    'receiver_name': shipping.receiver_partner_id.name,
                    'receiver_email': shipping.receiver_email,
                    'receiver_phone': shipping.receiver_phone,
                    'receiver_address': shipping.receiver_address,
                    'shipping_date': shipping.shipping_date,
                    'travelmessage_ids': [(m.id, m.name) for m in shipping.travelmessage_ids],
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

    @http.route('/road/my_shipping/get_details', auth='none', type='json', methods=['POST'])
    def get_shipping_details(self, **kw):
        partner_id = kw.get('partner_id')
        shipping_model = request.env['m1st_hk_roadshipping.shipping']
        if shipping_model.sudo().search([('partner_id', '=', partner_id)]):
            shippings = shipping_model.sudo().search([('partner_id', '=', partner_id)])
            print("partner=========================================")
        shipping_details = []
        for shipping in shippings:
            shipping_details.append({
                'name': shipping.name,
                'partner_id': shipping.partner_id.id,
                'travelbooking_id': shipping.travelbooking_id.id,
                'booking_type': shipping.booking_type,
                'state': shipping.state,
                'disable': shipping.disable,
                'travel_partner_latitude': shipping.travel_partner_latitude,
                'travel_partner_longitude': shipping.travel_partner_longitude,
                'position': shipping.position,
                'luggage_ids': [(l.id, l.name) for l in shipping.luggage_ids],
                # 'total_weight': shipping.total_weight,
                'receiver_partner_id': shipping.receiver_partner_id.id,
                'receiver_email': shipping.receiver_email,
                'receiver_phone': shipping.receiver_phone,
                'receiver_address': shipping.receiver_address,
                'shipping_date': shipping.shipping_date,
                'travelmessage_ids': [(m.id, m.name) for m in shipping.travelmessage_ids],
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

    @http.route('/my/shipping', website=True, type='http', auth='user')
    def my_shipping_page(self, departure_town=None, arrival_town=None, travel_type=None, **kwargs):
        return request.render('hubkilo_website.shipping', {})

    @http.route('/my/receiver', website=True, type='http', auth='user')
    def receiver_page(self, departure_town=None, arrival_town=None, travel_type=None, **kwargs):
        return request.render('hubkilo_website.receiver', {})

    @http.route('/travel/shipping', website=True, type='http', auth='user')
    def my_shipping_page_alone(self, departure_town=None, arrival_town=None, travel_type=None, **kwargs):
        return request.render('hubkilo_website.my_shipping', {})

    @http.route('/shipping/luggage/confirm/<int:shipping_id>', auth='none', csrf=False, website=True,
                methods=['PUT'], type='json', cors='*')
    def update_shipping_parcel(self, shipping_id, **kw):
        shipping = request.env['m1st_hk_roadshipping.shipping'].sudo().browse(shipping_id)
        if shipping:
            shipping.sudo().write({
                'parcel_received': True,
            })
            shipping_parcel_updated = {'parcel_received': shipping.parcel_received}
            return {'status': 200, 'data': shipping_parcel_updated,
                    'message': 'The Traveller has confirmed receiving the luggage.'}
        else:
            return 'Request Failed'

    @http.route('/my/travels', website=True, type='http', auth='user')
    def my_travels_alone(self, departure_town=None, arrival_town=None, travel_type=None, **kwargs):
        return request.render('hubkilo_website.mytravels', {})

    @http.route('/my/shipping/details', website=True, type='http', auth='user')
    def my_shipping_details(self, departure_town=None, arrival_town=None, travel_type=None, **kwargs):
        return request.render('hubkilo_website.shipping_details', {})

    @http.route('/my/traveler/shipping/details', website=True, type='http', auth='user')
    def my_traveler_shipping_details(self, departure_town=None, arrival_town=None, travel_type=None, **kwargs):
        return request.render('hubkilo_website.shipping_traveler_details', {})

    @http.route('/check_profile_pic/<int:partner_id>', type='http', auth='public', website=True)
    def check_profile_pic(self, partner_id):
        Partner = request.env['res.partner']
        partner = Partner.browse(partner_id)
        return str(bool(partner.image_1920))

    @http.route('/get_cities', type='http', auth='public', website=True, cors='*')
    def get_cities(self, **kw):
        cities = request.env['res.city'].search([])

        # Convert cities data to JSON format
        cities_data = [{'id': city.id, 'name': city.name, "country": city.country_name} for city in cities]

        # Create the JSON response
        response_data = {
            'cities': cities_data
        }

        # Convert the response_data to a JSON string
        response_json = json.dumps(response_data)

        # Set the proper content type in the response headers
        headers = {'Content-Type': 'application/json'}
        return Response(response_json, headers=headers)

    @http.route('/add/new/travel', website=True, type='http', auth='user')
    def my_travel_new_page(self, **kw):
        cities = request.env['res.city'].search([])

        return http.request.render('hubkilo_website.create_travel', {
            'cities': cities,
        })

    @http.route('/my/travel/details/<int:travel_id>', website=True, type='http', auth='user')
    def my_wizard_details(self, departure_town=None, arrival_town=None, travel_type=None, **kwargs):
        return request.render('hubkilo_website.my_travel_details', {})

    @http.route('/all/hub_raod/travels', auth='none', website=True, csrf=False, type='json', methods=['POST'])
    def paginate_travels(self, **kw):

        travels_due = request.env['m1st_hk_roadshipping.travelbooking'].sudo().search([])

        # Get the current date
        current_date = datetime.date.today()

        # Check and update the travel_due field
        for travel in travels_due:
            if travel.departure_date.date() < current_date:
                # If the arrival_date is in the past, set travel_due to True
                travel.sudo().write({'travel_due': True})

        travels = request.env['m1st_hk_roadshipping.travelbooking'].sudo().search([('state', '=', 'negotiating'),
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
                'average_rating': travel.partner_id.average_rating,
                'travel_due': travel.travel_due,
                'booking_date': travel.booking_date.strftime('%Y-%m-%d'),
                'shipping_ids': [(shipping.id, shipping.name) for shipping in travel.shipping_ids],
                'travelmessage_ids': [(message.id, message.name) for message in travel.travelmessage_ids],
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
                'luggage_ids': [(luggage.id, luggage.name) for luggage in travel.luggage_ids],
                'total_weight': travel.total_weight,
                'booking_price': travel.booking_price,
                'local_currency_id': [travel.local_currency_id.id, travel.local_currency_id.currency_unit_label],
                'partner_image_1920': exist,
                'move_ids': [(move.id, move.name) for move in travel.move_ids],
            }
            travels_json.append(travel_json)

        # Building the JSON response
        response = {
            'travels': travels_json,
            'page': page,
            'total_pages': total_pages,
        }
        return response

    @http.route('/front_end/road/travels', auth='none', website=True, csrf=False, type='http', method=['GET'])
    def frontend_road_travels(self, **kw):

        travels_due = request.env['m1st_hk_roadshipping.travelbooking'].sudo().search([])

        # Get the current date
        current_date = datetime.date.today()

        # Check and update the travel_due field
        for travel in travels_due:
            if travel.departure_date.date() < current_date:
                # If the arrival_date is in the past, set travel_due to True
                travel.sudo().write({'travel_due': True})

        travels = request.env['m1st_hk_roadshipping.travelbooking'].sudo().search([('state', '=', 'negotiating'),
                                                                                   ('travel_due', '=', False)])

        # Converting the travels to JSON
        travels_json = []
        for travel in travels:
            exist = bool(travel.partner_id.image_1920)
            travel_json = {
                'id': travel.id,
                'partner_id': [travel.partner_id.id, travel.partner_id.name],
                'state': travel.state,
                'average_rating': travel.partner_id.average_rating,
                'travel_due': travel.travel_due,
                'booking_date': travel.booking_date.strftime('%Y-%m-%d'),
                'shipping_ids': [(shipping.id, shipping.name) for shipping in travel.shipping_ids],
                'travelmessage_ids': [(message.id, message.name) for message in travel.travelmessage_ids],
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
                'luggage_ids': [(luggage.id, luggage.name) for luggage in travel.luggage_ids],
                'total_weight': travel.total_weight,
                'booking_price': travel.booking_price,
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

    @http.route('/add/new/shipping', website=True, type='http', auth='user')
    def my_shipping_new_page(self, **kw):
        return request.render('hubkilo_website.create_shipping', {})

    @http.route('/shipping/offers', website=True, type='http', auth='user')
    def shipping_offers_page(self, **kw):
        return request.render('hubkilo_website.shipping_offers', {})

    @http.route('/my/shipping/offers', website=True, type='http', auth='user')
    def my_shipping_offers_page(self, **kw):
        return request.render('hubkilo_website.my_shipping_offers', {})

    @http.route('/shipping/offers/details', website=True, type='http', auth='user')
    def shipping_offers_details(self, **kw):
        return request.render('hubkilo_website.shipping_offer_details', {})

    @http.route('/all/hub_road/shipping', auth='none', website=True, type='json', methods=['POST'])
    def paginate_shipping(self, **kw):
        # Define the number of items per page
        items_per_page = 6

        # Retrieve the shipping records with no travelbooking_id
        shipping_records = request.env['m1st_hk_roadshipping.shipping'].sudo().search(
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
            shipping_data.append({
                'id': shipping.id,
                'name': shipping.name,
                'partner_id': shipping.partner_id.id,
                'state': shipping.state,
                'booking_type': shipping.booking_type,
                'total_weight': shipping.total_weight,
                'receiver_partner_id': shipping.receiver_partner_id.id,
                'receiver_email': shipping.receiver_email,
                'receiver_phone': shipping.receiver_phone,
                'receiver_address': shipping.receiver_address,
                'shipping_date': shipping.shipping_date.strftime('%Y-%m-%d %H:%M:%S'),
                'register_receiver': shipping.register_receiver,
                'receiver_source': shipping.receiver_source,
                'receiver_city_id': shipping.receiver_city_id.id,
                'shipping_departure_city_id': [
                    shipping.shipping_departure_city_id.id,
                    shipping.shipping_departure_city_id.name + " (" + shipping.shipping_departure_city_id.country_name + ")"
                ],
                'shipping_arrival_city_id': [
                    shipping.shipping_arrival_city_id.id,
                    shipping.shipping_arrival_city_id.name + " (" + shipping.shipping_arrival_city_id.country_name + ")"
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

    @http.route('/shipping/test', website=True, type='http', auth='user')
    def my_shipping_offers_page(self, **kw):
        return request.render('hubkilo_website.shipping_details_test', {})
