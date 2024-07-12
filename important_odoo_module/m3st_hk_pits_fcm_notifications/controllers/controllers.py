from odoo import http
from odoo.http import request
# import json


class NotificationLogController(http.Controller):

    @http.route('/notification_log/<int:partner_id>', type='json', auth='none', methods=['POST'])
    def get_notifications(self, partner_id, **kwargs):
        notifications = request.env['notification.log'].sudo().search([
            '|',
            '&', ('sender_partner_id', '=', int(partner_id)), ('disable_sender', '=', False),
            '&', ('receiver_partner_id', '=', int(partner_id)), ('disable_receiver', '=', False),
        ])

        notification_data = []
        for notification in notifications:
            notification_data.append({
                'id': notification.id,
                'sender_partner_id': notification.sender_partner_id.id,
                'receiver_partner_id': notification.receiver_partner_id.id,
                'message_title': notification.message_title,
                'message_body': notification.message_body,
                'is_seen_sender': notification.is_seen_sender,
                'is_seen_receiver': notification.is_seen_receiver,
                'disable_sender': notification.disable_sender,
                'disable_receiver': notification.disable_receiver,
                'date': notification.date,
            })

        return notification_data

    @http.route('/notification_log/mark_seen/<int:notification_id>/<int:partner_id>', type='json', auth='none',
                methods=['PUT'])
    def mark_notification_seen(self, notification_id, partner_id, **kwargs):
        notification = request.env['notification.log'].sudo().browse(notification_id)

        if notification:
            if partner_id == notification.sender_partner_id.id:
                notification.sudo().write({'is_seen_sender': True})
                return {'success': 'seen as sender'}
            elif partner_id == notification.receiver_partner_id.id:
                notification.sudo().write({'is_seen_receiver': True})
                return {'success': 'seen as receiver'}
            else:
                return {'success': False, 'error': 'Partner ID does not correspond to sender or receiver'}
        else:
            return {'success': False, 'error': 'Notification not found'}

    @http.route('/notification_log/disable/<int:notification_id>/<int:partner_id>', type='json', auth='none',
                methods=['PUT'])
    def notification_disable(self, notification_id, partner_id, **kwargs):
        notification = request.env['notification.log'].sudo().browse(notification_id)

        if notification:
            if partner_id == notification.sender_partner_id.id:
                notification.sudo().write({'disable_sender': True})
                return {'success': 'Sender Disabled!'}
            elif partner_id == notification.receiver_partner_id.id:
                notification.sudo().write({'disable_receiver': True})
                return {'success': 'Receiver Disabled!'}
            else:
                return {'success': False, 'error': 'Partner ID does not correspond to sender or receiver'}
        else:
            return {'success': False, 'error': 'Notification not found'}
