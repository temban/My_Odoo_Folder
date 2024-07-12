# -*- coding: utf-8 -*-
# from odoo import http


# class ShintheoMails(http.Controller):
#     @http.route('/shintheo_mails/shintheo_mails', auth='public')
#     def index(self, **kw):
#         return "Hello, world"

#     @http.route('/shintheo_mails/shintheo_mails/objects', auth='public')
#     def list(self, **kw):
#         return http.request.render('shintheo_mails.listing', {
#             'root': '/shintheo_mails/shintheo_mails',
#             'objects': http.request.env['shintheo_mails.shintheo_mails'].search([]),
#         })

#     @http.route('/shintheo_mails/shintheo_mails/objects/<model("shintheo_mails.shintheo_mails"):obj>', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('shintheo_mails.object', {
#             'object': obj
#         })
