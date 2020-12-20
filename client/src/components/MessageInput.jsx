import React, { Component } from "react";
import "./chat.css";

class MessageInput extends Component {
    state = {
        message: "",
    };

    handleChange = (e) => {
        let message = e.currentTarget.value;
        this.setState({ message });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({ message: "" });
    };

    handleValidation() {}

    render() {
        return (
            <React.Fragment>
                <form onSubmit={this.handleSubmit} className='submit-message-form'>
                    <div className='form-group'>
                        <label htmlFor='msg' style={{ color: "white" }}>
                            Enter Message
                        </label>
                        <input
                            value={this.state.message}
                            autoFocus
                            id='msg'
                            type='text'
                            className='form-control'
                            onChange={this.handleChange}
                            style={{ width: "800px" }}
                        ></input>
                        <button
                            onClick={() => this.props.getMsg(this.state.message)}
                            className='btn btn-primary m-2'
                            disabled={this.state.message.length < 1}
                            style={{ display: "none" }}
                        ></button>
                    </div>
                </form>
            </React.Fragment>
        );
    }
}

export default MessageInput;
