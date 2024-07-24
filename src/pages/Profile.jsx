import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/Profile.css';
import Loading from "./Loading";
import { PropTypes } from 'prop-types';
import Post from '../components/Post';
import LoggedOut from './LoggedOut';

function Profile({ token, currentuserid, sendFriendRequest, setUsers }) {
    const { userid } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [friends, setFriends] = useState([]);
    const [requests, setRequests] = useState([]);
    const [profileImage, setProfileImage] = useState(''); 
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [currentlyFriends, setCurrentlyFriends] = useState(false);
    const [requestSent, setRequestSent] = useState();

    useEffect(() => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API}/odin-book/users/${userid}/?` + new URLSearchParams({
            secret_token: token,
        }), {
            headers: {
                "Authorization": `Bearer ${token}`,
            }   
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setUsername(data.user.username);
            setFirstName(data.user.first_name);
            setLastName(data.user.last_name);
            setEmail(data.user.email);
            setRequests(data.user.requests);
            setFriends(data.user.friends);
            setProfileImage(data.user.profile_image);
            setPosts(data.posts)
        }).catch(error => {
            setError(error)
        }).finally(() => setLoading(false));
    }, [token, userid])

    useEffect(() => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API}/odin-book/users/${currentuserid}/?` + new URLSearchParams({
            secret_token: token,
        }), {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            if (data.user.friends.some(user => user._id === userid)) {
                setCurrentlyFriends(true);
            } else {
                setCurrentlyFriends(false);
            }
        }).catch(error => {
            setError(error)
        }).finally(() => setLoading(false));
    }, [token, currentuserid, userid])

    const removeFriend = (id) => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API}/odin-book/users/${userid}/addfriend/?` + new URLSearchParams({
            secret_token: token,
        }), {
            method: 'PUT',
            mode: 'cors',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                toFriend: id
            })
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setUsers(data.notFriends);
        }).catch((error) => {
            setError(error.msg)
        }).finally(() => setLoading(false));
    }

    const handleClick = (id) => {
        sendFriendRequest(id);
        setRequestSent(true);
    }

    if (!token) return <LoggedOut/>
    if (error) return <p className='error'>A network error was encountered. {error}</p>
    if (loading) return <Loading/>
    return username ? (
        <div className='profilePage'>
            <h1 className='profileHeading'>{username}</h1>
            {profileImage && (<img className='profileImageLarge' src={profileImage} alt="Profile picture" />)}
            <div className='profileDetails'>
                <p className='profileDetail'>Name: {firstName} {lastName}</p>
                <p className='profileDetail'>Email: {email}</p>
            </div>
            {!currentlyFriends && !requests.includes(currentuserid) && !requestSent ? (
                <div id={userid} className='addFriendBtn' onClick={(event) => handleClick(event.target.id)}>Send Friend Request</div>
            ) : !currentlyFriends && requests.includes(currentuserid) || requestSent ? (
                <div id={userid} className='addFriendBtn'>Request sent!</div>
            ) : (
                <div id={userid} className='addFriendBtn' onClick={(event) => removeFriend(event.target.id)}>Unfriend</div>
            )}
            <div className="friendsContainer">
                <p className='friendsHeading'>Friends:</p>
                {friends.length ? (
                    <div className='friends'>
                        {friends.map((friend) => {
                            return (
                                <div key={friend._id} className='friend' id={friend._id}>
                                    <img src={friend.profile_image} alt="friend" width="75px" height="75px" className="friendImage" />
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
                            <Post key={post._id} userid={userid} token={token} postid={post._id} postTimestamp={post.timestamp_formatted} postText={post.text} postUserImage={profileImage} postImage={post.post_image} postLikes={post.likes} />
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
    token: PropTypes.string,
    currentuserid: PropTypes.string,
    sendFriendRequest: PropTypes.func,
    setUsers: PropTypes.func,
    requestDetails: PropTypes.array,
}

export default Profile;