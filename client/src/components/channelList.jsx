import React, { Component } from "react";
import "./custom.scss";

//const ChannelList = (props) => {

class ChannelList extends Component {
    render() {
        const { chatRooms, room, onSelectRoom, title } = this.props;
        return (
            <ul className='list-group channel-list'>
                <li className='list-group-item list-group-item-secondary' style={{ fontWeight: "bold" }}>
                    {title}
                </li>
                {chatRooms.map((r) => (
                    <li
                        onClick={() => onSelectRoom(r)}
                        key={r}
                        className={r === room ? "list-group-item active" : "list-group-item list-group-item-dark"}
                    >
                        {r}
                    </li>
                ))}
            </ul>
        );
    }
}

export default ChannelList;
