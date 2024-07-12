# -*- coding: utf-8 -*-
# from odoo import http


# class OdooPortal(http.Controller):
#     @http.route('/odoo_portal/odoo_portal', auth='public')
#     def index(self, **kw):
#         return "Hello, world"

#     @http.route('/odoo_portal/odoo_portal/objects', auth='public')
#     def list(self, **kw):
#         return http.request.render('odoo_portal.listing', {
#             'root': '/odoo_portal/odoo_portal',
#             'objects': http.request.env['odoo_portal.odoo_portal'].search([]),
#         })

#     @http.route('/odoo_portal/odoo_portal/objects/<model("odoo_portal.odoo_portal"):obj>', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('odoo_portal.object', {
#             'object': obj
#         })
