import React, { Component } from "react";

class Login extends Component {
    state = {
        inputName: "",
        room: 1,
    };

    handleNameChange = (e) => {
        let inputName = e.currentTarget.value;
        this.setState({ inputName });
    };

    handleRoomChange = (e) => {
        let room = e.currentTarget.value;
        this.setState({ room });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.getUser(this.state.inputName);
        this.props.getRoom(this.state.room);
    };

    render() {
        return (
            <form className="userNameForm" onSubmit={this.handleSubmit}>
                <label className="m-4">
                    Give your name:
                    <input
                        value={this.state.inputName}
                        autoFocus
                        id="msg"
                        type="text"
                        className="form-control m-4"
                        onChange={this.handleNameChange}
                        style={{ width: "400px" }}
                    ></input>
                </label>
                <label className="m-4">
                    Select a room
                    <input
                        value={this.state.room}
                        id="msg"
                        type="text"
                        className="form-control m-4"
                        onChange={this.handleRoomChange}
                        style={{ width: "400px" }}
                    ></input>
                </label>
                <button
                    //onClick={() => this.props.getUser(this.state.inputName)}
                    onClick={this.onSubmit}
                    className="btn btn-primary m-4"
                    disabled={this.state.inputName.length === 0}
                >
                    Send
                </button>
            </form>
        );
    }
}

export default Login;
