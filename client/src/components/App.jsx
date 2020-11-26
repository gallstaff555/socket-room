import React, { Component } from "react";
import io from "socket.io-client";
import { v4 as uuid_v4 } from "uuid";
import MessageInput from "./MessageInput";
import DisplayMessage from "./DisplayMessage";
import ChannelList from "./channelList";
import Login from "./login";

var socket;

class App extends Component {
    constructor() {
        super();
        this.state = {
            messageDetails: [
                {
                    message: "",
                    sender: "",
                    createdAt: "",
                },
            ],
            publicRooms: [],
            userName: "",
            room: "Public",
            msgCount: 0,
            endpoint: "http://127.0.0.1:4001",
        };
    }

    componentDidMount() {
        const { endpoint } = this.state;
        socket = io(endpoint);

        socket.on("send_message", (count) => {
            const msgCount = count + 1;
            this.setState({ msgCount });
        });

        socket.on("receive_message", (msg) => {
            console.log("Message received", msg.message);
            let messages = this.state.messageDetails;
            messages.push({ message: msg.message, sender: msg.sender, createdAt: msg.createdAt });
            this.setState({ messageDetails: messages });
        });

        let publicRooms = ["Public", "Room-1", "Room-2"];
        this.setState({ publicRooms, room: "Public" });
    }

    render() {
        const { userName, messageDetails, publicRooms, room } = this.state;
        if (userName.length === 0) {
            return <Login getUser={this.handleGetUser} getRoom={this.handleGetRoom} />;
        }

        return (
            <div className="row">
                <div className="col-3">
                    <ChannelList room={room} publicRooms={publicRooms} onSelectRoom={this.handleGetRoom} />
                </div>

                <div className="col">
                    <h3>Welcome, {this.state.userName}</h3>
                    {messageDetails
                        .filter((m) => m.message.length > 0)
                        .map((m) => (
                            <DisplayMessage
                                key={uuid_v4()}
                                message={m.message}
                                sender={m.sender}
                                createdAt={m.createdAt}
                            />
                        ))}
                    <MessageInput getMsg={this.handleNewMessage} />
                </div>
            </div>
        );
    }

    //Emit the given message to everyone in the room as this client.
    handleNewMessage = (msg) => {
        let newValue = this.state.msgCount + 1;
        this.setState({ msgCount: newValue });
        socket.emit("send_message", {
            room: this.state.room,
            message: msg,
            sender: this.state.userName,
            createdAt: new Date(),
        });
    };

    //Assign the given user name to this client instance.
    //Broadcast that the given user has joined the room.
    handleGetUser = (name) => {
        this.setState({ userName: name });
        socket.emit("send_message", {
            room: this.state.room,
            message: `has joined the chat.`,
            sender: name,
            createdAt: new Date(),
        });
    };

    handleGetRoom = (room) => {
        socket.emit("join", room);
        this.setState({ room });
    };
}
export default App;

/*Graveyard
<button className="btn btn-primary form-control m-2" onClick={() => this.handleEmitTest()}>
    Emit Test
</button>

//Emits a test message.
handleEmitTest = () => {
    console.log(`Message sent by ${socket.id}`);
    socket.emit("send_message", { room: this.state.room, message: this.state.msgCount });
    const newValue = this.state.msgCount + 1;
    this.setState({ msgCount: newValue });
};


*/
