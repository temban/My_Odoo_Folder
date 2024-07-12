from odoo import http
from odoo.http import request, Response
from pusher import Pusher
import json

# pusher = Pusher(
#     app_id="1663724",
#     key="a7d67608f236b9565325",
#     secret="b83f97c2ef83e7d7dbbf",
#     cluster="eu",
#     ssl=True,
# )


class TravelController(http.Controller):

    @http.route('/create_travel', type='http', auth='none', website=True, csrf=False)
    def create_new_travel(self, **post):
        source = post.get('source1')
        destination = post.get('destination1')

        travel_record = request.env['sockets.travel'].sudo().create({
                'source1': "banjun",
                'destination1': "nkom",
        })

        return  "travel created"

    @http.route('/get_travel_data', type='http', auth='none', website=True, csrf=False, cors='*')
    def get_travel_data(self):
        # Fetch all travel records from the database
        travels = request.env['sockets.travel'].sudo().search([('disable', '=', False)])

        # Convert the travel records to a list of dictionaries
        travel_data = []
        for travel in travels:
            travel_data.append({
                'id': travel.id,
                'source1': travel.source1,
                'destination1': travel.destination1,
                'disable': travel.disable
            })

        return json.dumps(travel_data)

    @http.route('/disable/<int:travel_id>', type='http', auth='none', website=True, csrf=False, cors='*')
    def disable_travel(self, travel_id):
        travel = http.request.env['sockets.travel'].sudo().browse(travel_id)
        if travel:
            travel.disable_travel()
            response_data = {
                "message": "Travel record disabled successfully."
            }
        else:
            response_data = {
                "message": "Travel record not found."
            }
        response_json = json.dumps(response_data)
        return response_json

    @http.route('/update_travel/<int:travel_id>', type='http', auth='none', website=True, csrf=False)
    def update_travel(self, travel_id, **post):
        # Find the travel record by ID
        travel = request.env['sockets.travel'].sudo().browse(travel_id)

        # Update the travel record
        travel.sudo().write({
            'source1': 'paris friod',  # Update with your new values
            'destination1': 'rio berlin',  # Update with your new values
        })
        return "Travel updated and event triggered"

    @http.route('/delete_travel/<int:travel_id>', type='http', auth='none', website=True, csrf=False)
    def delete_travel(self, travel_id, **post):
        # Find the travel record by ID
        travel = request.env['sockets.travel'].sudo().browse(travel_id)

        # Delete the travel record
        travel.sudo().unlink()

        # Trigger a Pusher event to notify clients of the deleted travel
        # pusher.trigger('travel-channel', 'delete-travel', {
        #     'id': travel.id,
        # })

        return "Travel deleted and event triggered"

    @http.route('/get_travels', type='http', auth='none', website=True, csrf=False)
    def get_travels(self):
        # Fetch the travel data from the Odoo model (e.g., odoo.travels)
        travels = request.env['websocket.travels'].sudo().search([])

        # Convert the travel data to a list of dictionaries
        travel_list = []
        for travel in travels:
            travel_list.append({
                'id': travel.id,
                'source': travel.source,
                'destination': travel.destination
            })

        return json.dumps(travel_list)

    @http.route('/get_travel_by_id/<int:travel_id>', type='json', auth='none', cors='*')
    def get_travel_by_id(self, travel_id):
        # Find the travel record by ID
        travel = request.env['websocket.travels'].sudo().browse(travel_id)

        # Convert the travel data to a dictionary
        travel_data = {
            'id': travel.id,
            'source': travel.source,
            'destination': travel.destination
        }

        return travel_data


class DeviceToken(http.Controller):

    @http.route('/odoo/define/token', website=True, auth='none')
    def odoo_define_token(self, **kwargs):
        return request.render('odoo_device_token.odoo_define_token', {})

    @http.route('/js/script/token', website=True, auth='none')
    def js_script_token(self, **kwargs):
        return request.render('odoo_device_token.js_script_token', {})
