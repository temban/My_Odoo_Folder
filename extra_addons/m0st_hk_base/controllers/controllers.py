import base64
import json
from odoo import http
from odoo.http import request


class MyAttachmentController(http.Controller):
    @http.route('/ticket/attachment/<int:attachment_id>', type='http', auth="none", csrf=False, website=True,
                methods=['GET'], cors='*')
    def get_attachment_image(self, attachment_id):
        attachment = request.env['ir.attachment'].sudo().browse(attachment_id)
        if attachment:
            headers = [('Content-Type', 'image/png')]  # Change the content type based on your attachment type
            image_data = base64.b64decode(attachment.datas)
            return request.make_response(image_data, headers=headers)
        else:
            return request.not_found()


class AttController(http.Controller):

    @http.route('/helpdesk/upload_attachment/<int:ticket_id>', type='http', auth='none', methods=['POST'], csrf=False, website=True)
    def upload_attachment(self, ticket_id=None):
        response = {}

        attachment = request.httprequest.files.get('attachment')

        if not ticket_id or not attachment:
            response['status'] = 'error'
            response['message'] = 'Missing parameters'
            return json.dumps(response)

        ticket = request.env['axis.helpdesk.ticket'].sudo().browse(int(ticket_id))
        if not ticket:
            response['status'] = 'error'
            response['message'] = 'Ticket not found'
            return json.dumps(response)

        attachment_data = {
            'name': attachment.filename,
            'datas': base64.b64encode(attachment.read()),
            'res_model': 'axis.helpdesk.ticket',
            'res_id': ticket.id,
        }
        attachment = request.env['ir.attachment'].sudo().create(attachment_data)
        ticket.sudo().write({'attachment_ids': [(6, 0, attachment.ids)]})


        response['status'] = 'success'
        response['message'] = 'Attachment uploaded successfully'
        return json.dumps(response)

    @http.route('/message/helpdesk/upload_attachment/<int:ticket_id>/<int:message_id>', type='http', auth='none', methods=['POST'], csrf=False, website=True)
    def upload_attachment_message(self, ticket_id=None, message_id=None):
        response = {}

        attachment = request.httprequest.files.get('attachment')

        if not ticket_id or not attachment:
            response['status'] = 'error'
            response['message'] = 'Missing parameters'
            return json.dumps(response)

        ticket = request.env['axis.helpdesk.ticket'].sudo().browse(int(ticket_id))
        if not ticket:
            response['status'] = 'error'
            response['message'] = 'Ticket not found'
            return json.dumps(response)

        attachment_data = {
            'name': attachment.filename,
            'datas': base64.b64encode(attachment.read()),
            'res_model': 'axis.helpdesk.ticket',
            'res_id': ticket.id,
        }
        attachment = request.env['ir.attachment'].sudo().create(attachment_data)
        message = request.env['mail.message'].sudo().browse(int(message_id))

        message.sudo().write({'attachment_ids': [(6, 0, attachment.ids)]})


        response['status'] = 'success'
        response['message'] = 'Attachment uploaded successfully'
        return json.dumps(response)


class AuthorMsg(http.Controller):

    @http.route('/api/get_messages_by_author/<int:author_id>', type='http', auth='none', methods=['GET'], csrf=False)
    def get_messages_by_author(self, author_id):
        # Retrieve messages by author
        messages = request.env['mail.message'].sudo().search([('author_id', '=', int(author_id))])

        # Collect fields from each message
        message_data = []
        for message in messages:
            message_data.append({
                'id': message.id,
                'subject': message.subject,
                'date': message.date.strftime('%Y-%m-%d %H:%M:%S') if message.date else None,
                'body': message.body,
                'description': message.description,
                'parent_id': message.parent_id.id if message.parent_id else False,
                'child_ids': [child.id for child in message.child_ids],
                'model': message.model,
                'ticket_id': message.res_id,
                'record_name': message.record_name,
                'message_type': message.message_type,
                'subtype_id': message.subtype_id.id if message.subtype_id else False,
                'mail_activity_type_id': message.mail_activity_type_id.id if message.mail_activity_type_id else False,
                'is_internal': message.is_internal,
                'email_from': message.email_from,
                'author_id': message.author_id.id if message.author_id else False,
                'partner_ids': [partner.id for partner in message.partner_ids],
            })

        # Return the collected message data as JSON response
        return json.dumps(message_data)


