import React, { Component } from "react";
import "./custom.scss";

class LoadMessages extends Component {
    render() {
        return (
            <div className='loadMsgBtn'>
                <button type='button' onClick={() => this.props.loadMsg()} className='btn btn-secondary'>
                    Load Old Messages
                </button>
            </div>
        );
    }
}

export default LoadMessages;
