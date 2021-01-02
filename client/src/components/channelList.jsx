import React from "react";
import "./custom.scss";

const ChannelList = (props) => {
    const { publicRooms, room, onSelectRoom } = props;

    return (
        <ul className='list-group channel-list'>
            <li className='list-group-item list-group-item-dark' style={{ fontWeight: "bold" }}>
                Public Channels
            </li>
            {publicRooms.map((r) => (
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
};

export default ChannelList;
