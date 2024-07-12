from odoo import models, fields, api
import websockets
import asyncio
import json
import threading


class Travel(models.Model):
    _name = 'sockets.travel'
    _description = 'Travel Information'

    source1 = fields.Char(string='Source', required=True)
    destination1 = fields.Char(string='Destination', required=True)
    disable = fields.Boolean(string='Disable Travel', default=False)

    @api.model
    def create(self, vals):
        record = super(Travel, self).create(vals)
        room = "room1"
        data = {
            "id": record.id,
            "source1": record.source1,
            "destination1": record.destination1,
            "disable": record.disable,
            "action": "CREATE"
        }
        self.send_to_frontend(data, room)
        return record

    def write(self, vals):
        super(Travel, self).write(vals)
        if 'source1' in vals or 'destination1' in vals:
            for record in self:
                room = "room1"
                data = {
                    "id": record.id,
                    "source1": record.source1,
                    "destination1": record.destination1,
                    "disable": record.disable,
                    "action": "UPDATE"
                }
            self.send_to_frontend(data, room)

    def disable_travel(self):
        for record in self:
            record.write({'disable': True})
            room = "room1"
            data = {
                "id": record.id,
                "disable": True,
                "action": "DISABLE"
            }
            self.send_to_frontend(data, room)

    def send_to_frontend(self, data, room):
        def send_message():
            uri = f"ws://localhost:8000/{room}"  # Replace with your WebSocket server's URI and room identifier
            asyncio.set_event_loop(asyncio.new_event_loop())  # Create a new event loop
            loop = asyncio.get_event_loop()

            async def websocket_logic():
                async with websockets.connect(uri) as websocket:
                    await websocket.send(json.dumps(data))

            loop.run_until_complete(websocket_logic())

        # Start a new thread to run the asynchronous code
        asyncio_thread = threading.Thread(target=send_message)
        asyncio_thread.start()
