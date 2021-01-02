import React, { Component } from "react";
import io from "socket.io-client";
import axios from "axios";
import MessageLog from "./messageLog";
import MessageInput from "./messageInput";
import ChannelList from "./channelList";
import LoadMessages from "./loadMessages";
import Login from "./login";
import "./custom.scss";

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
            room: "",
            msgCount: 0,
            endpoint: "http://127.0.0.1:4001",
        };
    }

    async componentDidMount() {
        document.body.style.backgroundColor = "#2C2F33";

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

        let publicRooms = await this.getChannels();
        this.setState({ publicRooms, room: "public" });
    }

    render() {
        const { userName, messageDetails, publicRooms, room } = this.state;

        //render this if user has not signed in
        if (userName.length === 0) {
            return <Login getUser={this.handleGetUser} getRoom={this.handleGetRoom} />;
        }

        //render this after user has signed in
        return (
            <div className='row'>
                <div className='col-3'>
                    <ChannelList room={room} publicRooms={publicRooms} onSelectRoom={this.handleGetRoom} />
                </div>

                <div className='col'>
                    <div className='welcome' style={{ color: "white" }}>
                        <h3>Welcome, {this.state.userName}</h3>
                    </div>

                    <div className='message-log'>
                        <MessageLog messageDetails={messageDetails} />
                    </div>

                    <div className='message-input'>
                        <MessageInput getMsg={this.handleNewMessage} />
                        <div className='reload-msg'>
                            <LoadMessages loadMsg={this.handleLoadMsg} />
                        </div>
                    </div>
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

    //retrive old messages from current channel from the database
    handleLoadMsg = async () => {
        console.log("loading messages from database...");
        const msgLookup = {
            method: "GET",
            url: `/messages/${this.state.room}`,
        };

        let result = [];

        await axios
            .request(msgLookup)
            .then((res) => {
                result = [...res.data];
            })
            .catch((error) => {
                console.log("An error requesting messages from the db has occurred.");
                console.error(error);
            });

        let messageDetails = [];

        for (let m of result) {
            const object = m;
            const picked = (({ message, sender, createdAt }) => ({ message, sender, createdAt }))(object);
            messageDetails.push(picked);
        }

        console.log(messageDetails);

        this.setState({ messageDetails });
    };

    //Assign the given user name to this client instance.
    //Broadcast that the given user has joined the room.
    handleGetUser = (name) => {
        this.setState({ userName: name });
        socket.emit("join_room", {
            room: this.state.room,
            message: `has joined the chat.`,
            sender: name,
            createdAt: new Date(),
        });
    };

    //join a room and clear all messages
    handleGetRoom = (room) => {
        socket.emit("join", room);
        this.setState({ room });
        let messageDetails = [];
        this.setState({ messageDetails });
        //this.handleLoadMsg();
    };

    getChannels = async () => {
        console.log("getting channel names from server...");
        const channelLookup = {
            method: "GET",
            url: "/channels/global",
        };

        let result = [];

        await axios
            .request(channelLookup)
            .then((res) => {
                result = [...res.data];
            })
            .catch((error) => {
                console.log("there was a problem getting channel names from server");
                console.error(error);
            });

        return result;
        //this.setState({ publicRooms: result });
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

/*return (
            <div>
                <div className="content">
                    <Route path="/" exact component={test} />
                    <Route path="/test2" component={test2} />
                </div>
            </div>
        );


*/
