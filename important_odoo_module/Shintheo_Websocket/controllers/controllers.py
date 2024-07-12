# -*- coding: utf-8 -*-
# from odoo import http


# class Odoo15Websocket(http.Controller):
#     @http.route('/odoo15_websocket/odoo15_websocket', auth='public')
#     def index(self, **kw):
#         return "Hello, world"

#     @http.route('/odoo15_websocket/odoo15_websocket/objects', auth='public')
#     def list(self, **kw):
#         return http.request.render('odoo15_websocket.listing', {
#             'root': '/odoo15_websocket/odoo15_websocket',
#             'objects': http.request.env['odoo15_websocket.odoo15_websocket'].search([]),
#         })

#     @http.route('/odoo15_websocket/odoo15_websocket/objects/<model("odoo15_websocket.odoo15_websocket"):obj>', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('odoo15_websocket.object', {
#             'object': obj
#         })
