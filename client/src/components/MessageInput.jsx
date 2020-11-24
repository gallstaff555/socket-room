import React, { Component } from "react";

class MessageInput extends Component {

    state = {
        message: ''
    }

    handleChange = e => {
        let message = e.currentTarget.value;
        this.setState( { message });
    };

    handleSubmit = e => {
        e.preventDefault();
        this.setState( { message: ''} );
    };

    handleValidation() {

    }

    render() {
        return (
            <React.Fragment>
                <form onSubmit={this.handleSubmit} className="form">
                    <div className="form-group">
                        <label htmlFor="msg">Message</label>
                        <input 
                            value={this.state.message} 
                            autoFocus id="msg" type="text" 
                            className="form-control"
                            onChange={this.handleChange}>
                        </input>
                        <button 
                            onClick={() => this.props.getMsg(this.state.message)} 
                            className="btn btn-primary m-2"
                            disabled={this.state.message.length < 1}>
                            Send
                        </button>
                    </div>
                </form>
            </React.Fragment>
        );
    }
}

export default MessageInput;
