from odoo.http import request
from odoo import http
import json


class ResUsers(http.Controller):

    @http.route('/will/get_user_by_email', type='http', auth='none', website=True, csrf=False, methods=['POST'])
    def get_a_mobile_user_by_email(self, email, **kw):
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


class PartnerController(http.Controller):

    @http.route('/get_partner/info/<int:partner_id>', type='http', auth='none', website=True, methods=['GET'])
    def get_partner_by_id(self, partner_id=None, **kw):
        try:
            partner_id = int(partner_id)
        except ValueError:
            return json.dumps({"error": "Invalid partner ID"})

        partner = request.env['res.partner'].sudo().browse(partner_id)

        if not partner.exists():
            return json.dumps({"error": "Partner not found"})

        partner_data = {
            "name": partner.name,
            "email": partner.email,
            "client_points": partner.client_points,
            "client_bonus": partner.client_bonus,
            "phone": partner.phone,
            "street": partner.street,
            "city": partner.city,
            "zip": partner.zip,
            "country": partner.country_id.name if partner.country_id else "",
            "vat": partner.vat,
            "website": partner.website,
            # Add more partner fields as needed
        }

        return json.dumps(partner_data)


class ProductController(http.Controller):

    @http.route('/get_products', type='http', auth="none", website=True, methods=['GET'])
    def get_products(self, **kwargs):
        product_ids = kwargs.get('ids', [])
        product_ids = [int(id) for id in product_ids.split(',') if id.isdigit()]
        products = request.env['appointment.product'].sudo().browse(product_ids)

        product_data = []
        for product in products:
            product_data.append({
                'id': product.id,
                'name': product.name,
                'duration_uom': product.duration_uom,
                'appointment_duration': product.appointment_duration,
                'location': product.location,
                'product_id': product.product_id.id,
                'product_price': product.product_id.list_price,
                # Add other fields here as needed

                'appointment_duration_days': product.appointment_duration_days,
                'ba_description': product.ba_description,
                'step_duration': product.step_duration,
                'step_duration_days': product.step_duration_days,

                'manual_duration': product.manual_duration,
                'min_manual_duration': product.min_manual_duration,
                'max_manual_duration': product.max_manual_duration,
                'multiple_manual_duration': product.multiple_manual_duration,

                'min_manual_duration_days': product.min_manual_duration_days,
                'max_manual_duration_days': product.max_manual_duration_days,
                'multiple_manual_duration_days': product.multiple_manual_duration_days,
                'start_round_rule': product.start_round_rule,

                'start_round_rule_days': product.start_round_rule_days,
                'checkout_time': product.checkout_time,
                'appointment_len': product.appointment_len,
                'planned_appointment_len': product.planned_appointment_len,
            })
            print(json.dumps(product_data, indent=4, default=str, ensure_ascii=False, sort_keys=True))

        return json.dumps(product_data, indent=4, default=str, ensure_ascii=False, sort_keys=True)


