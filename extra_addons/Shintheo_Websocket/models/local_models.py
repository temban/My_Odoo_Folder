# Import required modules
import asyncio
import websockets
from odoo import models, api, fields


class WebSocketServer(models.AbstractModel):
    _name = 'websocket.server'

    @api.model
    def _run_websocket_server(self):
        async def handle_websocket(websocket, path):
            while True:
                try:
                    # Receive data from the client
                    data = await websocket.recv()

                    # Process the data and send a response
                    response = self.process_data(data)
                    await websocket.send(response)

                except websockets.exceptions.ConnectionClosed:
                    break

        async def start_server():
            server = await websockets.serve(handle_websocket, '0.0.0.0', 8765)
            await server.wait_closed()

        # Initialize and run the event loop
        loop = asyncio.get_event_loop()
        loop.run_until_complete(start_server())

    @api.model
    def process_data(self, data):
        # Add your own data processing logic here
        return "Processed: " + data


class WebSocketServerControl(models.TransientModel):
    _name = 'websocket.server.control'

    @api.model
    def start_websocket_server(self):
        self.env['websocket.server']._run_websocket_server()

