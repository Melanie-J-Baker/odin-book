import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/UsersList.css';

UsersList.propTypes = {
    token: PropTypes.string,
    userid: PropTypes.string
}

function UsersList({ token, userid }) {
    const fetchDone = useRef(false);
    const responseSending = useRef(false);
    const [users, setUsers] = useState([])

    useEffect(() => {
        if (fetchDone.current) return;
        const fetchData = () => {
            fetch(`${import.meta.env.VITE_API}/odin-book/users/${userid}/userslist/?` + new URLSearchParams({
                secret_token: token,
            }), {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }).then((response) => {
                return response.json();
            }).then((data) => {
                console.log(data);
                setUsers(data.users)
            }).catch(error => console.log(error));
            fetchDone.current = true;
        }
        fetchData();
    }, [token, userid])

    const addFriend = (newUserId) => {
        if (responseSending.current) return;
        responseSending.current = true;
        fetch(`${import.meta.env.VITE_API}/odin-book/users/${userid}/addfriend/?` + new URLSearchParams({
            secret_token: token,
        }), {
            method: 'PUT',
            mode: 'cors',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                following: newUserId
            })
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data);
        })
        responseSending.current = false;
    }

    return (
        <div className="usersList">
            <div className="usersListHeading">Add new friends</div>
            {users.map((user) => {
                return (
                    <div key={user._id} className='user' id={user._id}>
                        <img src={user.profile_image} alt="User profile image" className='userImage'/>
                        <div className='username'>{user.username}</div>
                        <div id={user._id} className='addFriendBtn' onClick={(event) => addFriend(event.target.id)}>Add friend</div>
                    </div>
                )
        })}</div>
    )
}

export default UsersList;