# import logging
# from odoo import http, _
# from odoo.http import request
# from odoo.exceptions import UserError
#
# _logger = logging.getLogger(__name__)
#
# class CustomResetPassword(http.Controller):
#
#     @http.route('/custom/reset_password', type='json', auth='public', methods=['POST'], csrf=False)
#     def custom_reset_password(self, **kw):
#         try:
#             login = kw.get('login')
#             if not login:
#                 return {'error': _("No login provided.")}
#
#             _logger.info(
#                 "Custom Password reset attempt for <%s> by user <%s> from %s",
#                 login, request.env.user.login, request.httprequest.remote_addr)
#
#             # Your custom logic to reset the password for the provided login (email or username)
#             # For example, you could call a method on the `res.users` model to send the password reset email.
#             # Replace `send_password_reset_email` with your actual method name and customize as needed.
#             request.env['res.users'].sudo().send_password_reset_email(login)
#
#             return {'message': _("An email has been sent with instructions to reset your password")}
#         except UserError as e:
#             return {'error': e.args[0]}
#         except Exception as e:
#             return {'error': str(e)}
