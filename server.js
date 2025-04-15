const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors"); // To handle cross-origin requests

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*", // Allow all origins (you can restrict this later)
        methods: ["GET", "POST"]
    }
});

app.use(cors()); // Enable CORS
app.use(express.static(__dirname + "/public")); // Serve static files

let connectedUsers = 0; // Track number of users
let sharedText = ""; // Store shared text

io.on("connection", (socket) => {
    connectedUsers++;
    io.emit("updateUsers", connectedUsers);
    console.log(`✅ A user connected! Total users: ${connectedUsers}`);

    socket.emit("updateText", sharedText); // Send latest text to new user

    socket.on("newText", (data) => {
        sharedText = data;
        socket.broadcast.emit("updateText", sharedText);
        console.log("📝 Updated shared text:", sharedText);
    });

    socket.on("disconnect", () => {
        connectedUsers--;
        io.emit("updateUsers", connectedUsers);
        console.log(`❌ A user disconnected. Total users: ${connectedUsers}`);
    });
});

// ✅ Use dynamic port for Render, fallback to 3000 for local dev
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
