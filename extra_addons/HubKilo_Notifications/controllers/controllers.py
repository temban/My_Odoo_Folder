# from odoo import http
# from odoo.http import request
#
# class ForgotPasswordController(http.Controller):
#
#     @http.route('/forgot_password', type='json', auth='public', methods=['POST'])
#     def forgot_password(self, **kwargs):
#         email = kwargs.get('email', False)
#         if email:
#             users_model = request.env['res.users']
#             result = users_model.reset_password_and_send_email(email)
#             return {'success': result}
#         return {'error': 'Email not provided'}
