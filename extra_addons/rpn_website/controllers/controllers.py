from odoo import http
from odoo.http import request, Response
import json
import base64
import os
import datetime

class CustomHomeController(http.Controller):

    @http.route('/', type='http', auth="public", website=True, sitemap=False)
    def redirect_to_my_home(self, **kw):
        return request.redirect('/my/home')


class RPNPortal(http.Controller):
    @http.route('/rpn/portal/profile', website=True, type='http', auth='user')
    def rpn_portal(self, **kw):
        return request.render('rpn_website.rpn_portal', {})

    @http.route('/member/add/new', website=True, type='http', auth='user')
    def rpn_member_creation(self, **kw):
        return request.render('rpn_website.rpn_member_creation', {})

    @http.route('/api/current/user', methods=['GET'], type='http', auth='user', cors='*', csrf=False)
    def get_res_partner(self, **kwargs):
        # print(http.request.env.user.partner_id.id)
        partner = request.env['res.partner'].sudo().browse(http.request.env.user.partner_id.id)
        partner_dict = {
            'id': partner.id,
            'name': partner.name,
            'email': partner.email,
        }
        return json.dumps({'partner': partner_dict})

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


    @http.route('/image_1920/update', type='http', auth='user', website=True, csrf=False, methods=['POST'], cors='*')
    def image_1920_upload(self, **kwargs):

        image_1920_upload = request.env['res.partner'].sudo().browse(http.request.env.user.partner_id.id)

        # Read the file data and convert to base64
        image_1920_doc_data = kwargs['image_1920_doc'].read()
        image_1920_doc_base64 = base64.b64encode(image_1920_doc_data).decode(
            'utf-8') if image_1920_doc_data else False

        values = {
            'image_1920': image_1920_doc_base64,
        }
        updated_image_1920 = image_1920_upload.write(values)
        print(updated_image_1920)
        return json.dumps({'status': 200, 'message': 'success'})




