import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/FriendRequests.css';
import Loading from '../pages/Loading';

const FriendRequests= ({ token, userid, requestsLoading, requestDetails, setDeleted, setAccepted }) => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const acceptRequest = (requestUserId) => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API}/odin-book/users/${userid}/addfriend/?${new URLSearchParams({ secret_token: token })}`, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ requestUserId })
        })
            .then(response => response.json())
            .then(data => setAccepted(data.user))
            .catch(error => setError(error.message || 'An error occurred'))
            .finally(() => setLoading(false));
    }

    const deleteRequest = (requestUserId) => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API}/odin-book/users/${userid}/removerequest/?${new URLSearchParams({ secret_token: token })}`, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ remove: requestUserId })
        })
            .then(response => response.json())
            .then(data => setDeleted(data.user))
            .catch(error => setError(error.message || 'An error occurred'))
            .finally(() => setLoading(false));
    }

    if (loading || requestsLoading) return <Loading />
    if (error) return <div className='error'>A network error was encountered. {error}</div>
    return (
        <div className='friendRequests'>
            <div className='requestsHeading'>
                {requestDetails.length ? 'Friend requests' : 'No friend requests'}
            </div>
            {requestDetails.map((user) => (
                <div key={user._id} className='request'>
                    <img
                        src={user.profile_image}
                        alt="User profile image"
                        className='requestUserImage'
                        onClick={() => navigate(`/odin-book/users/${user._id}/profile`)}
                    />
                    <div className="requestUserDetails">
                        <div
                            className='requestUsername'
                            onClick={() => navigate(`/odin-book/users/${user._id}/profile`)}
                        >
                            {user.username}
                        </div>
                        <div className="requestBtns">
                            <button
                                type="button"
                                id={user._id}
                                className='requestAccept'
                                onClick={(e) => acceptRequest(e.target.id)}
                            >
                                Accept
                            </button>
                            <button
                                type="button"
                                id={user._id}
                                className='requestDelete'
                                onClick={(e) => deleteRequest(e.target.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
                )
            )}
            
        </div>
    )
}

FriendRequests.propTypes = {
    token: PropTypes.string.isRequired,
    userid: PropTypes.string.isRequired,
    requestsLoading: PropTypes.bool,
    requestDetails: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
        profile_image: PropTypes.string,
        username: PropTypes.string.isRequired,
    })).isRequired,
    setDeleted: PropTypes.func.isRequired,
    setAccepted: PropTypes.func.isRequired,
}

export default FriendRequests;