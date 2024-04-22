import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import '../styles/LikeUsers.css';

LikeUsers.propTypes = {
    component: PropTypes.string,
    id: PropTypes.string,
    token: PropTypes.string,
}
function LikeUsers({ component, id, token }) {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

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
            })
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
            })
        }
    }, [component, id, token])

    if (error) return <div className='error'>{error}</div>
    return (
        <div className='likeUsers'>
            {users.length && users.map((user) => {
                return (
                    <div key={user._id} className='likeUser'>
                        <img src={user.profile_image} alt="User profile image" className='likeUserImage' />
                        <div className='likeUsername'>{user.username}</div>
                    </div>
                )
            })}
        </div>
    )
}

export default LikeUsers;