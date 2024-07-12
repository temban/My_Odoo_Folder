import json
from odoo import http
from odoo.http import request


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
