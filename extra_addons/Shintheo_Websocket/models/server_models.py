import json
import logging
import asyncio
from odoo import api, models, _

# Enable logging
_logger = logging.getLogger(__name__)


# WebSocket server class
class WebSocketServer(models.AbstractModel):
    _name = 'websocket.server'

    # WebSocket server initialization method
    def init(self):
        super(WebSocketServer, self).init()

        # Start the WebSocket server on application startup
        asyncio.ensure_future(self.start_server())

    # WebSocket server start method
    async def start_server(self):
        # Create an event loop
        loop = asyncio.get_running_loop()

        # Create a WebSocket server
        server = await loop.create_server(
            lambda: WebSocketHandlerProtocol(self),
            '0.0.0.0',
            9000
        )

        # Log server start
        _logger.info('WebSocket server started on port 9000')

        try:
            # Run the server until cancelled
            await server.wait_closed()
        except asyncio.CancelledError:
            pass

    # Method to broadcast a message to all connected clients
    def broadcast_message(self, message):
        for client_protocol in self.env['websocket.client'].get_connected_clients():
            client_protocol.send_message(message)

    # Odoo RPC method called from another model or controller to send message to connected clients
    @api.model
    def send_message(self, message):
        self.broadcast_message(message)


# WebSocket handler protocol class
class WebSocketHandlerProtocol(asyncio.Protocol):
    def __init__(self, ws_server):
        self.ws_server = ws_server
        self.transport = None

    def connection_made(self, transport):
        self.transport = transport

    def data_received(self, data):
        try:
            message = data.decode()

            # Handle incoming messages here
            self.handle_message(message)
        except Exception as e:
            _logger.error('Error processing incoming WebSocket message: %s', e)

    def handle_message(self, message):
        # Process the received message here
        _logger.info('Received WebSocket message: %s', message)

        # Example: Send the received message back to the client
        self.send_message(message)

    def connection_lost(self, exc):
        # Implement any required cleanup or logging here
        pass

    def send_message(self, message):
        if self.transport and not self.transport.is_closing():
            self.transport.write(json.dumps(message).encode())


# WebSocket client model
class WebSocketClient(models.AbstractModel):
    _name = 'websocket.client'
    _description = 'WebSocket Client'

    # Method to get all connected clients
    def get_connected_clients(self):
        clients = []
        for task in asyncio.all_tasks():
            protocol = task.get_coro().cr_frame.f_locals.get('self')
            if isinstance(protocol, WebSocketHandlerProtocol):
                clients.append(protocol)
        return clients
