# -*- coding: utf-8 -*-
# from odoo import http


# class ShintheoMailsTemplate(http.Controller):
#     @http.route('/shintheo_mails_template/shintheo_mails_template', auth='public')
#     def index(self, **kw):
#         return "Hello, world"

#     @http.route('/shintheo_mails_template/shintheo_mails_template/objects', auth='public')
#     def list(self, **kw):
#         return http.request.render('shintheo_mails_template.listing', {
#             'root': '/shintheo_mails_template/shintheo_mails_template',
#             'objects': http.request.env['shintheo_mails_template.shintheo_mails_template'].search([]),
#         })

#     @http.route('/shintheo_mails_template/shintheo_mails_template/objects/<model("shintheo_mails_template.shintheo_mails_template"):obj>', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('shintheo_mails_template.object', {
#             'object': obj
#         })
