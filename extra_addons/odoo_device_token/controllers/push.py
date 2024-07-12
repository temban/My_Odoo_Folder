from odoo import http
from odoo.http import request
import websockets
import asyncio

class YourController(http.Controller):

    @http.route('/your_model/send_data_to_frontend', type='json', auth='none')
    def send_data_to_frontend(self):
        data_to_send = '{"event": "your_event", "data": "your_data"}'
        asyncio.get_event_loop().run_until_complete(send_to_frontend(data_to_send))
        return {'status': 'success', 'message': 'Data sent to frontend'}

async def send_to_frontend(data):
    async with websockets.connect("ws://localhost:8765") as websocket:
        await websocket.send(data)