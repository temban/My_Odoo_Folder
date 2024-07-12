from odoo import models, fields
import pusher

class Travel(models.Model):
    _name = 'websocket.travels'
    _description = 'Travel Information'

    source = fields.Char(string='Source', required=True)
    destination = fields.Char(string='Destination', required=True)

    @staticmethod
    def trigger_pusher_event(event_name, data):
        pusher_client = pusher.Pusher(
            app_id="1663724",
            key="a7d67608f236b9565325",
            secret="b83f97c2ef83e7d7dbbf",
            cluster="eu",
            ssl=True,
        )

        # Trigger the Pusher event
        pusher_client.trigger('travel-channel', event_name, data)

    def create(self, vals):
        # Create a new travel record
        travel = super(Travel, self).create(vals)

        # Trigger a Pusher event to notify clients of the new travel
        data = {
            'id': travel.id,
            'source': travel.source,
            'destination': travel.destination,
        }
        self.trigger_pusher_event('new-travel', data)

        return travel

    def write(self, vals):
        # Update the travel record
        res = super(Travel, self).write(vals)
            # Trigger a Pusher event to notify clients of the updated travel
        data = {
                'id': self.id,
                'source': self.source,
                'destination': self.destination,
        }
        self.trigger_pusher_event('update-travel', data)

        return res

    def unlink(self):
        # Trigger a Pusher event to notify clients of the deleted travel
        data = {
            'id': self.id,
        }
        self.trigger_pusher_event('delete-travel', data)

        # Delete the travel record
        return super(Travel, self).unlink()