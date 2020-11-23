import React, { Component } from "react";
import io from "socket.io-client";

//const sock = io.connect("http://localhost:3000");

var socket;

class App extends Component {
    constructor() {
        super();
        this.state = {
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
        });
    }

    render() {
        return (
            <React.Fragment>
                <h1>Chat room app</h1>
                <button className="btn btn-primary form-control m-2" onClick={() => this.handleSend()}>
                    Send Message
                </button>
                <div>{this.state.value}</div>
                <div></div>
                <div></div>
                <div></div>
                <form>
                    <div className="formGroup">
                        <label> for="</label>
                    </div>
                </form>
            </React.Fragment>
        );
    }

    handleSend = () => {
        console.log("message sent");
        socket.emit("SEND_MESSAGE", this.state.value);
        const newValue = this.state.value + 1;
        this.setState({ value: newValue });
        //this.socket.emit("SEND_MESSAGE", "hodor");
        //this.socket.emit("RECEIVE_MESSAGE", "bleh");
        //this.socket.emit("SEND_MESSAGE", "hello?");
    };
}

export default App;

// export default class App extends React.Component {
//     state = {
//         users: [],
//     };
//     componentDidMount() {
//         axios.get("/users.json").then((response) => {
//             this.setState({ users: response.data });
//         });
//     }

//     render() {
//         const { users } = this.state;
//         return (
//             <div>
//                 <ul className="users">
//                     {users.map((user) => (
//                         <li className="user">
//                             <p>
//                                 <strong>Name:</strong> {user.name}
//                             </p>
//                             <p>
//                                 <strong>Email:</strong> {user.email}
//                             </p>
//                             <p>
//                                 <strong>City:</strong> {user.address.city}
//                             </p>
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         );
//     }
// } */