class HelpdeskTicketController(http.Controller):

    @http.route('/api/get_messages_by_author/<int:author_id>', type='http', auth='none', methods=['GET'], csrf=False)
    def get_messages_by_author(self, author_id):
            # Retrieve messages by author
            messages = request.env['mail.message'].sudo().search([('author_id', '=', int(author_id))])

            # Collect fields from each message
            message_data = []
            for message in messages:
                message_data.append({
                    'id': message.id,
                    'subject': message.subject,
                    'date': message.date.strftime('%Y-%m-%d %H:%M:%S') if message.date else None,
                    'body': message.body,
                    'description': message.description,
                    'parent_id': message.parent_id.id if message.parent_id else False,
                    'child_ids': [child.id for child in message.child_ids],
                    'model': message.model,
                    'ticket_id': message.res_id,
                    'record_name': message.record_name,
                    'message_type': message.message_type,
                    'subtype_id': message.subtype_id.id if message.subtype_id else False,
                    'mail_activity_type_id': message.mail_activity_type_id.id if message.mail_activity_type_id else False,
                    'is_internal': message.is_internal,
                    'email_from': message.email_from,
                    'author_id': message.author_id.id if message.author_id else False,
                    'partner_ids': [partner.id for partner in message.partner_ids],
                })

            # Return the collected message data as JSON response
            return json.dumps(message_data)

    @http.route('/api/get_particular_message/<int:message_id>', type='http', auth='none', methods=['GET'], csrf=False)
    def get_message(self, message_id):
        # Retrieve the message record
        message = request.env['mail.message'].sudo().browse(int(message_id))

        # Collect fields from the message
        message_data = {
                'id': message.id,
                'subject': message.subject,
                'date': message.date.strftime('%Y-%m-%d %H:%M:%S') if message.date else None,
                'body': message.body,
                'description': message.description,
                'parent_id': message.parent_id.id if message.parent_id else False,
                'child_ids': [child.id for child in message.child_ids],
                'model': message.model,
                'ticket_id': message.res_id,
                'record_name': message.record_name,
                'message_type': message.message_type,
                'subtype_id': message.subtype_id.id if message.subtype_id else False,
                'mail_activity_type_id': message.mail_activity_type_id.id if message.mail_activity_type_id else False,
                'is_internal': message.is_internal,
                'email_from': message.email_from,
                'author_id': message.author_id.id if message.author_id else False,
                'partner_ids': [partner.id for partner in message.partner_ids],
        }

        # Return the collected message data as JSON response
        return json.dumps(message_data)

    @http.route('/api/get_messages/<int:ticket_id>', type='http', auth='none', methods=['GET'], csrf=False,  website=True,)
    def get_messages(self, ticket_id):
        # Retrieve the ticket record
        ticket = request.env['axis.helpdesk.ticket'].sudo().browse(ticket_id)

        # Fetch messages related to the ticket
        messages = ticket.message_ids

        # Collect fields from each message
        message_data = []
        for message in messages:
            has_image_1920 = bool(message.author_id.image_1920)  # Check if image_1920 exists
            message_data.append({
                'id': message.id,
                'subject': message.subject,
                'date': message.date.strftime('%Y-%m-%d %H:%M:%S') if message.date else None,
                'body': message.body,
                'description': message.description,
                'parent_id': message.parent_id.id if message.parent_id else False,
                'child_ids': [child.id for child in message.child_ids],
                'model': message.model,
                'ticket_id': message.res_id,
                'record_name': message.record_name,
                'message_type': message.message_type,
                'subtype_id': message.subtype_id.id if message.subtype_id else False,
                'mail_activity_type_id': message.mail_activity_type_id.id if message.mail_activity_type_id else False,
                'is_internal': message.is_internal,
                'email_from': message.email_from,
                'author_id': message.author_id.id if message.author_id else False,
                'partner_ids': [partner.id for partner in message.partner_ids],
                'author_image_1920': has_image_1920,
                'attachment_ids': [attach.id for attach in message.attachment_ids]
            })

        # Return the collected message data as JSON response
        return json.dumps(message_data)

    @http.route('/api/create_message', type='json', auth='none', website=True, csrf=False,
                methods=['POST'])
    def create_message(self, **post):
        ticket_id = post.get('ticket_id')
        author_id = post.get('author_id')
        body = post.get('body')

        # Retrieve the ticket record
        ticket = request.env['axis.helpdesk.ticket'].sudo().browse(int(ticket_id))

        # Create the message
        message_vals = {
            'subject': ticket.name,
            'body': body,
            'model': 'axis.helpdesk.ticket',
            'res_id': ticket.id,
            'record_name': ticket.name,  # Assuming your ticket has a 'name' field
            'message_type': 'comment',  # or 'email' based on your requirement
            'author_id': author_id,  # Assuming user is the author
        }
        new_message = request.env['mail.message'].sudo().create(message_vals)

        # Link the message to the ticket
        ticket.sudo().message_ids = [(4, new_message.id)]

        return {'message': 'Message created successfully', 'data': new_message.id}


