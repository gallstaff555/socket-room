import React, { Component } from "react";
import io from "socket.io-client";
import Message from "./Message";

var socket;

class App extends Component {
    constructor() {
        super();
        this.state = {
            messages: [],
            value: 0,
            value2: 0,
            endpoint: "http://127.0.0.1:4001",
        };
    }

    componentDidMount() {
        const { endpoint } = this.state;
        socket = io(endpoint);
        socket.on("SEND_MESSAGE", (value) => {
            const newValue = value + 1;
            this.setState({ value: newValue });
        });
        socket.on("RECEIVE_MESSAGE", (value) => {
            console.log("Message received", value);
            let messages = this.state.messages;
            messages.push(value);
            this.setState( { messages });
        });
    }

    render() {
        return (
            <React.Fragment>
                <h1>Chat room app</h1>
                <button className="btn btn-primary form-control m-2" 
                    onClick={() => this.handleEmitTest()}>
                        Emit Test
                </button>
                <div>{this.state.value}</div>
                <Message getMsg={this.handleNewMessage}/>
                <div></div>
                <div></div>
                {this.state.messages.map(m => (
                    <div key={m}>{m}</div>
                ))}
            </React.Fragment>
        );
    }

    handleEmitTest = () => {
        console.log("message sent");
        socket.emit("SEND_MESSAGE", this.state.value);
        const newValue = this.state.value + 1;
        this.setState({ value: newValue });
    };

    handleNewMessage = (msg) => {
        socket.emit('SEND_MESSAGE', msg);
    }
}

export default App;

