# -*- coding: utf-8 -*-
import base64
from odoo import api, SUPERUSER_ID
import os
from . import models
from . import controllers


def encode_image(file_path):
    if os.path.exists(file_path):
        with open(file_path, 'rb') as image_file:
            encoded_image = base64.b64encode(image_file.read()).decode('utf-8')
        print("Conversion to base64 successful.")
        return encoded_image


def _create_products_and_luggage_model(cr, registry):
    env = api.Environment(cr, SUPERUSER_ID, {})
    company_obj = env['res.company']
    prtmpl_obj = env['product.template']
    luggage_type_obj = env['m2st_hk_airshipping.luggage.type']
    company = company_obj.search([], limit=1)
    company.write({'name': 'HUBKILO'})
    company.partner_id.write({'name': 'HUBKILO', 'ref': 'HUBKILO', 'company_id': company.id})

    script_directory = os.path.dirname(os.path.abspath(__file__))
    kilopath = os.path.join(script_directory, '../m2st_hk_airshipping/static/src/image/kilo.png')
    enveloppath = os.path.join(script_directory, '../m2st_hk_airshipping/static/src/image/envelop.png')

    encoded_kilo_image = encode_image(kilopath)
    encoded_envelop_image = encode_image(enveloppath)

    tmpl_vals = [
        {'name': 'HUBKILO SHIPPER FEES', 'detailed_type': 'service', 'default_code': 'HBK-SHFEES', 'sale_ok': True,
         'purchase_ok': False},
        {'name': 'HUBKILO FEES', 'detailed_type': 'service', 'default_code': 'HBK-FEES', 'sale_ok': True,
         'purchase_ok': False},
        {'name': 'HUBKILO TRAVELER FEES', 'detailed_type': 'service', 'default_code': 'HBK-TRFEES', 'sale_ok': True,
         'purchase_ok': False},
        {'name': 'HUBKILO KILO', 'detailed_type': 'service', 'default_code': 'HBK-KILO', 'sale_ok': True,
         'purchase_ok': False},
        {'name': "HUBKILO Administrative Fee", 'detailed_type': 'service', 'default_code': 'HBK-ADMIN-FEE',
         'sale_ok': True, 'purchase_ok': False}
    ]

    for vals in tmpl_vals:
        existing_product = prtmpl_obj.search([('default_code', '=', vals['default_code'])])
        if not existing_product:
            prtmpl_obj.create(vals)
            print(f"Air: {vals['name']} created.")
        else:
            print(f"Air: {vals['name']} already exists. Skipping creation.")

    luggage_vals = [
        {'name': 'KILO', 'price_per_kilo': 0.0, 'weight_in_kg': 0.0,
         'description': 'This the quantity of kilo you can transport', 'image': encoded_kilo_image},
        {'name': 'ENVELOP', 'price_per_kilo': 0.0, 'weight_in_kg': 0.0,
         'description': 'This the quantity of Envelop you can transport', 'image': encoded_envelop_image}
    ]

    for vals in luggage_vals:
        existing_luggage_type = luggage_type_obj.search([('name', '=', vals['name'])])
        if not existing_luggage_type:
            luggage_type_obj.create(vals)
            print(f"{vals['name']} created.")
        else:
            print(f"{vals['name']} already exists. Skipping creation.")
