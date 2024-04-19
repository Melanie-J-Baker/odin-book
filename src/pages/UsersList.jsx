import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../styles/UsersList.css';
import Loading from './Loading';

UsersList.propTypes = {
    token: PropTypes.string,
    userid: PropTypes.string,
    handleFollow: PropTypes.func,
    users: PropTypes.array,
    setUsers: PropTypes.func,
    error: PropTypes.string,
    setError: PropTypes.func,
}

function UsersList({ token, userid, handleFollow, users, setUsers, error, setError }) {
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
            setUsers(data.users)
        }).catch(error => {
            setError(error)
        }).finally(() => setLoading(false));
    }, [setError, setUsers, token, userid])

    if (error) return <p>A network error was encountered (error)</p>
    if (loading) return <Loading/>
    return (
        <div className="usersList">
            <div className="usersListHeading">Follow new users</div>
            {users.length ? users.map((user) => {
                return (
                    <div key={user._id} className='user'>
                        <img src={user.profile_image} alt="User profile image" className='userImage'/>
                        <div className='username'>{user.username}</div>
                        <Link id='seeProfileBtn' to={`/odin-book/users/${user._id}/userprofile`}>See profile</Link>
                        <div id={user._id} className='addFollowBtn' onClick={(event) => handleFollow(event.target.id)}>Follow</div>
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