class BusinessAppointmentController(http.Controller):
    @http.route('/business/appointments', type='http', auth="none", website=True)
    def get_appointment_data(self, **kwargs):
        appointment_ids = kwargs.get('ids', [])
        appointment_ids = [int(id) for id in appointment_ids.split(',') if id.isdigit()]
        appointments = request.env['business.appointment'].sudo().browse(appointment_ids)

        all_appointments_data = []
        for appointment in appointments:
            all_appointments_data.append({
                # Add all the fields you need here
                "__last_update": appointment.write_date.strftime('%Y-%m-%d %H:%M:%S'),
                "access_token": False,
                "access_url": f"/my/business/appointments/{appointment.safe_file_name}",
                "datetime_start": appointment.datetime_start.strftime('%Y-%m-%d %H:%M:%S'),
                "datetime_end": appointment.datetime_end.strftime('%Y-%m-%d %H:%M:%S'),
                "create_date": appointment.create_date.strftime('%Y-%m-%d %H:%M:%S'),
                "schedule_datetime": appointment.schedule_datetime.strftime('%Y-%m-%d %H:%M:%S'),
                "start_slot_datetime": appointment.start_slot_datetime.strftime('%Y-%m-%d %H:%M:%S'),

                "activity_calendar_event_id": False,
                "activity_date_deadline": False,
                "activity_exception_decoration": False,
                "activity_exception_icon": False,
                "activity_ids": [],
                "activity_state": False,
                "activity_summary": False,
                "activity_type_icon": False,
                "activity_type_id": False,
                "activity_user_id": False,
                "agree_terms": False,
                "alarm_ids": [],
                "can_publish": True,
                "city": False,
                "company_id": [
                    appointment.company_id.id,
                    appointment.company_id.name,
                ],
                "contact_name": False,
                "country_id": False,
                "create_uid": [
                    appointment.create_uid.id,
                    appointment.create_uid.name,
                ],
                "day_month": appointment.day_month,
                "day_year": appointment.day_year,
                "description": False,
                "discount_type": "none",  # Replace with the actual value
                "display_name": appointment.display_name,
                "duration": appointment.duration,
                "email": False,
                "error": False,
                "extra_product_ids": [],  # Add data for this field if needed
                "extra_resource_ids": [],  # Add data for this field if needed
                "function": False,
                "has_message": True,
                "id": appointment.id,
                "info_resource_id": [
                    appointment.info_resource_id.id,
                    appointment.info_resource_id.name,
                ],
                "is_published": False,
                "lang": appointment.lang,
                "late_to_know": False,
                "message_attachment_count": 0,  # Add data for this field if needed
                "message_follower_ids": [],  # Add data for this field if needed
                "message_has_error": False,
                "message_has_error_counter": 0,
                "message_has_sms_error": False,
                "message_ids": [],  # Add data for this field if needed
                "message_is_follower": False,
                "message_main_attachment_id": False,
                "message_needaction": False,
                "message_needaction_counter": 0,
                "message_partner_ids": [],  # Add data for this field if needed
                "message_unread": False,
                "message_unread_counter": 0,
                "mobile": False,
                "my_activity_date_deadline": False,
                "name": appointment.name,

                "parent_company_id": False,
                "partner_id": [
                    appointment.partner_id.id,
                    appointment.partner_id.name,
                ],
                "partner_name": False,
                "percentage_value": 0.0,
                "phone": False,
                "pricelist_id": [
                    appointment.pricelist_id.id,
                    appointment.pricelist_id.name,
                ],
                "product_discount_id": False,
                "product_line_bonus_ids": [],  # Add data for this field if needed
                "rating_avg": 0.0,
                "rating_count": 0,
                "rating_ids": [],  # Add data for this field if needed
                "rating_last_feedback": False,
                "rating_last_image": False,
                "rating_last_value": 0.0,
                "report_duration_days": appointment.report_duration_days,
                "report_duration_hours": appointment.report_duration_hours,
                "reservation_group_id": False,
                "resource_color": appointment.resource_color,
                "resource_id": [
                    appointment.resource_id.id,
                    appointment.resource_id.name,
                ],
                "resource_type_id": [
                    appointment.resource_type_id.id,
                    appointment.resource_type_id.name,
                ],
                "safe_file_name": appointment.safe_file_name,
                "sale_state": "draft",  # Replace with the actual value
                "service_id": [
                    appointment.service_id.id,
                    appointment.service_id.name,
                    appointment.service_id.product_id.list_price,
                ],
                "state": appointment.state,
                "state_id": False,
                "street": False,
                "street2": False,
                "success": False,
                "title": False,
                "tz": False,
                "user_id": [
                    appointment.user_id.id,
                    appointment.user_id.name,
                ],
                "video_channel_id": False,
                "videocall": False,
                "website_id": False,
                "website_message_ids": [],  # Add data for this field if needed
                "website_published": False,
                "website_url": f"/my/business/appointments/{appointment.safe_file_name}",
                "write_uid": [
                    appointment.write_uid.id,
                    appointment.write_uid.name,
                ],
                "zipcode": False,

            })

        # Serialize the list of dictionaries into a JSON response
        return json.dumps(all_appointments_data, indent=4, default=str, ensure_ascii=False, sort_keys=True)
