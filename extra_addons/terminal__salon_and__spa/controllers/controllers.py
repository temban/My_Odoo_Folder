# -*- coding: utf-8 -*-
# from odoo import http


# class TerminalSalonAndSpa(http.Controller):
#     @http.route('/terminal__salon_and__spa/terminal__salon_and__spa', auth='public')
#     def index(self, **kw):
#         return "Hello, world"

#     @http.route('/terminal__salon_and__spa/terminal__salon_and__spa/objects', auth='public')
#     def list(self, **kw):
#         return http.request.render('terminal__salon_and__spa.listing', {
#             'root': '/terminal__salon_and__spa/terminal__salon_and__spa',
#             'objects': http.request.env['terminal__salon_and__spa.terminal__salon_and__spa'].search([]),
#         })

#     @http.route('/terminal__salon_and__spa/terminal__salon_and__spa/objects/<model("terminal__salon_and__spa.terminal__salon_and__spa"):obj>', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('terminal__salon_and__spa.object', {
#             'object': obj
#         })
