const socket = new WebSocket('ws://localhost:8090/websocket');

socket.onopen = function() {
    console.log('WebSocket connection established');
};

socket.onmessage = function(event) {
    const message = JSON.parse(event.data);
    console.log('Received from server:', message);
    // Handle the received message
};

socket.onclose = function() {
    console.log('WebSocket connection closed');
};

// To send a message to the server
function sendMessage(message) {
    socket.send(JSON.stringify(message));
}