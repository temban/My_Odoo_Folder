# -*- coding: utf-8 -*-
from odoo import api, SUPERUSER_ID

from . import models
from . import controllers

def _create_products(cr, registry):
    env = api.Environment(cr, SUPERUSER_ID, {})
    company_obj     = env['res.company']
    prtmpl_obj      = env['product.template']
    company         = company_obj.search([], limit=1)
    company.write( {'name': 'HUBKILO'} )
    company.partner_id.write( { 'name': 'HUBKILO', 'ref': 'HUBKILO', 'company_id': company.id, } )

    tmpl_vals = [
        {'name': 'HUBKILO SHIPPER FEES', 'detailed_type': 'service', 'default_code': 'HBK-SHFEES', 'sale_ok': True,
         'purchase_ok': False},
        {'name': 'HUBKILO FEES', 'detailed_type': 'service', 'default_code': 'HBK-FEES', 'sale_ok': True,
         'purchase_ok': False},
        {'name': 'HUBKILO TRAVELER FEES', 'detailed_type': 'service', 'default_code': 'HBK-TRFEES', 'sale_ok': True,
         'purchase_ok': False}
    ]

    for vals in tmpl_vals:
        existing_product = prtmpl_obj.search([('default_code', '=', vals['default_code'])])
        if not existing_product:
            prtmpl_obj.create([vals])
            print(f"Road: {vals['name']} created.")
        else:
            print(f"Road: {vals['name']} already exists. Skipping creation.")
