import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../styles/UsersList.css';
import LoggedOut from './LoggedOut';
import Loading from './Loading';
import FriendRequests from '../components/FriendRequests';

function UsersList({ token, userid, sendFriendRequest, users, setUsers, error, setError, requestsLoading, requestDetails, setDeleted, setAccepted}) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [requestSent, setRequestSent] = useState();
    
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API}/odin-book/users/${userid}/userslist/?` + new URLSearchParams({
            secret_token: token,
        }), {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setUsers(data.users);
        }).catch(error => {
            setError(error.msg)
        }).finally(() => setLoading(false));
    }, [setError, setUsers, token, userid, requestSent])

    const handleClick = (id) => {
        sendFriendRequest(id);
        setRequestSent(id);
    }

    if (!token) return <LoggedOut/>
    if (error) return <p>A network error was encountered. {error}</p>
    if (loading) return <Loading/>
    return (
        <div className="usersList">
            <FriendRequests token={token} userid={userid} requestsLoading={requestsLoading} requestDetails={requestDetails} setDeleted={setDeleted} setAccepted={setAccepted}/>
            <div className="usersListHeading">Add new friends</div>
            {users.length ? users.map((user) => {
                return (
                    <div key={user._id} className='user'>
                        <img src={user.profile_image} alt="User profile image" className='userImage'/>
                        <div className='username'>{user.username}</div>
                        <Link id='seeProfileBtn' to={`/odin-book/users/${user._id}/profile`}>See profile</Link>
                        {user.requests.includes(userid) || requestSent === user._id ? (<div className='addFriendBtn'>Request sent!</div>) : (<div id={user._id} className='addFriendBtn' onClick={(event) => handleClick(event.target.id)}>Send friend request</div>)}
                    </div>
                )
            }) : (
                <div className="noUsers">No new users available!</div>
            )}
            <div className='goBack' onClick={() => navigate(-1)}>Go back</div>
        </div>
    )
}

UsersList.propTypes = {
    token: PropTypes.string,
    userid: PropTypes.string,
    sendFriendRequest: PropTypes.func,
    users: PropTypes.array,
    setUsers: PropTypes.func,
    error: PropTypes.string,
    setError: PropTypes.func,
    requestsLoading: PropTypes.bool,
    requestDetails: PropTypes.array,
    setDeleted: PropTypes.func,
    setAccepted: PropTypes.func,
}

export default UsersList;