import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Loading from '../pages/Loading';
import '../styles/LikeUsers.css';

LikeUsers.propTypes = {
    component: PropTypes.string,
    id: PropTypes.string,
    token: PropTypes.string,
    hideLikeUsers: PropTypes.func,
}
function LikeUsers({ component, id, token, hideLikeUsers }) {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (component == "post") {
            fetch(`${import.meta.env.VITE_API}/odin-book/posts/${id}/likes?` + new URLSearchParams({
                secret_token: token,
            }), {
                mode: 'cors',
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }).then((response) => {
                return response.json();
            }).then((data) => {
                setUsers(data.likes)
            }).catch((error) => {
                setError(error.msg);
            }).finally(() => setLoading(false));
        } else if (component == "comment") {
            fetch(`${import.meta.env.VITE_API}/odin-book/comments/${id}/likes?` + new URLSearchParams({
                secret_token: token,
            }), {
                mode: 'cors',
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }).then((response) => {
                return response.json();
            }).then((data) => {
                setUsers(data.likes)
            }).catch((error) => {
                setError(error.msg);
            }).finally(() => setLoading(false));
        }
    }, [component, id, token])

    if (error) return <div className='error'>A network error was encountered. {error}</div>
    return !loading ? (
        <div className='likeUsers'>
            <div className='close' onClick={hideLikeUsers}>x</div>
            {users.length !== 0 ? users.map((user) => {
                return (
                    <div key={user._id} className='likeUser'>
                        <img src={user.profile_image} alt="User profile image" className='likeUserImage' />
                        <div className='likeUsername'>{user.username}</div>
                    </div>
                )
            }) : (
                <div className='noLikesYet'>No likes yet!</div>
            )}
        </div>
    ) : ( <Loading/> )
}

export default LikeUsers;