//set up express server
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4001;

server.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});

//const httpServer = http.createServer(app2);

//connect to database service
const db = require("./models/dbConnection");
db.connectToDatabase();

//set up socket.io
const socketIo = require("socket.io");
const io = socketIo(server, {
    cors: {
        origin: "*",
    },
});

//
//const app2 = express();
//app2.listen(3000, () => console.log("listening for HTTP requests on Port 3000"));

app.get("/test", (req, res) => {
    console.log("test test");
    res.send("hi");
});

app.get("/messages/public", async (req, res) => {
    res.send(await getMessages());
});

async function getMessages() {
    let public = db.collections["public"];
    console.log(public.toString());
    return await public.find();
    //return await public.find().sort({ _id: 1 });
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

    socket.on("join_room", (msg) => {
        console.log("message: ", msg, id);
        io.to(msg.room).emit("receive_message", msg);
    });

    //namespace for client disconnecting//
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

//app.listen(3000);

/*
GRAVEYARD
//const login = require("./config/config");
//const uri = `mongodb+srv://${login.user}:${login.pw}@david-sandbox.chqmq.mongodb.net/sockreact?retryWrites=true&w=majority`;
//const mongoDB = require("./db/dbConnection");

//const mongoose = require("mongoose");
// mongoose
//     .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log("Connected to mongo db..."))
//     .catch((err) => console.log("Could not connect to DB", err));

*/
