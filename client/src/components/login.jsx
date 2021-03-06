import React, { Component } from "react";
import "./custom.scss";

class Login extends Component {
    state = {
        inputName: "",
        room: "public",
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
        this.props.sendUsername(this.state.inputName);
    };

    render() {
        return (
            <div className='login-form'>
                <h2>Sockreact Chat</h2>
                <form onSubmit={this.handleSubmit}>
                    <div className='form-group'>
                        <label className='control-label'>Username</label>
                        <input
                            value={this.state.inputName}
                            autoFocus
                            id='msg'
                            type='text'
                            className='form-control'
                            onChange={this.handleNameChange}
                        ></input>
                    </div>
                    <div className='form-group'>
                        <label className='control-label'>Channel</label>
                        <input
                            value={this.state.room}
                            id='msg'
                            type='text'
                            className='form-control'
                            onChange={this.handleRoomChange}
                        ></input>
                    </div>
                    <div className='form-group'>
                        <button
                            onClick={this.onSubmit}
                            className='btn btn-primary'
                            disabled={this.state.inputName.length === 0}
                        >
                            Join
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

export default Login;
