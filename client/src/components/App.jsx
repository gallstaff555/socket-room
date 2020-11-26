import React, { Component } from "react";
import io from "socket.io-client";
import { v4 as uuid_v4 } from "uuid";
import MessageInput from "./MessageInput";
import DisplayMessage from "./DisplayMessage";
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
            messages: [],
            userName: "",
            room: 1,
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
    //Broadcast that the given user has joined the channel.
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

    render() {
        const { userName, messageDetails } = this.state;
        if (userName.length === 0) {
            return <Login getUser={this.handleGetUser} getRoom={this.handleGetRoom} />;
        }

        return (
            <React.Fragment>
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
            </React.Fragment>
        );
    }
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
