import base64
from odoo import http
from odoo.http import request
import qrcode
import io


class qrController(http.Controller):

    @http.route('/fidelity/card/pb', type='http', auth="user", website=True, csrf=False)
    def user_fidelity_qr_code(self):
        # Data to be encoded in the QR code
        data = request.env.user.partner_id.id
        partner = request.env.user.partner_id
        # Create QR code instance
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=15,  # Adjust box_size to fit your needs
            border=4,
        )
        qr.add_data(data)
        qr.make(fit=True)

        # Create an image from the QR Code instance
        img = qr.make_image(fill_color="black", back_color="white")

        # Save the image to a BytesIO object
        img_bytesio = io.BytesIO()
        img.save(img_bytesio)
        img_qrcode= base64.b64encode(img_bytesio.getvalue()).decode('utf-8')

        config_settings = request.env['res.config.settings'].sudo().search([])
        manager_required_bonus_points = [config.manager_required_bonus_points for config in config_settings]

        # Set a default value for last_manager_required_bonus_points
        last_manager_required_bonus_points = None

        if manager_required_bonus_points:
            last_manager_required_bonus_points = manager_required_bonus_points[-1]

        # Render the QR code on the web page
        return request.render('user_fidelity_points.qr_code_template', {
            'img_qrcode': img_qrcode,
            'partner': partner,
            'last_manager_required_bonus_points': last_manager_required_bonus_points
        })
