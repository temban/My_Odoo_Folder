# import base64
# import json
# from urllib.request import urlopen
#
# from odoo import http
# from odoo.http import request
#
#
# class YourController(http.Controller):
#     @http.route('/hubkilo/signup', type='http', auth='public', csrf=False, methods=['POST'], cors='*')
#     def signup(self, name, email, password, **kwargs):
#         image_url = kwargs.get('image_url')  # Get the URL of the image
#         r_image_base64 = None  # Initialize the base64 image data variable
#
#         if image_url:
#             # Retrieve the image data from the online URL
#             with urlopen(image_url) as image_response:
#                 image_data = image_response.read()
#             # Convert the image data to base64
#             r_image_base64 = base64.b64encode(image_data).decode('utf-8')
#
#         # Find the "Portal" group
#         group_portal = request.env.ref('base.group_portal')
#
#         # Create a new partner with type "Contact"
#         partner = request.env['res.partner'].sudo().create({
#             'name': name,
#             'email': email,
#             'type': 'contact',
#             'is_company': False,
#             'image_1920': r_image_base64,  # Set the image data for the partner
#         })
#
#         # Create a new user with type "Portal" and assign the partner
#         user = request.env['res.users'].sudo().create({
#             'partner_id': partner.id,
#             'login': email,
#             'password': password,
#             'groups_id': [(6, 0, [group_portal.id])],
#         })
#
#         # Serialize the created data into a JSON response
#         response_data = {
#             'partner_id': partner.id,
#             'user_id': user.id,
#             'name': name,
#             'email': email,
#         }
#
#         return json.dumps(response_data)