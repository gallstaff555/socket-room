import React, { Component } from "react";
import moment from "moment";
import "./custom.scss";

class DisplayMessage extends Component {
    state = {
        timeAgo: moment(this.props.createdAt).fromNow(),
    };

    //current bug re: unmounted component updating state
    componentDidMount() {
        this.interval = setInterval(
            () => this.setState({ timeAgo: moment(this.props.createdAt).fromNow() }),
            5000
        );
    }

    render() {
        return (
            <div className='display-message' style={{ color: "white" }}>
                <span style={{ fontWeight: "bold" }}>{this.props.sender} </span>
                <span className='date-timeago'>{this.state.timeAgo}</span>
                <br></br>
                <span>{this.props.message}</span>
                <hr></hr>
            </div>
        );
    }
}

export default DisplayMessage;
