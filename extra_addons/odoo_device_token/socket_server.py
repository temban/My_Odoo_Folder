import asyncio
import websockets
import json

# Create a dictionary to store connected clients for each room
connected_clients = {}


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

    except websockets.exceptions.ConnectionClosed:
        pass  # Handle the connection closed event

    finally:
        # Remove the WebSocket client from the set when the connection is closed
        connected_clients[room].remove(websocket)


async def heartbeat():
    while True:
        await asyncio.sleep(5)  # Send heartbeat every 5 seconds
        for room in connected_clients.keys():
            # print(f'Sent heartbeat to room {room}')

            # Send a Ping message to each connected client in the room
            await asyncio.gather(*[client.ping() for client in connected_clients.get(room, [])])


async def main():
    server = websockets.serve(handle_connection, "localhost", 8000)

    # Create and start the heartbeat task
    heartbeat_task = asyncio.create_task(heartbeat())

    # Start the WebSocket server and heartbeat task
    await asyncio.gather(server, heartbeat_task)


if __name__ == "__main__":
    asyncio.run(main())