class HelpdeskTicket(http.Controller):

    @http.route('/partner/helpdesk/get_ticket/<int:partner_id>', type='http', auth='none', website=True, csrf=False,
                methods=['GET'])
    def get_partner_ticket(self, partner_id=None):
        # Check if ticket_id is provided
        if not partner_id:
            return json.dumps({'success': False, 'message': 'Ticket ID is required'})

        # Retrieve the ticket details
        tickets = request.env['axis.helpdesk.ticket'].sudo().search([('partner_id', '=', int(partner_id))])
        tickets_json = []

        for ticket in tickets:
            ticket_json = {
                'id': ticket.id,
                'name': ticket.name,
                'number': ticket.number,
                'helpdesk_team_id': ticket.helpdesk_team_id.id,
                'helpdesk_stage_id': ticket.helpdesk_stage_id.id,
                'helpdesk_ticket_type_id': ticket.helpdesk_ticket_type_id.id,
                'res_user_id': ticket.res_user_id.id,
                'not_start': ticket.not_start,
                'priority': ticket.priority,
                'partner_id': ticket.partner_id.id,
                'partner_name': ticket.partner_name,
                'partner_email': ticket.partner_email,
                'last_stage_update': ticket.last_stage_update.strftime(
                    '%Y-%m-%d %H:%M:%S') if ticket.last_stage_update else None,
                'active': ticket.active,
                'user_ids': [user.id for user in ticket.user_ids],
                'company_id': ticket.company_id.id,
                'description': ticket.description,
                'assigned_date': ticket.assigned_date.strftime('%Y-%m-%d %H:%M:%S') if ticket.assigned_date else None,
                'closed_date': ticket.closed_date.strftime('%Y-%m-%d %H:%M:%S') if ticket.closed_date else None,
                'closed': ticket.closed,
                'team_sla': ticket.team_sla,
                'sla_ids': [sla.id for sla in ticket.sla_ids],
                'sla_expired': ticket.sla_expired,
                'helpdesk__sla_deadline': ticket.helpdesk__sla_deadline.strftime(
                    '%Y-%m-%d %H:%M:%S') if ticket.helpdesk__sla_deadline else None,
                'helpdesk__sla_late': ticket.helpdesk__sla_late,
                'helpdesk_sla_state': [sla_status.id for sla_status in ticket.helpdesk_sla_state],
                'ticket_channel_helpdesk_id': ticket.ticket_channel_helpdesk_id.id,
                'date': ticket.date.strftime('%Y-%m-%d %H:%M:%S') if ticket.date else None,
                'closed_hours': ticket.closed_hours,
                'ticket_attach__no': ticket.ticket_attach__no,
                'product_boolean': ticket.product_boolean,
                'product_ids': [product.id for product in ticket.product_ids],
                'account_invoice_id': ticket.account_invoice_id.id,
                'invoice_id': ticket.invoice_id.id,
                'account_invoice_ids': [invoice.id for invoice in ticket.account_invoice_ids],
                'invoice_count': ticket.invoice_count,
                'sale_order_id': ticket.sale_order_id.id,
                'sale_id': ticket.sale_id.id,
                'sale_order_ids': [sale_order.id for sale_order in ticket.sale_order_ids],
                'sale_count': ticket.sale_count,
                'purchase_order_id': ticket.purchase_order_id.id,
                'purchase_id': ticket.purchase_id.id,
                'purchase_order_ids': [purchase_order.id for purchase_order in ticket.purchase_order_ids],
                'purchase_count': ticket.purchase_count,
                'crm_lead_id': ticket.crm_lead_id.id,
                'crm_lead_ids': [crm_lead.id for crm_lead in ticket.crm_lead_ids],
                'crm_count': ticket.crm_count,
                'crm_ticket_id': ticket.crm_ticket_id.id,
                'ticket_ids': [merge_ticket.id for merge_ticket in ticket.ticket_ids],
                'ticket_count': ticket.ticket_count,
                'merge_id': ticket.merge_id.id,
                'is_merge': ticket.is_merge,
                'reopened_desc': ticket.reopened_desc,
                're_open_bool': ticket.re_open_bool,
                'attachment_number': ticket.attachment_number,
                'is_task': ticket.is_task,
                'is_task_button': ticket.is_task_button,
                'ticket_timesheet_ids': [(timesheet.id, timesheet.name) for timesheet in ticket.ticket_timesheet_ids],
                'ticket_invoice_ids': [(invoice.id, invoice.name) for invoice in ticket.ticket_invoice_ids],
                'priority_new': ticket.priority_new,
                'comment': ticket.comment,
                'create_new_bool': ticket.create_new_bool,
                'assign_date': ticket.assign_date.strftime('%Y-%m-%d %H:%M:%S') if ticket.assign_date else None,
                'assign_hours': ticket.assign_hours,
                'date_last_stage_update': ticket.date_last_stage_update.strftime('%Y-%m-%d %H:%M:%S') if ticket.date_last_stage_update else None,
                'project_project_id': ticket.project_project_id.id,
                'tag_ids': [tag.id for tag in ticket.tag_ids],
                'closed_by_partner': ticket.closed_by_partner,
                'attachment_ids': [(attachment.id, attachment.name) for attachment in ticket.attachment_ids],
                'is_ticket_closed': ticket.is_ticket_closed,
                'close_ticket_date': ticket.close_ticket_date.strftime('%Y-%m-%d %H:%M:%S') if ticket.close_ticket_date else None,
                'is_customer_replied': ticket.is_customer_replied,
                'ticket_sla_policy_fail': ticket.ticket_sla_policy_fail,
                'ticket_sla_policy_success': ticket.ticket_sla_policy_success,
                'color': ticket.color,
                'helpdesk_ticket_state': ticket.helpdesk_ticket_state,
                'helpdesk_ticket_state_label': ticket.helpdesk_ticket_state_label,
                'helpdesk_ticket_blocked': ticket.helpdesk_ticket_blocked,
                'helpdesk_ticket_done': ticket.helpdesk_ticket_done,
                'helpdesk_ticket_normal': ticket.helpdesk_ticket_normal,
                'is_invoice': ticket.is_invoice,
                'is_invoice_button': ticket.is_invoice_button,
                'invoice_number': ticket.invoice_number,
                'account_detail': ticket.account_detail.id,
                'account_total_data': ticket.account_total_data,
                'based_on_ticket_type': ticket.based_on_ticket_type,
            }
            tickets_json.append(ticket_json)

        # Return ticket details as JSON
        return json.dumps({'success': True, 'tickets': tickets_json})

    @http.route('/helpdesk/get_ticket/<int:ticket_id>', type='http', auth='none', website=True, csrf=False, methods=['GET'])
    def get_ticket(self, ticket_id=None):
        # Check if ticket_id is provided
        if not ticket_id:
            return json.dumps({'success': False, 'message': 'Ticket ID is required'})

        # Retrieve the ticket details
        ticket = request.env['axis.helpdesk.ticket'].sudo().browse(int(ticket_id))
        attachment_ids = request.env['ir.attachment'].sudo().search(
            [('res_model', '=', 'axis.helpdesk.ticket'), ('res_id', '=', ticket.id)])
        attachment_ids = attachment_ids.ids
        # Return ticket details as JSON
        return json.dumps({'success': True, 'ticket': {
                'id': ticket.id,
                'name': ticket.name,
                'number': ticket.number,
                'message_ids': [msg_id.id for msg_id in ticket.message_ids],
                'helpdesk_team_id': ticket.helpdesk_team_id.id,
                'helpdesk_stage_id': ticket.helpdesk_stage_id.id,
                'helpdesk_ticket_type_id': ticket.helpdesk_ticket_type_id.id,
                'res_user_id': ticket.res_user_id.id,
                'not_start': ticket.not_start,
                'priority': ticket.priority,
                'partner_id': ticket.partner_id.id,
                'partner_name': ticket.partner_name,
                'partner_email': ticket.partner_email,
                'last_stage_update': ticket.last_stage_update.strftime(
                    '%Y-%m-%d %H:%M:%S') if ticket.last_stage_update else None,
                'active': ticket.active,
                'user_ids': [user.id for user in ticket.user_ids],
                'company_id': ticket.company_id.id,
                'description': ticket.description,
                'assigned_date': ticket.assigned_date.strftime('%Y-%m-%d %H:%M:%S') if ticket.assigned_date else None,
                'closed_date': ticket.closed_date.strftime('%Y-%m-%d %H:%M:%S') if ticket.closed_date else None,
                'closed': ticket.closed,
                'team_sla': ticket.team_sla,
                'sla_ids': [sla.id for sla in ticket.sla_ids],
                'sla_expired': ticket.sla_expired,
                'helpdesk__sla_deadline': ticket.helpdesk__sla_deadline.strftime(
                    '%Y-%m-%d %H:%M:%S') if ticket.helpdesk__sla_deadline else None,
                'helpdesk__sla_late': ticket.helpdesk__sla_late,
                'helpdesk_sla_state': [sla_status.id for sla_status in ticket.helpdesk_sla_state],
                'ticket_channel_helpdesk_id': ticket.ticket_channel_helpdesk_id.id,
                'date': ticket.date.strftime('%Y-%m-%d %H:%M:%S') if ticket.date else None,
                'closed_hours': ticket.closed_hours,
                'ticket_attach__no': ticket.ticket_attach__no,
                'product_boolean': ticket.product_boolean,
                'product_ids': [product.id for product in ticket.product_ids],
                'account_invoice_id': ticket.account_invoice_id.id,
                'invoice_id': ticket.invoice_id.id,
                'account_invoice_ids': [invoice.id for invoice in ticket.account_invoice_ids],
                'invoice_count': ticket.invoice_count,
                'sale_order_id': ticket.sale_order_id.id,
                'sale_id': ticket.sale_id.id,
                'sale_order_ids': [sale_order.id for sale_order in ticket.sale_order_ids],
                'sale_count': ticket.sale_count,
                'purchase_order_id': ticket.purchase_order_id.id,
                'purchase_id': ticket.purchase_id.id,
                'purchase_order_ids': [purchase_order.id for purchase_order in ticket.purchase_order_ids],
                'purchase_count': ticket.purchase_count,
                'crm_lead_id': ticket.crm_lead_id.id,
                'crm_lead_ids': [crm_lead.id for crm_lead in ticket.crm_lead_ids],
                'crm_count': ticket.crm_count,
                'crm_ticket_id': ticket.crm_ticket_id.id,
                'ticket_ids': [merge_ticket.id for merge_ticket in ticket.ticket_ids],
                'ticket_count': ticket.ticket_count,
                'merge_id': ticket.merge_id.id,
                'is_merge': ticket.is_merge,
                'reopened_desc': ticket.reopened_desc,
                're_open_bool': ticket.re_open_bool,
                'attachment_number': ticket.attachment_number,
                'is_task': ticket.is_task,
                'is_task_button': ticket.is_task_button,
                'ticket_timesheet_ids': [(timesheet.id, timesheet.name) for timesheet in ticket.ticket_timesheet_ids],
                'ticket_invoice_ids': [(invoice.id, invoice.name) for invoice in ticket.ticket_invoice_ids],
                'priority_new': ticket.priority_new,
                'comment': ticket.comment,
                'create_new_bool': ticket.create_new_bool,
                'assign_date': ticket.assign_date.strftime('%Y-%m-%d %H:%M:%S') if ticket.assign_date else None,
                'assign_hours': ticket.assign_hours,
                'date_last_stage_update': ticket.date_last_stage_update.strftime('%Y-%m-%d %H:%M:%S') if ticket.date_last_stage_update else None,
                'project_project_id': ticket.project_project_id.id,
                'tag_ids': [tag.id for tag in ticket.tag_ids],
                'closed_by_partner': ticket.closed_by_partner,
                'attachment_ids': attachment_ids,
                'is_ticket_closed': ticket.is_ticket_closed,
                'close_ticket_date': ticket.close_ticket_date.strftime('%Y-%m-%d %H:%M:%S') if ticket.close_ticket_date else None,
                'is_customer_replied': ticket.is_customer_replied,
                'ticket_sla_policy_fail': ticket.ticket_sla_policy_fail,
                'ticket_sla_policy_success': ticket.ticket_sla_policy_success,
                'color': ticket.color,
                'helpdesk_ticket_state': ticket.helpdesk_ticket_state,
                'helpdesk_ticket_state_label': ticket.helpdesk_ticket_state_label,
                'helpdesk_ticket_blocked': ticket.helpdesk_ticket_blocked,
                'helpdesk_ticket_done': ticket.helpdesk_ticket_done,
                'helpdesk_ticket_normal': ticket.helpdesk_ticket_normal,
                'is_invoice': ticket.is_invoice,
                'is_invoice_button': ticket.is_invoice_button,
                'invoice_number': ticket.invoice_number,
                'account_detail': ticket.account_detail.id,
                'account_total_data': ticket.account_total_data,
                'based_on_ticket_type': ticket.based_on_ticket_type,
        }})


