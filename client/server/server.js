const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const port = process.env.PORT || 4001;

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    const { id } = socket.client;
    console.log(`Client connected: ${id}`);

    socket.on("join", (room) => {
        socket.join(room);
        console.log(`${socket.id} is now in room: ${room}`);
    });

    socket.on("send_message", (msg) => {
        console.log("message: ", msg, id);
        io.to(msg.room).emit("receive_message", msg);
    });

    //namespace for client disconnecting
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
