# -*- coding: utf-8 -*-
from odoo import api, SUPERUSER_ID

from . import models
from . import controllers

def _create_rpn_products(cr, registry):
    env = api.Environment(cr, SUPERUSER_ID, {})
    company_obj = env['res.company']
    prtmpl_obj = env['product.template']
    company = company_obj.sudo().search([], limit=1)
    company.sudo().write({'name': 'RPN Association'})
    company.partner_id.sudo().write({'name': 'RPN Association', 'ref': 'RPN Association', 'company_id': company.id})

    Membership = [
        {'name': 'RPN Membership Fee', 'detailed_type': 'service', 'default_code': 'RPNMS-FEES', 'sale_ok': True,
         'purchase_ok': False, 'company_id': company.id},
    ]

    Recharge = [
        {'name': "RPN Member's Recharge", 'detailed_type': 'service', 'default_code': 'RPNM-RECHARGE', 'sale_ok': True,
         'purchase_ok': False, 'company_id': company.id},
    ]

    Debt = [
        {'name': "RPN Debt Fee", 'detailed_type': 'service', 'default_code': 'RPN-DEBT-FEE', 'sale_ok': True,
         'purchase_ok': False, 'company_id': company.id},
    ]

    ReactivationFee = [
        {'name': "RPN Reactivation Fee", 'detailed_type': 'service', 'default_code': 'RPN-REACT-FEE', 'sale_ok': True,
         'purchase_ok': False, 'company_id': company.id},
    ]

    AdministrativeFee = [
        {'name': "RPN Administrative Fee", 'detailed_type': 'service', 'default_code': 'RPN-ADMIN-FEE',
         'sale_ok': True, 'purchase_ok': False, 'company_id': company.id},
    ]

    existing_product_Membership = prtmpl_obj.sudo().search([('default_code', '=', 'RPNMS-FEES')])
    existing_product_Recharge = prtmpl_obj.sudo().search([('default_code', '=', 'RPNM-RECHARGE')])
    existing_product_Debt = prtmpl_obj.sudo().search([('default_code', '=', 'RPN-DEBT-FEE')])
    existing_product_ReactivationFee = prtmpl_obj.sudo().search([('default_code', '=', 'RPN-REACT-FEE')])
    existing_product_AdministrativeFee = prtmpl_obj.sudo().search([('default_code', '=', 'RPN-ADMIN-FEE')])

    if not existing_product_Membership:
        pr = prtmpl_obj.sudo().create(Membership)
        print("Membership created:", pr)
    else:
        print("Membership fee already exists. Skipping creation.")

    if not existing_product_Recharge:
        pr = prtmpl_obj.sudo().create(Recharge)
        print("Recharge created:", pr)
    else:
        print("Recharge already exists. Skipping creation.")

    if not existing_product_Debt:
        pr = prtmpl_obj.sudo().create(Debt)
        print("Debt fee created:", pr)
    else:
        print("Debt fee already exists. Skipping creation.")

    if not existing_product_ReactivationFee:
        pr = prtmpl_obj.sudo().create(ReactivationFee)
        print("Reactivation fee created:", pr)
    else:
        print("Reactivation fee already exists. Skipping creation.")

    if not existing_product_AdministrativeFee:
        pr = prtmpl_obj.sudo().create(AdministrativeFee)
        print("Administrative fee created:", pr)
    else:
        print("Administrative fee already exists. Skipping creation.")
