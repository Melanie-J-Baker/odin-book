import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import '../styles/FollowRequests.css';
import Loading from '../pages/Loading';

FollowRequests.propTypes = {
    token: PropTypes.string,
    userid: PropTypes.string,
    setUsers:PropTypes.func,
}

function FollowRequests({ token, userid, setUsers }) {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API}/odin-book/users/${userid}/?` + new URLSearchParams({
            secret_token: token,
        }), {
            mode: 'cors',
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setRequests(data.user.requests);
        }).catch((error) => {
            console.log(error);
            setError(error.msg);
        }).finally(() => setLoading(false));
    }, [token, userid])
    
    const acceptRequest = (requestUserId) => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API}/odin-book/users/${userid}/addfollow/?` + new URLSearchParams({
            secret_token: token,
        }), {
            method: 'PUT',
            mode: 'cors',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                toFollow: requestUserId
            })
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setUsers(data.notFollowing);
        }).catch((error) => {
            setError(error.msg)
        }).finally(() => setLoading(false));
    }

    const deleteRequest = (requestUserId) => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API}/odin-book/users/${userid}/removerequest/?` + new URLSearchParams({
            secret_token: token,
        }), {
            method: 'PUT',
            mode: 'cors',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                remove: requestUserId
            })
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data);
            setRequests(data.newRequests)
        }).catch((error) => {
            setError(error.msg)
        }).finally(() => setLoading(false));
    }
    if (error) return <div className='error'>{error}</div>
    if (loading) return <Loading />
    return (
        <div className='followRequests'>
            <div className='requestsHeading'>Follow requests</div>
            {requests.map((user) => {
                return (
                    <div key={user._id} className='request'>
                        <img src={user.profile_image} alt="User profile image" className='requestUserImage' />
                        <div className='requestUsername'>{user.username}</div>
                        <button type="button" id={user._id} className='requestAccept' onClick={(e) => acceptRequest(e.target.id)}>Accept</button>
                        <button type="button" id={user._id} className='requestDelete' onClick={(e) => deleteRequest(e.target.id)}>Delete</button>
                    </div>
                )
            })}
        </div>
    )
}

export default FollowRequests;