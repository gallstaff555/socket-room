import React, { Component } from "react";
import io from "socket.io-client";
import { v4 as uuid_v4 } from "uuid";
import InputMessage from "./MessageInput";
import DisplayMessage from "./DisplayMessage";
import Login from "./login";

var socket;

class App extends Component {
    constructor() {
        super();
        this.state = {
            messages: [],
            userName: "",
            room: 1,
            value: 0,
            endpoint: "http://127.0.0.1:4001",
        };
    }

    componentDidMount() {
        const { endpoint } = this.state;
        socket = io(endpoint);

        socket.on("send_message", (value) => {
            const newValue = value + 1;
            this.setState({ value: newValue });
        });

        socket.on("receive_message", (value) => {
            console.log("Message received", value.message);
            let messages = this.state.messages;
            messages.push(value.message);
            this.setState({ messages });
        });
    }

    handleEmitTest = () => {
        console.log(`Message sent by ${socket.id}`);
        socket.emit("send_message", { room: this.state.room, message: this.state.value });
        const newValue = this.state.value + 1;
        this.setState({ value: newValue });
    };

    handleNewMessage = (msg) => {
        let newValue = this.state.value + 1;
        this.setState({ value: newValue });
        socket.emit("send_message", { room: this.state.room, message: msg });
    };

    handleGetUser = (name) => {
        console.log("the given name is", name);
        this.setState({ userName: name });
    };

    handleGetRoom = (room) => {
        socket.emit("join", room);
        this.setState({ room });
    };

    render() {
        const { userName } = this.state;
        if (userName.length === 0) {
            return <Login getUser={this.handleGetUser} getRoom={this.handleGetRoom} />;
        }

        return (
            <React.Fragment>
                <h1>Welcome, {this.state.userName}</h1>
                <button className="btn btn-primary form-control m-2" onClick={() => this.handleEmitTest()}>
                    Emit Test
                </button>
                <InputMessage getMsg={this.handleNewMessage} />
                <div></div>
                <div></div>
                {this.state.messages.map((m) => (
                    <DisplayMessage key={uuid_v4()} message={m} />
                ))}
            </React.Fragment>
        );
    }
}
export default App;
