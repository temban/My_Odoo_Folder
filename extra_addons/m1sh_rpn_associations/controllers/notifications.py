from odoo import http
from odoo.http import request


# import json


class RPNNotificationLogController(http.Controller):

    @http.route('/rpn/notification_log/<int:partner_id>', type='json', auth='none', methods=['POST'], website=True, csrf=False)
    def rpn_get_notifications(self, partner_id, **kwargs):
        notifications = request.env['rpn.notification.log'].sudo().search([
            ('partner_id', '=', int(partner_id)), ('disable', '=', False),
        ])

        notification_data = []
        for notification in notifications:
            notification_data.append({
                'id': notification.id,
                'partner_id': notification.partner_id.id,
                'message_title': notification.message_title,
                'message_body': notification.message_body,
                'is_seen': notification.is_seen,
                'disable': notification.disable,
                'date': notification.date,
            })

        return notification_data

    @http.route('/rpn/notification_log/mark_seen/<int:notification_id>', type='json', auth='none',
                methods=['PUT'], website=True, csrf=False)
    def rpn_mark_notification_seen(self, notification_id, **kwargs):
        notification = request.env['rpn.notification.log'].sudo().browse(notification_id)

        if notification:
            notification.sudo().write({'is_seen': True})
            return {'success': 'seen'}
        else:
            return {'success': False, 'error': 'Notification not found'}

    @http.route('/rpn/notification_log/disable/<int:notification_id>', type='json', auth='none',
                methods=['PUT'], website=True, csrf=False)
    def rpn_notification_disable(self, notification_id, **kwargs):
        notification = request.env['rpn.notification.log'].sudo().browse(notification_id)

        if notification:
            notification.sudo().write({'disable': True})
            return {'success': 'Disabled'}
        else:
            return {'success': False, 'error': 'Notification not found'}
