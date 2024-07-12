# -*- coding: utf-8 -*-
import base64
import json
from datetime import datetime

from odoo.http import request
from odoo import http, fields, _
from odoo.exceptions import ValidationError


class BasicEntityManagement(http.Controller):

    @http.route('/hubkilo/all/partners', methods=['GET'], type='http', auth='none', cors='*', csrf=False)
    def get_partner_json(self, **kw):
        partners = http.request.env['res.partner'].sudo().search([])

        # Convert partners to JSON
        if partners:
            partner_data = []
            for partner in partners:
                partner_data.append({
                    'id': partner.id,
                    'name': partner.name,
                    'is_traveler': partner.is_traveler,
                    'is_shipper': partner.is_shipper,
                    'email': partner.email,
                    'current_date': partner.current_date.strftime('%Y-%m-%d') if partner.birthdate else None,
                    'birthdate': partner.birthdate.strftime('%Y-%m-%d') if partner.birthdate else None,
                    'birth_city_id': partner.birth_city_id if partner.birth_city_id else None,
                    'sex': partner.sex if partner.sex else None,
                    'gender': partner.gender if partner.gender else None,
                })

            # Return JSON response
            return json.dumps(partner_data)
        else:
            return "Empty!"

    @http.route('/api/res_partner', methods=['GET'], type='http', auth='user', cors='*', csrf=False)
    def get_res_partner(self, **kwargs):
        # print(http.request.env.user.partner_id.id)
        partner = request.env['res.partner'].sudo().browse(http.request.env.user.partner_id.id)
        partner_dict = {
            'id': partner.id,
            'name': partner.name,
            'email': partner.email,
        }
        return json.dumps({'partner': partner_dict})

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

    @http.route('/create/new/partner', type='json', auth='public', csrf=False, methods=['POST'], cors='*')
    def create_partner(self, **kw):
        street = kw.get('street')
        name = kw.get('name')
        email = kw.get('email')
        phone = kw.get('phone')
        birthday = datetime.strptime(kw.get('birthday'), '%y/%m/%d')
        birthplace = kw.get('birthplace')
        sex = kw.get('sex')
        password = kw.get('password')
        is_traveler = kw.get('is_traveler')
        val1 = {'name': name, 'email': email, 'phone': phone, 'street': street, 'birthdate': birthday,
                'birthplace': birthplace, 'sex': sex,
                'is_traveler': is_traveler}
        # Création du res.partner
        partner = http.request.env['res.partner'].sudo().create(val1)
        val2 = {
            'partner_id': partner.id,
            'street': street,
            'name': name,
            'login': email,
            'email': email,
            'password': password,
            'groups_id': [(6, 0, [http.request.env.ref('base.group_portal').id])]
        }
        # Création de l'utilisateur de type portal
        user = http.request.env['res.users'].sudo().create(val2)

        # Conversion de l'utilisateur en objet JSON
        user_json = {
            'id': user.id,
            'name': user.name,
            'login': user.login,
            'email-company': user.email,
            'password': password
        }

        return user_json

    @http.route('/hubkilo/update/partner', type='json', auth='public', csrf=False, methods=['PUT'], cors='*')
    def update_partner(self, **kw):
        # partner_id = kw.get('partner_id')
        street = kw.get('street')
        name = kw.get('name')
        email = kw.get('email')
        phone = kw.get('phone')
        birthday = datetime.strptime(kw.get('birthday'), '%y/%m/%d')
        birthplace = kw.get('birthplace')
        sex = kw.get('sex')
        is_traveler = kw.get('is_traveler')

        # Retrieve the existing partner object
        partner = http.request.env['res.partner'].sudo().browse(http.request.env.user.partner_id.id)

        # Update the partner fields
        partner.write({
            'name': name,
            'email': email,
            'phone': phone,
            'street': street,
            'birthdate': birthday,
            'birthplace': birthplace,
            'sex': sex,
            'is_traveler': is_traveler
        })

        # Retrieve the existing user object
        user = http.request.env['res.users'].sudo().search([('partner_id', '=', http.request.env.user.partner_id.id)],
                                                           limit=1)

        if user:
            # Update the user fields
            user.write({
                'street': street,
                'name': name,
                'login': email,
                'email': email,
            })
        else:
            # Create a new user if not found
            val2 = {
                'partner_id': partner.id,
                'street': street,
                'name': name,
                'login': email,
                'email': email,
                'groups_id': [(6, 0, [http.request.env.ref('base.group_portal').id])]
            }
            user = http.request.env['res.users'].sudo().create(val2)

        # Conversion of the user into a JSON object
        user_json = {
            'id': user.id,
            'name': user.name,
            'login': user.login,
            'email-company': user.email
        }

        return user_json
