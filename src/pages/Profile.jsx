import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/Profile.css';
import Loading from "./Loading";
import { PropTypes } from 'prop-types';
import Post from '../components/Post';
import LoggedOut from './LoggedOut';

const Profile = ({ token, currentuserid, sendFriendRequest, setUsers }) => {
    const { userid } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [currentlyFriends, setCurrentlyFriends] = useState(false);
    const [requestSent, setRequestSent] = useState();
    const [user, setUser] = useState({});

    useEffect(() => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API}/odin-book/users/${userid}/?${new URLSearchParams({ secret_token: token })}`, {
            headers: { 'Authorization': `Bearer ${token}` }   
        })
            .then(response => response.json())
            .then(data => {
                setUser(data.user);
                setPosts(data.posts)
            })
            .catch(error => setError(error.message || 'An error occurred'))
            .finally(() => setLoading(false));
    }, [token, userid])

    useEffect(() => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API}/odin-book/users/${currentuserid}/?${new URLSearchParams({ secret_token: token })}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => response.json())
            .then(data => data.user.friends.some(user => user._id === userid) ? setCurrentlyFriends(true) : setCurrentlyFriends(false))
            .catch(error => setError(error.message || 'An error occurred'))
            .finally(() => setLoading(false));
    }, [token, currentuserid, userid])

    const removeFriend = (id) => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API}/odin-book/users/${userid}/addfriend/?${new URLSearchParams({ secret_token: token })}`, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ toFriend: id })
        })
            .then(response => response.json())
            .then(data => setUsers(data.notFriends))
            .catch((error) => setError(error.message  || 'An error occurred'))
            .finally(() => setLoading(false));
    }

    const handleClick = (id) => {
        sendFriendRequest(id);
        setRequestSent(true);
    }

    if (!token) return <LoggedOut/>
    if (loading) return <Loading/>
    if (error) return <p className='error'>A network error was encountered. {error}</p>
    return user.username ? (
        <div className='profilePage'>
            <h1 className='profileHeading'>{user.username}</h1>
            {user.profile_image && (<img className='profileImageLarge' src={user.profile_image} alt="Profile picture" />)}
            <div className='profileDetails'>
                <p className='profileDetail'>Name: {user.first_name} {user.last_name}</p>
                <p className='profileDetail'>Email: {user.email}</p>
            </div>
            {!currentlyFriends && !user.requests.includes(currentuserid) && !requestSent ? (
                <div id={userid} className='addFriendBtn' onClick={(event) => handleClick(event.target.id)}>Send Friend Request</div>
            ) : !currentlyFriends && user.requests.includes(currentuserid) || requestSent ? (
                <div id={userid} className='addFriendBtn'>Request sent!</div>
            ) : (
                <div id={userid} className='addFriendBtn' onClick={(event) => removeFriend(event.target.id)}>Unfriend</div>
            )}
            <div className="friendsContainer">
                <p className='friendsHeading'>Friends:</p>
                {user.friends.length ? (
                    <div className='friends'>
                        {user.friends.map((friend) => {
                            return (
                                <div key={friend._id} className='friend' id={friend._id}>
                                    <img
                                        src={friend.profile_image}
                                        alt="friend"
                                        width="75px"
                                        height="75px"
                                        className="friendImage"
                                    />
                                    <div className='friendUsername'>{friend.username}</div>
                                    <div className='seeProfileBtn' onClick={() => navigate(`/odin-book/users/${friend._id}/userprofile`)}>See profile</div>
                                </div>
                            )
                        })}
                    </div>
                ) : (<div className='noFriends'>No friends yet!</div>)}
            </div>
            {posts.length ? (
                <div className='posts'>
                    {posts.map((post) => {
                        return (
                            <Post
                                key={post._id}
                                userid={userid}
                                token={token}
                                postid={post._id}
                                postTimestamp={post.timestamp_formatted}
                                postText={post.text}
                                postUserImage={user.profile_image}
                                postImage={post.post_image}
                                postLikes={post.likes}
                            />
                        )
                    })}
                </div>
            ) : (<div className='noPosts'>No posts yet!</div>)}
        </div>
    ) : (
        <>
            <div className="noUser">Error! User not found</div>
            <div className='profileLink' onClick={() => navigate('/odin-book')}>Go to home</div>
        </>
    )
}

Profile.propTypes = {
    token: PropTypes.string.isRequired,
    currentuserid: PropTypes.string.isRequired,
    sendFriendRequest: PropTypes.func.isRequired,
    setUsers: PropTypes.func.isRequired,
}

export default Profile;