import React, { Component } from "react";
import DisplayMessage from "./displayMessage";
import { v4 as uuid_v4 } from "uuid";

class MessageLog extends Component {
    render() {
        return this.props.messageDetails
            .filter((m) => m.message.length > 0)
            .map((m) => (
                <DisplayMessage
                    key={uuid_v4()}
                    message={m.message}
                    sender={m.sender}
                    createdAt={m.createdAt}
                />
            ));
    }
}

export default MessageLog;
