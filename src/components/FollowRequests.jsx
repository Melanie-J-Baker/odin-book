import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/FollowRequests.css';
import Loading from '../pages/Loading';

FollowRequests.propTypes = {
    token: PropTypes.string,
    userid: PropTypes.string,
    requestsLoading: PropTypes.bool,
    requestDetails: PropTypes.array,
    setDeleted: PropTypes.func,
    setAccepted: PropTypes.func,
}

function FollowRequests({ token, userid, requestsLoading, requestDetails, setDeleted, setAccepted }) {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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
            console.log(data);
            setAccepted(data.user);
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
            setDeleted(data.user);
        }).catch((error) => {
            setError(error.msg)
        }).finally(() => setLoading(false));
    }
    if (error) return <div className='error'>A network error was encountered. {error}</div>
    if (loading || requestsLoading) return <Loading />
    return (
        <div className='followRequests'>
            <div className='requestsHeading'>Follow requests</div>
            {requestDetails.map((user) => {
                return (
                    <div key={user._id} className='request'>
                        <img src={user.profile_image} alt="User profile image" className='requestUserImage' />
                        <div className="requestUserDetails">
                            <div className='requestUsername'>{user.username}</div>
                            <Link id='seeProfileBtn' to={`/odin-book/users/${user._id}/profile`}>See profile</Link>
                            <div className="requestBtns">
                                <button type="button" id={user._id} className='requestAccept' onClick={(e) => acceptRequest(e.target.id)}>Accept</button>
                                <button type="button" id={user._id} className='requestDelete' onClick={(e) => deleteRequest(e.target.id)}>Delete</button>
                            </div>
                        </div>
                    </div>
                )
            })}
            
        </div>
    )
}

export default FollowRequests;