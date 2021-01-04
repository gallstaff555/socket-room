import React from "react";
import { v4 as uuid_v4 } from "uuid";
import "./custom.scss";

const UserList = (props) => {
    const { otherUsers, myUserName } = props;

    let userCount = otherUsers.length;

    if (userCount > 0) {
        return (
            <ul className='list-group list-group-flush'>
                <li className='list-group-item-secondary' key={uuid_v4()}>
                    Active Now
                </li>
                {otherUsers
                    .filter((n) => n.username !== myUserName)
                    .map((name) => (
                        <li className='list-group-item-dark' key={uuid_v4()}>
                            {name.username}
                        </li>
                    ))}
            </ul>
        );
    } else {
        return (
            <ul className='list-group list-group-flush'>
                <li className='list-group-item-secondary' key={uuid_v4()}>
                    No Other Users...
                </li>
            </ul>
        );
    }
};

export default UserList;
