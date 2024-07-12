from odoo import models, fields, api
from pyfcm import FCMNotification

class ResConfigSettingsInherit(models.TransientModel):
    _inherit = 'res.config.settings'

    api_key = fields.Char('API Key', config_parameter='blaise_push_notifications.api_key')
    endpoints_api_key = fields.Char('EndPoints API Key', config_parameter='blaise_push_notifications.endpoints_api_key')
    endpoints_secret_key = fields.Char('EndPoints Secret Key',
                                       config_parameter='blaise_push_notifications.endpoints_secret_key')



    def set_values(self):
        super(ResConfigSettingsInherit, self).set_values()
        self.env['ir.config_parameter'].set_param('blaise_push_notifications.api_key', self.api_key or '')
        self.env['ir.config_parameter'].set_param('blaise_push_notifications.endpoints_api_key',
                                                  self.endpoints_api_key or '')
        self.env['ir.config_parameter'].set_param('blaise_push_notifications.endpoints_secret_key',
                                                  self.endpoints_secret_key or '')

    def get_values(self):
        res = super(ResConfigSettingsInherit, self).get_values()
        res.update(api_key=self.env['ir.config_parameter'].sudo().get_param('blaise_push_notifications.api_key'))
        res.update(endpoints_api_key=self.env['ir.config_parameter'].sudo().get_param(
            'blaise_push_notifications.endpoints_api_key'))
        res.update(endpoints_secret_key=self.env['ir.config_parameter'].sudo().get_param(
            'blaise_push_notifications.endpoints_secret_key'))
        return res


class ResPartner(models.Model):
    _inherit = 'res.partner'

    notify_device_token = fields.One2many('firebase.notification', 'partner_id', string='Partner Device Token')


class FirebaseNotification(models.Model):
    _name = 'firebase.notification'
    _description = 'Firebase Notification'

    title = fields.Char('Title', required=True)
    message = fields.Text('Message', required=True)
    device_token = fields.Char('Device Token', required=True)
    partner_id = fields.Many2one('res.partner', string='Recipient Partner')

    def send_notification(self):
        api_key = self.env['ir.config_parameter'].sudo().get_param('blaise_push_notifications.api_key')

        push_service = FCMNotification(api_key=api_key)

        message_title = self.title
        message_body = self.message
        registration_id = self.device_token

        result = push_service.notify_single_device(
            registration_id=registration_id,
            message_title=message_title,
            message_body=message_body,
            message_icon="https://scontent-lhr8-1.xx.fbcdn.net/v/t39.30808-6/258854909_1392915734457216_34955752319055841_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=19026a&_nc_eui2=AeGxxBhflR5Klulv9pjWJsSMJVVrQC3lwvslVWtALeXC--grfIy6QHemkKhVUfdFyrfz4wIUS0Dh0lkKpaNztpF7&_nc_ohc=zKWME23uhVEAX-1jysu&_nc_ht=scontent-lhr8-1.xx&oh=00_AfDTMkoylsN8_grDYKc8AqCBW0FGHeM7JivpMIIRlDg8OQ&oe=64E1F293"  ,
        )

        return result