# -*- coding: utf-8 -*-
# from odoo import http


# class NotificationsHistory(http.Controller):
#     @http.route('/notifications__history/notifications__history', auth='public')
#     def index(self, **kw):
#         return "Hello, world"

#     @http.route('/notifications__history/notifications__history/objects', auth='public')
#     def list(self, **kw):
#         return http.request.render('notifications__history.listing', {
#             'root': '/notifications__history/notifications__history',
#             'objects': http.request.env['notifications__history.notifications__history'].search([]),
#         })

#     @http.route('/notifications__history/notifications__history/objects/<model("notifications__history.notifications__history"):obj>', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('notifications__history.object', {
#             'object': obj
#         })
