import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/Profile.css';
import Loading from "./Loading";
import { PropTypes } from 'prop-types';
import Post from '../components/Post';

function Profile({ token, currentuserid, sendFollowRequest, setUsers }) {
    const { userid } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [following, setFollowing] = useState([]);
    const [requests, setRequests] = useState([]);
    const [profileImage, setProfileImage] = useState(''); 
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [currentlyFollowing, setCurrentlyFollowing] = useState(false);
    const [requestSent, setRequestSent] = useState();

    useEffect(() => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API}/odin-book/users/${userid}/?` + new URLSearchParams({
            secret_token: token,
        }), {
            headers: {
                Authorization: `Bearer ${token}`,
            }   
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setUsername(data.user.username);
            setFirstName(data.user.first_name);
            setLastName(data.user.last_name);
            setEmail(data.user.email);
            setRequests(data.user.requests);
            setFollowing(data.user.following);
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
                Authorization: `Bearer ${token}`,
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            if (data.user.following.some(user => user._id === userid)) {
                setCurrentlyFollowing(true);
            } else {
                setCurrentlyFollowing(false);
            }
        }).catch(error => {
            setError(error)
        }).finally(() => setLoading(false));
    }, [token, currentuserid, userid])

    const removeFriend = (id) => {
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
                toFollow: id
            })
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setUsers(data.notFollowing);
        }).catch((error) => {
            setError(error.msg)
        }).finally(() => setLoading(false));
    }

    const handleClick = (id) => {
        sendFollowRequest(id);
        setRequestSent(true);
    }

    if (error) return <p className='error'>A network error was encountered. {error}</p>
    if (loading) return <Loading/>
    return username ? (
        <div className='profilePage'>
            <h1 className='profileHeading'>{username}</h1>
            {profileImage && (<img className='profileImageLarge' src={profileImage} alt="Profile picture" />)}
            <div className='profileDetails'>
                <p className='profileSubheading'>Name:</p>
                <p className='profileDetail'>{firstName} {lastName}</p>
                <p className='profileSubheading'>Email:</p>
                <p className='profileDetail'>{email}</p>
            </div>
            {!currentlyFollowing && !requests.includes(currentuserid) && !requestSent ? (
                <div id={userid} className='addFollowBtn' onClick={(event) => handleClick(event.target.id)}>Send Follow Request</div>
            ) : !currentlyFollowing && requests.includes(currentuserid) || requestSent ? (
                <div id={userid} className='addFollowBtn'>Request sent!</div>
            ) : (
                <div id={userid} className='addFollowBtn' onClick={(event) => removeFriend(event.target.id)}>Unfollow</div>
            )}
            <div className="followingContainer">
                <p className='followingHeading'>Following:</p>
                {following.length ? (
                    <div className='following'>
                        {following.map((followedUser) => {
                            return (
                                <div key={followedUser._id} className='followedUser' id={followedUser._id}>
                                    <img src={followedUser.profile_image} alt="followedUser" width="75px" height="75px" className="followedUserImage" />
                                    <div className='followedUsername'>{followedUser.username}</div>
                                    <div className='seeProfileBtn' onClick={() => navigate(`/odin-book/users/${followedUser._id}/userprofile`)}>See profile</div>
                                </div>
                            )
                        })}
                    </div>
                ) : (<div className='noFollows'>No follows yet!</div>)}
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
    sendFollowRequest: PropTypes.func,
    setUsers: PropTypes.func,
    requestDetails: PropTypes.array,
}

export default Profile;