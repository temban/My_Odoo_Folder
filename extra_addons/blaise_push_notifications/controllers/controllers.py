from odoo import http
from odoo.http import request
from odoo.exceptions import ValidationError


class FirebaseNotificationController(http.Controller):
    @http.route('/send_notification', type='json', auth='none', methods=['POST'])
    def send_notification(self, **kw):
        title = kw.get('title')
        message = kw.get('message')
        device_token = kw.get('device_token')
        partner_id = kw.get('partner_id')

        if not (title and message and device_token and partner_id):
            return {'success': False, 'message': 'Missing required parameters.'}
        print(title, message, device_token, partner_id)
        Notification = request.env['firebase.notification']

        try:
            new_notification = Notification.sudo().create({
                'title': title,
                'message': message,
                'device_token': device_token,
                'partner_id': partner_id
            })
            print(title, message, device_token, partner_id)
            new_notification.send_notification()

            return {'success': True, 'message': 'Notification sent successfully.'}
        except ValidationError as e:
            return {'success': False, 'message': str(e)}
        except Exception as e:
            return {'success': False, 'message': 'An error occurred while sending the notification.'}
