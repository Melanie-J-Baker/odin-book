import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../styles/UsersList.css';
import Loading from './Loading';
import FollowRequests from '../components/FollowRequests';

UsersList.propTypes = {
    token: PropTypes.string,
    userid: PropTypes.string,
    sendFollowRequest: PropTypes.func,
    users: PropTypes.array,
    setUsers: PropTypes.func,
    error: PropTypes.string,
    setError: PropTypes.func,
    requests: PropTypes.array,
    setRequests: PropTypes.func,
}

function UsersList({ token, userid, sendFollowRequest, users, setUsers, error, setError, requests, setRequests }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API}/odin-book/users/${userid}/userslist/?` + new URLSearchParams({
            secret_token: token,
        }), {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setUsers(data.users);
            setRequests(data.requests);
        }).catch(error => {
            setError(error.msg)
        }).finally(() => setLoading(false));
    }, [setError, setRequests, setUsers, token, userid])

    const handleClick = (id) => {
        sendFollowRequest(id);
    }

    if (error) return <p>A network error was encountered {error}</p>
    if (loading) return <Loading/>
    return (
        <div className="usersList">
            <FollowRequests token={token} userid={userid} setUsers={setUsers} />
            <div className="usersListHeading">Follow new users</div>
            {users.length ? users.map((user) => {
                return (
                    <div key={user._id} className='user'>
                        <img src={user.profile_image} alt="User profile image" className='userImage'/>
                        <div className='username'>{user.username}</div>
                        <Link id='seeProfileBtn' to={`/odin-book/users/${user._id}/userprofile`}>See profile</Link>
                        {!requests.includes(user._id) ? (<div id={user._id} className='addFollowBtn' onClick={(event) => handleClick(event.target.id)}>Send follow request</div>) : (<div className='addFollowBtn'>Request sent!</div>)}
                    </div>
                )
            }) : (
                <div className="noUsers">No new users available!</div>
            )}
            <div className='goBack' onClick={() => navigate(-1)}>Go back</div>
        </div>
    )
}

export default UsersList;