import json
from odoo import http
from odoo.http import request


class ResPartnerPoints(http.Controller):

    @http.route('/user/fidelity/partner/<int:partner_id>/points/<int:points>', type='json', auth='none', website=True,
                methods=['POST'])
    def update_client_points_bonus(self, partner_id=None, points=None, **kw):
        partner = http.request.env['res.partner'].sudo().search([('id', '=', partner_id)])

        if partner:
            # Update the client_points field
            partner.sudo().write({'client_points': points})

            # Return a success message
            return {'success': True, 'message': '%s Points updated successfully.' % partner.name}
        else:
            return {'success': False, 'message': 'Partner not found.'}


class AuthKeys(http.Controller):

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


class MyController(http.Controller):

    @http.route('/all/manager_required_bonus_points', type='http', auth='none', website=True, csrf=False,
                methods=['GET'])
    def get_all_manager_required_bonus_points(self):
        config_settings = request.env['res.config.settings'].sudo().search([])
        manager_required_bonus_points = [config.manager_required_bonus_points for config in config_settings]
        return json.dumps(manager_required_bonus_points)

    @http.route('/last/manager_required_bonus_points', type='http', auth='none', website=True, csrf=False,
                methods=['GET'])
    def get_last_manager_required_bonus_points(self):
        # Retrieve all records from res.config.settings
        config_settings = request.env['res.config.settings'].sudo().search([])

        # Extract authorization keys from the records and store them in a list
        manager_required_bonus_points = [config.manager_required_bonus_points for config in config_settings]

        # Check if there are any authorization keys
        if manager_required_bonus_points:
            # Select the last element from the list
            last_manager_required_bonus_points = manager_required_bonus_points[-1]

        # Create a JSON object with the unquoted value
        response = {
            'manager_required_bonus_points': last_manager_required_bonus_points
        }

        # Convert the JSON object to a JSON-formatted string
        return json.dumps(response)
