/*
This server is the backend for the Sockreact Chat App. Clients can connect via 
socket.io client and share messages in multiple global chat rooms/channels. 

Messages are shared over the socket.io interface and are stored in a mongodb.
Clients can retrieve old messages from the database. 

This server keeps track of users currently connected and updates the list of users
when clients join or disconnect. 
*/

//set up express server
const express = require("express");
const http = require("http");
const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);
const PORT = process.env.PORT || 4001;

server.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});

//connect to database service
const db = require("./models/dbConnection");
db.connectToDatabase();

//set up socket.io
const socketIo = require("socket.io");
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000/",
        credentials: true,
        methods: ["GET", "POST"],
    },
});

//define global channels and create endpoint for each channel
const globalChannels = ["public", "general", "global"];

//create endpoints to get full logs for each channel/chatroom
globalChannels.forEach((channel) => {
    app.get(`/messages/${channel}`, async (req, res) => {
        res.send(await getMessages(channel));
    });
});

//client can retrieve names of the channels
app.get("/channels/global", async (req, res) => {
    res.send(globalChannels);
});

//TODO: add validation so that no duplicate usernames can be taken at same time
//a list of clients currently connected to the server/socketio
let users = new Set();

//sends current usernames to the client
app.get("/users/names", async (req, res) => {
    res.send(Array.from(users));
});

//fetch and return all messages from the given channel from the corresponding mongodb collection
async function getMessages(channel) {
    let collection = db.collections[channel];
    console.log(collection.toString());
    return await collection.find();
}

io.on("connection", (socket) => {
    const { id } = socket.client;
    console.log(`Client connected: ${id}`);

    socket.on("join", (room) => {
        socket.join(room);
        console.log(`${socket.id} is now in room: ${room}`);
    });

    //when message is received:
    //1) send message to everyone in the current room
    //2) print message to console
    //3) write message to database
    socket.on("send_message", (msg) => {
        console.log("message: ", msg, id);
        io.to(msg.room).emit("receive_message", msg);
        console.log("room:", msg.room);
        let m = new db.collections[msg.room]({ ...msg }); //create document
        m.save(function (err, content) {
            if (err) return console.error(err);
            console.log(`${content.message} written to database.`);
        });
    });

    //emit a message to all connected users in a given room that a new client has connected
    socket.on("join_room", (msg) => {
        console.log("message: ", msg, id);
        io.to(msg.room).emit("receive_message", msg);
    });

    //client sends their username to the server to be added to set of usernames
    //server broadcasts the updated list of usernames to all connected clients
    socket.on("send_username", (msg) => {
        console.log("client is providing their username: ", msg.username);
        let user = {
            socketID: id,
            username: msg.username,
        };
        users.add(user);
        socket.broadcast.emit("update_users_list");
    });

    //remove disconnecting client from set of usernames
    socket.on("disconnect", () => {
        console.log("Client disconnected");
        let remainingUsers = [...users].filter((user) => user.socketID !== id);
        users = new Set(remainingUsers);
        socket.broadcast.emit("update_users_list");
    });
});
