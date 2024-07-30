import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Loading from '../pages/Loading';
import '../styles/LikeUsers.css';

const LikeUsers = ({ component, id, token, showLikeUsers }) => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const endpoint = component === 'post' 
                    ? `/odin-book/posts/${id}/likes` 
                    : `/odin-book/comments/${id}/likes`;
        fetch(`${import.meta.env.VITE_API}${endpoint}?${new URLSearchParams({ secret_token: token,})}`, {
            mode: 'cors',
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setUsers(data.likes || []))
            .catch(error => setError(error.message || 'An error occurred'))
            .finally(() => setLoading(false));
    }, [component, id, token])

    if (loading) return <Loading/>
    if (error) return <div className='error'>A network error was encountered. {error}</div>
    return (
        <div className='likeUsers'>
            <div className='likeUsersTopDiv'>
                <div className='likeUsersTitle'>Users who liked this</div>
                <div className='close' onClick={showLikeUsers}>x</div>
            </div>
            {users.length > 0 ? (
                users.map(user => (
                    <div key={user._id} className='likeUser'>
                        <img src={user.profile_image} alt="User profile image" className='likeUserImage' />
                        <div className='likeUsername'>{user.username}</div>
                    </div>
                ))
            ) : (
                <div className='noLikesYet'>No likes yet!</div>
            )}
        </div>
    )
}

LikeUsers.propTypes = {
    component: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    showLikeUsers: PropTypes.func.isRequired,
}

export default LikeUsers;