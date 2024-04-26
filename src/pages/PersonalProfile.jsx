import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loading from "./Loading";
import { PropTypes } from 'prop-types';
import Post from '../components/Post';
import AddPost from '../components/AddPost';
import '../styles/PersonalProfile.css';

PersonalProfile.propTypes = {
    token: PropTypes.string,
    userid: PropTypes.string,
}

function PersonalProfile({ token, userid}) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [following, setFollowing] = useState([]);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [postLiked, setPostLiked] = useState(false);
    const [postDeleted, setPostDeleted] = useState(false);
    const [postAdded, setPostAdded] = useState(false);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API}/odin-book/users/${userid}/?` + new URLSearchParams({
            secret_token: token,
        }), {
            headers: {
              Authorization: `Bearer ${token}`,
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setUsername(data.user.username)
            setFirstName(data.user.first_name);
            setLastName(data.user.last_name);
            setEmail(data.user.email);
            setFollowing(data.user.following);
            setPosts(data.posts)
            setProfilePicture(data.user.profile_image);
        }).catch(error => {
            setError(error.msg)
        }).finally(() => setLoading(false));
    },[token, userid, postLiked, postDeleted, postAdded])

    if (error) return <p className='error'>A network error was encountered. {error}</p>
    if (loading) return <Loading/>
    return userid ? (
        <div className='profilePage'>
            <h1 className='profileHeading'>{username}</h1>
            {profilePicture && (<img className='profileImageLarge' src={profilePicture} alt="Profile picture" />)}
            <div className='profileDetails'>
                <p className='profileSubheading'>Name:</p>
                <p className='profileDetail'>{firstName} {lastName}</p>
                <p className='profileSubheading'>Email:</p>
                <p className='profileDetail'>{email}</p>
            </div>
            {userid && (
                <>
                    <div className='profileOptions'>
                        <Link id='updateProfile' className='profileOption link' to={`/odin-book/users/${userid}/updateprofile`}>Update Profile</Link>
                        <Link id='deleteAccount' className='profileOption link' to={`/odin-book/users/${userid}/deleteaccount`}>Delete Account</Link>
                    </div> 
                    <Link className='profileLink allConvos link' id='goToFeed' to={`/odin-book/users/${userid}/feed`}>See Feed</Link> 
                </>
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
                                    <div className='seeProfileBtn' onClick={() => navigate(`/odin-book/users/${followedUser._id}/profile`)}>See profile</div>
                                </div>
                            )   
                        })}
                    </div>
                ) : (
                    <div className='noFollows'>No friends yet!</div>
                )}
                <div className="addFollows">
                    <Link className='profileLink link' id='addFollows' to={`/odin-book/users/${userid}/addfollows`}>Follow new users</Link>
                </div>
            </div>
            <AddPost userid={userid} token={token} setPostAdded={setPostAdded}/>
            {posts.length ? (
                <div className='posts'>
                    {posts.map((post) => {
                        return (
                            <Post key={post._id} userid={userid} token={token} postid={post._id} postUserId={userid} postUsername={username} postTimestamp={post.timestamp_formatted} postText={post.text} postUserImage={profilePicture} postImage={post.post_image} postLikes={post.likes} setPostLiked={setPostLiked} setPostDeleted={setPostDeleted}/>
                        )
                    })}
                </div>
            ) : (
                <div className='noPosts'>No posts yet!</div>
            )}
        </div>
    ) : (
        <>
            <div className="noUser">Error - user not found</div>
            <div className='profileLink' onClick={() => navigate('/odin-book')}>Go to home</div>
        </>
    )
}

export default PersonalProfile;