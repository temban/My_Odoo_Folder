import pathlib
import ssl
import threading
import socket

from odoo import models, api
import asyncio
import websockets
import json
import websockets.exceptions

# Create a dictionary to store connected clients for each room
connected_clients = {}
PORT = 9090


async def handle_connection(websocket, path):
    # Extract the room name from the path (e.g., "/room1" or "/room2")
    room = path.strip("/")

    # Add the current WebSocket client to the set of connected clients for the specified room
    if room not in connected_clients:
        connected_clients[room] = set()
    connected_clients[room].add(websocket)

    try:
        async for data in websocket:
            # Attempt to parse the received data as JSON
            try:
                message = json.loads(data)
                print(f"Received message in room {room}: {message}")

                # Modify the message or process it as needed

                # Send the modified message back as JSON to all clients in the room
                response = {
                    "status": "Received",
                    "data": message
                }
                await asyncio.gather(*[client.send(json.dumps(response)) for client in connected_clients[room]])

            except json.JSONDecodeError as e:
                print(f"Received invalid JSON: {data}")
    except websockets.exceptions.ConnectionClosed as e:
        # Handle the WebSocket connection closure gracefully
        if e.code == 1000:
            print(f"WebSocket connection tried to be close with message: {e}")
        else:
            print(f"WebSocket connection tried to be closed with code {e.code}")
    finally:
        # Remove the WebSocket client from the set when the connection is closed
        connected_clients[room].remove(websocket)


async def heartbeat():
    while True:
        await asyncio.sleep(5)  # Send heartbeat every 5 seconds
        for room in connected_clients.keys():
            # Send a Ping message to each connected client in the room
            await asyncio.gather(*[client.ping() for client in connected_clients.get(room, [])])

async def main():
    while True:
        try:
            ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
            ssl_context.load_cert_chain(
                pathlib.Path('/opt/odoo-custom-addons/Shintheo_Websocket/static/ssl_files/cert.pem'),
                pathlib.Path('/opt/odoo-custom-addons/Shintheo_Websocket/static/ssl_files/privkey.pem')
            )
            server = await websockets.serve(handle_connection, "0.0.0.0", PORT, ssl=ssl_context)
            await (await server).wait_closed()
            # Create and start the heartbeat task
            heartbeat_task = asyncio.create_task(heartbeat())

            # Start the WebSocket server and heartbeat task
            await asyncio.gather(server, heartbeat_task)
        except Exception as e:
            print(f"WebSocket server error: {e}")
            await asyncio.sleep(5)  # Wait for a while before attempting to restart

async def run_websocket_server():
    while True:
        try:
            await main()
        except Exception as e:
            print(f"WebSocket server restart error: {e}")
            await asyncio.sleep(5)  # Wait before restarting the WebSocket server

class WebSocketIntegration(models.Model):
    _name = 'tba.websocket'
    _description = "Shintheo websocket for real-time data transfer"

    @api.model
    def run_server_websocket_script(self):
        try:
            # Try to bind to the port
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.bind(('', PORT))
            s.close()
            print(f"Port {PORT} is not in use.")
            print("WebSocket script is started......")
            asyncio.run(run_websocket_server())
        except OSError as e:
            if e.errno == 98:
                # Error code 98 indicates the port is already in use
                print(f"Port {PORT} is in use.")
            else:
                # Handle other socket-related errors
                print(f"Error: {e}")

async def on_close(websocket, path, close_status):
    if close_status == 1006:
        print("WebSocket closed with status code 1006. Restarting...")
        await asyncio.sleep(5)  # Wait before restarting the WebSocket
        asyncio.create_task(main())


def server_websocket_call(data, room):
    async def server_websocket_logic():
        uri = f"wss://preprod.hubkilo.com:{PORT}/{room}"  # Replace with your WebSocket server's URI and room identifier
        ssl_context = ssl.SSLContext()
        ssl_context.check_hostname = False  # Disable hostname verification
        ssl_context.verify_mode = ssl.CERT_NONE

        async with websockets.connect(uri, ssl=ssl_context) as websocket:
            await websocket.send(json.dumps(data))

            # Keep the connection open and handle incoming messages
            async for message in websocket:
                # Handle the incoming message here
                print(f"Received message: {message}")

    # Start a new thread to run the asynchronous code
    asyncio_thread = threading.Thread(target=lambda: asyncio.run(server_websocket_logic()))
    asyncio_thread.start()