class MyController(http.Controller):

    @http.route('/all/get_authorization_key', type='http', auth='none', website=True, csrf=False, methods=['GET'])
    def get_all_authorization_key(self):
        config_settings = request.env['res.config.settings'].sudo().search([])
        authorization_keys = [config.authorization_key for config in config_settings]
        return json.dumps(authorization_keys)

    @http.route('/last/get_authorization_key', type='http', auth='none', website=True, csrf=False, methods=['GET'])
    def get_last_authorization_key(self):
        # Retrieve all records from res.config.settings
        config_settings = request.env['res.config.settings'].sudo().search([])

        # Extract authorization keys from the records and store them in a list
        authorization_keys = [config.authorization_key for config in config_settings]

        # Check if there are any authorization keys
        if authorization_keys:
            # Select the last element from the list
            last_authorization_key = authorization_keys[-1]

        # Create a JSON object with the unquoted value
        response = {
            'authorization_key': last_authorization_key
        }

        # Convert the JSON object to a JSON-formatted string
        return json.dumps(response)

    @http.route('/all/get_api_key', type='http', auth='none', website=True, csrf=False, methods=['GET'])
    def get_all_auth_api_key(self):
        config_settings = request.env['res.config.settings'].sudo().search([])
        auth_api_keys = [config.auth_api_key for config in config_settings]
        return json.dumps(auth_api_keys)

    @http.route('/last/get_api_key', type='http', auth='none', website=True, csrf=False, methods=['GET'])
    def get_last_auth_api_key(self):
        # Retrieve all records from res.config.settings
        config_settings = request.env['res.config.settings'].sudo().search([])

        # Extract authorization keys from the records and store them in a list
        api_keys = [config.auth_api_key for config in config_settings]

        # Check if there are any authorization keys
        if api_keys:
            # Select the last element from the list
            last_api_key = api_keys[-1]

        # Create a JSON object with the unquoted value
        response = {
            'api_key': last_api_key
        }

        # Convert the JSON object to a JSON-formatted string
        return json.dumps(response)

    @http.route('/travel/luggage/flight/images/<int:luggage_flight_id>', type='http', auth="none", csrf=False, website=True, methods=['GET'], cors='*')
    def get_travel_luggage_image(self, luggage_flight_id):
        luggage_Type = request.env['m2st_hk_airshipping.flight.luggage'].sudo().browse(luggage_flight_id)
        print(luggage_Type.luggage_type_id.id)
        if luggage_Type:
            # Use f-string or str.format to dynamically construct the redirect URL
            redirect_url = f'/web/image/m2st_hk_airshipping.luggage.type/{luggage_Type.luggage_type_id.id}/image'
            # Alternatively, using str.format: redirect_url = '/profile/{}'.format(attachment.id)
            return request.redirect(redirect_url)
        else:
            return request.not_found()