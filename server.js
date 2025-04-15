const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname + "/public")); // Serve static files

let connectedUsers = 0; // Track number of users
let sharedText = ""; // Store shared text

io.on("connection", (socket) => {
    connectedUsers++; // Increase user count when a new user connects
    io.emit("updateUsers", connectedUsers); // Notify all clients about the update
    console.log(`A user connected! Total users: ${connectedUsers}`);

    // Send the latest shared text to the newly connected user
    socket.emit("updateText", sharedText);

    // Listen for text updates from users
    socket.on("newText", (data) => {
        sharedText = data; // Update the shared text
        socket.broadcast.emit("updateText", sharedText); // Send update to all other users
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
        connectedUsers--; // Decrease user count
        io.emit("updateUsers", connectedUsers); // Notify all clients
        console.log(`A user disconnected! Total users: ${connectedUsers}`);
    });
});

// Run server on your laptop's local IP (for mobile access)
const PORT = 3000;

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
});

