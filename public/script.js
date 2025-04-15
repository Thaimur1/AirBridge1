const socket = io("https://airbridge2.onrender.com");  // Connect to the server

const textArea = document.getElementById("text-input");
const userCount = document.getElementById("user-count");

// Listen for text input and send to server
textArea.addEventListener("input", () => {
    const text = textArea.value;
    socket.emit("newText", text); // Send text to server
});

// Listen for real-time text updates
socket.on("updateText", (data) => {
    textArea.value = data; // Update text on all connected clients
});

// Listen for connected users count
socket.on("updateUsers", (count) => {
    userCount.innerText = `Connected Users: ${count}`;
});
