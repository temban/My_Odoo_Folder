from odoo import http
from odoo.http import request

from odoo import http
from odoo.http import request


class VerificationCodeController(http.Controller):

    @http.route('/update_verification_code/<int:user_id>', type='json', auth='none', method=['PUT'])
    def update_verification_code(self, user_id):
        user = request.env['res.users'].sudo().browse(user_id)
        if user.exists():
            new_verification_code = user.generate_verification_code()
            user.sudo().write({'verification_code': new_verification_code})
            return {
                'success': True,
                'message': 'Verification code updated and email sent.',
                # 'verification_code': new_verification_code
            }
        return {'success': False, 'message': 'User not found'}
