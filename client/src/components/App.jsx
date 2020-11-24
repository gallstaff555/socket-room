import React, { Component } from "react";
import io from "socket.io-client";
import InputMessage from "./MessageInput";
import DisplayMessage from './DisplayMessage';

var socket;

class App extends Component {
    constructor() {
        super();
        this.state = {
            messages: [],
            communication: {
                messages: [],
                sender: ''
            },
            value: 0,
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

    handleEmitTest = () => {
        console.log("message sent");
        socket.emit("SEND_MESSAGE", this.state.value);
        const newValue = this.state.value + 1;
        this.setState({ value: newValue });
    };

    handleNewMessage = (msg) => {
        socket.emit('SEND_MESSAGE', msg);
    }



    render() {
        return (
            <React.Fragment>
                <h1>Chat room app</h1>
                <button className="btn btn-primary form-control m-2" 
                    style={{height: '40px', width: '100px'}}
                    onClick={() => this.handleEmitTest()}>
                        Emit Test
                </button>
                <InputMessage getMsg={this.handleNewMessage}/>
                <div></div>
                <div></div>
                {this.state.messages.map(m => (
                    <DisplayMessage message={m}/>
                ))}
            </React.Fragment>
        );
    }
}
export default App;

