import React, { Component } from "react";
import moment from "moment";
import "./chat.css";

class DisplayMessage extends Component {
    state = {
        timeAgo: moment(this.props.createdAt).fromNow(),
        //timeAgo: moment().format("MMM Do YYYY"),
    };

    render() {
        return (
            <div className="display-message">
                <span style={{ fontWeight: "bold" }}>{this.props.sender} </span>
                <span className="date-timeago">{this.state.timeAgo}</span>
                <br></br>
                <span>{this.props.message}</span>
                <hr></hr>
            </div>
        );
    }
}

export default DisplayMessage;
