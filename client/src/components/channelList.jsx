import React from "react";

const ChannelList = (props) => {
    const { publicRooms, room, onSelectRoom } = props;

    return (
        <ul className="list-group">
            <li className="list-group-item" style={{ fontWeight: "bold" }}>
                Public Channels
            </li>
            {publicRooms.map((r) => (
                <li
                    onClick={() => onSelectRoom(r)}
                    key={r}
                    className={r === room ? "list-group-item active" : "list-group-item"}
                >
                    {r}
                </li>
            ))}
        </ul>
    );
};

export default ChannelList;
