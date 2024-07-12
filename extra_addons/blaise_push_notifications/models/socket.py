from odoo import models, fields, api
from pusher import Pusher


def hello():
    print("hello world from another module.......................")

class ResConfigSettings(models.TransientModel):
    _inherit = 'res.config.settings'

    pusher_app_id = fields.Char(string='Pusher App ID')
    pusher_key = fields.Char(string='Pusher Key')
    pusher_secret = fields.Char(string='Pusher Secret')
    pusher_cluster = fields.Char(string='Pusher Cluster')

    @api.model
    def print(self):
        print("print in class .......................")

    @api.model
    def get_values(self):
        res = super(ResConfigSettings, self).get_values()
        config = self.env['ir.config_parameter'].sudo()
        res.update(
            pusher_app_id=config.get_param('pusher.app_id'),
            pusher_key=config.get_param('pusher.key'),
            pusher_secret=config.get_param('pusher.secret'),
            pusher_cluster=config.get_param('pusher.cluster'),
        )
        return res

    def set_values(self):
        super(ResConfigSettings, self).set_values()
        config = self.env['ir.config_parameter'].sudo()
        config.set_param('pusher.app_id', self.pusher_app_id)
        config.set_param('pusher.key', self.pusher_key)
        config.set_param('pusher.secret', self.pusher_secret)
        config.set_param('pusher.cluster', self.pusher_cluster)

    def trigger_pusher_event(self, channel, event_name, data):
        config = self.env['ir.config_parameter'].sudo()
        pusher_client = Pusher(
            app_id=config.get_param('pusher.app_id'),
            key=config.get_param('pusher.key'),
            secret=config.get_param('pusher.secret'),
            cluster=config.get_param('pusher.cluster'),
            ssl=True,
        )
        pusher_client.trigger(channel, event_name, data)

        # Trigger the Pusher event
        # Your event triggering logic here
