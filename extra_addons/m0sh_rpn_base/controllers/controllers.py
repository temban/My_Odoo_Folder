import base64
import json
from odoo import http
from odoo.http import request

class MyAttachmentController(http.Controller):
    @http.route('/rpn/attachment/image/<int:attachment_id>', type='http', auth="none", website=True, csrf=False,
                methods=['GET'])
    def get_attachment_image(self, attachment_id):
        attachment = request.env['ir.attachment'].sudo().browse(attachment_id)
        if attachment:
            headers = [('Content-Type', 'image/png')]  # Change the content type based on your attachment type
            image_data = base64.b64decode(attachment.datas)
            return request.make_response(image_data, headers=headers)
        else:
            return request.not_found()

    @http.route('/my/home', type='http', auth="public", website=True, sitemap=False)
    def go_to_my_profile(self, **kw):
        return request.redirect('/')

    @http.route('/my', type='http', auth="public", website=True, sitemap=False)
    def go_to_my_profile_two(self, **kw):
        return request.redirect('/')

class MyController(http.Controller):

    @http.route('/rpn/all/min_membership_amount', type='http', auth='none', website=True, csrf=False,
                methods=['GET'])
    def get_all_rpn_min_membership_amount(self):
        config_settings = request.env['res.config.settings'].sudo().search([])
        rpn_base_config_min_membership_amount = [config.rpn_base_config_min_membership_amount for config in
                                                 config_settings]
        return json.dumps(rpn_base_config_min_membership_amount)

    @http.route('/rpn/last/min_membership_amount', type='http', auth='none', website=True, csrf=False,
                methods=['GET'])
    def get_last_rpn_min_membership_amount(self):
        # Retrieve all records from res.config.settings
        config_settings = request.env['res.config.settings'].sudo().search([])

        # Extract authorization keys from the records and store them in a list
        rpn_base_config_min_membership_amount = [config.rpn_base_config_min_membership_amount for config in
                                                 config_settings]

        # Check if there are any authorization keys
        if rpn_base_config_min_membership_amount:
            # Select the last element from the list
            last_rpn_base_config_min_membership_amount = rpn_base_config_min_membership_amount[-1]
        else:
            last_rpn_base_config_min_membership_amount = 'Please save the key'

        # Create a JSON object with the unquoted value
        response = {
            'rpn_membership_fee': last_rpn_base_config_min_membership_amount
        }

        # Convert the JSON object to a JSON-formatted string
        return json.dumps(response)

    @http.route('/rpn/all/minimum_recharge', type='http', auth='none', website=True, csrf=False,
                methods=['GET'])
    def get_all_minimum_recharge(self):
        config_settings = request.env['res.config.settings'].sudo().search([])
        rpn_base_config_min_account_balance = [config.rpn_base_config_min_account_balance for config in config_settings]
        return json.dumps(rpn_base_config_min_account_balance)

    @http.route('/rpn/last/minimum_recharge', type='http', auth='none', website=True, csrf=False,
                methods=['GET'])
    def get_last_rpn_minimum_recharge(self):
        # Retrieve all records from res.config.settings
        config_settings = request.env['res.config.settings'].sudo().search([])

        # Extract authorization keys from the records and store them in a list
        rpn_base_config_min_account_balance = [config.rpn_base_config_min_account_balance for config in config_settings]

        # Check if there are any authorization keys
        if rpn_base_config_min_account_balance:
            # Select the last element from the list
            last_rpn_base_config_min_account_balance = rpn_base_config_min_account_balance[-1]
        else:
            last_rpn_base_config_min_account_balance = 'Please save the key'

        # Create a JSON object with the unquoted value
        response = {
            'rpn_min_account_recharge': last_rpn_base_config_min_account_balance
        }

        # Convert the JSON object to a JSON-formatted string
        return json.dumps(response)

    @http.route('/rpn/all/rpn_base_config_currency_id', type='http', auth='none', website=True, csrf=False,
                methods=['GET'])
    def get_all_rpn_base_config_currency_id(self):
        config_settings = request.env['res.config.settings'].sudo().search([])
        rpn_base_config_currency_id = [
            (config.rpn_base_config_currency_id.name, config.rpn_base_config_currency_id.full_name) for config in
            config_settings]
        return json.dumps(rpn_base_config_currency_id)

    @http.route('/rpn/last/rpn_base_config_currency_id', type='http', auth='none', website=True, csrf=False,
                methods=['GET'])
    def get_last_rpn_base_config_currency_id(self):
        # Retrieve all records from res.config.settings
        config_settings = request.env['res.config.settings'].sudo().search([])

        # Extract authorization keys from the records and store them in a list
        rpn_base_config_currency_ids = [
            (config.rpn_base_config_currency_id.name, config.rpn_base_config_currency_id.full_name) for config in
            config_settings]

        # Check if there are any authorization keys
        if rpn_base_config_currency_ids:
            # Select the last element from the list
            last_rpn_base_config_currency_id = rpn_base_config_currency_ids[-1]
        else:
            last_rpn_base_config_currency_id = 'Please save the key'

        # Create a JSON object with the unquoted value
        response = {
            'rpn_currency_id': last_rpn_base_config_currency_id
        }

        # Convert the JSON object to a JSON-formatted string
        return json.dumps(response)

    @http.route('/rpn/all/get_authorization_key', type='http', auth='none', website=True, csrf=False, methods=['GET'])
    def get_all_authorization_key(self):
        config_settings = request.env['res.config.settings'].sudo().search([])
        authorization_keys = [config.authorization_key for config in config_settings]
        return json.dumps(authorization_keys)

    @http.route('/rpn/last/get_authorization_key', type='http', auth='none', website=True, csrf=False, methods=['GET'])
    def get_last_authorization_key(self):
        # Retrieve all records from res.config.settings
        config_settings = request.env['res.config.settings'].sudo().search([])

        # Extract authorization keys from the records and store them in a list
        authorization_keys = [config.authorization_key for config in config_settings]

        # Check if there are any authorization keys
        if authorization_keys:
            # Select the last element from the list
            last_authorization_key = authorization_keys[-1]
        else:
            last_authorization_key = 'Please save the key'

        # Create a JSON object with the unquoted value
        response = {
            'authorization_key': last_authorization_key
        }

        # Convert the JSON object to a JSON-formatted string
        return json.dumps(response)

    @http.route('/rpn/all/get_api_key', type='http', auth='none', website=True, csrf=False, methods=['GET'])
    def get_all_auth_api_key(self):
        config_settings = request.env['res.config.settings'].sudo().search([])
        auth_api_keys = [config.auth_api_key for config in config_settings]
        return json.dumps(auth_api_keys)

    @http.route('/rpn/last/get_api_key', type='http', auth='none', website=True, csrf=False, methods=['GET'])
    def get_last_auth_api_key(self):
        try:
            # Retrieve all records from res.config.settings
            config_settings = request.env['res.config.settings'].sudo().search([])

            # Extract authorization keys from the records and store them in a list
            api_keys = [config.auth_api_key for config in config_settings if config.auth_api_key]

            if api_keys:
                # Select the last element from the list
                last_api_key = api_keys[-1]
            else:
                last_api_key = None

            # Create a JSON object with the API key
            response = {
                'api_key': last_api_key
            }

            # Convert the JSON object to a JSON-formatted string and return it
            return json.dumps(response)

        except Exception as e:
            # Handle any exceptions and log the error
            return json.dumps({'error': str(e)})

    @http.route('/rpn/all/get_percentages', type='http', auth='none', website=True, csrf=False, methods=['GET'])
    def get_all_percentage(self):
        config_settings = request.env['res.config.settings'].sudo().search([])
        rpn_base_config_percentages = [config.rpn_base_config_percentage for config in config_settings]
        return json.dumps(rpn_base_config_percentages)

    @http.route('/rpn/last/get_percentage', type='http', auth='none', website=True, csrf=False, methods=['GET'])
    def get_last_percentage(self):
        try:
            # Retrieve all records from res.config.settings
            config_settings = request.env['res.config.settings'].sudo().search([])

            # Extract authorization keys from the records and store them in a list
            rpn_base_config_percentages = [config.rpn_base_config_percentage for config in config_settings if config.rpn_base_config_percentage]

            if rpn_base_config_percentages:
                # Select the last element from the list
                last_rpn_base_config_percentage = rpn_base_config_percentages[-1]
            else:
                last_rpn_base_config_percentage = None

            # Create a JSON object with the API key
            response = {
                'rpn_base_config_percentage': last_rpn_base_config_percentage
            }

            # Convert the JSON object to a JSON-formatted string and return it
            return json.dumps(response)

        except Exception as e:
            # Handle any exceptions and log the error
            return json.dumps({'error': str(e)})

    @http.route('/rpn/all/get_reactivations', type='http', auth='none', website=True, csrf=False, methods=['GET'])
    def get_all_re_activation_fee(self):
        config_settings = request.env['res.config.settings'].sudo().search([])
        rpn_base_config_re_activation_fees = [config.rpn_base_config_re_activation_fee for config in config_settings]
        return json.dumps(rpn_base_config_re_activation_fees)

    @http.route('/rpn/last/get_reactivation', type='http', auth='none', website=True, csrf=False, methods=['GET'])
    def get_last_re_activation_fee(self):
        try:
            # Retrieve all records from res.config.settings
            config_settings = request.env['res.config.settings'].sudo().search([])

            # Extract authorization keys from the records and store them in a list
            rpn_base_config_re_activation_fees = [config.rpn_base_config_re_activation_fee for config in config_settings if
                                           config.rpn_base_config_re_activation_fee]

            if rpn_base_config_re_activation_fees:
                # Select the last element from the list
                last_rpn_base_config_re_activation_fee = rpn_base_config_re_activation_fees[-1]
            else:
                last_rpn_base_config_re_activation_fee = None

            # Create a JSON object with the API key
            response = {
                're_activation_fee': last_rpn_base_config_re_activation_fee
            }

            # Convert the JSON object to a JSON-formatted string and return it
            return json.dumps(response)

        except Exception as e:
            # Handle any exceptions and log the error
            return json.dumps({'error': str(e)})
