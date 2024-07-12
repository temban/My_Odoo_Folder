import json
from odoo import http
from odoo.http import request


class MyController(http.Controller):

    @http.route('/all/manager_required_bonus_points', type='http', auth='none', website=True, csrf=False, methods=['GET'])
    def get_all_manager_required_bonus_points(self):
        config_settings = request.env['res.config.settings'].sudo().search([])
        manager_required_bonus_points = [config.manager_required_bonus_points for config in config_settings]
        return json.dumps(manager_required_bonus_points)

    @http.route('/last/manager_required_bonus_points', type='http', auth='none', website=True, csrf=False, methods=['GET'])
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