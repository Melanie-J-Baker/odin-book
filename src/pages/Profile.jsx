import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import '../styles/Profile.css';
import Loading from "./Loading";
import { PropTypes } from 'prop-types';
import ProfilePost from '../components/ProfilePost';
import AddPost from '../components/AddPost';

Profile.propTypes = {
  token: PropTypes.string,
  userid: PropTypes.string,
  username: PropTypes.string,
  profilePicture: PropTypes.string,
}

function Profile({ token, userid, username, profilePicture}) {
  const fetchDone = useRef(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [following, setFollowing] = useState([]);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (fetchDone.current) return;
    const fetchData = () => {
      fetch(`${import.meta.env.VITE_API}/odin-book/users/${userid}/?` + new URLSearchParams({
        secret_token: token,
      }), {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }).then((response) => {
        return response.json();
      }).then((data) => {
        setFirstName(data.user.first_name);
        setLastName(data.user.last_name);
        setEmail(data.user.email);
        setFollowing(data.user.following);
        setPosts(data.posts)
      }).catch(error => console.log(error));
      fetchDone.current = true;
    }
    fetchData();
    
  },[token, userid])

  return fetchDone.current && userid ? (
    <div className='profilePage'>
      <h1 className='profileHeading'>{username}</h1>
      {profilePicture && (<img className='profileDetail' id='profileImage' src={profilePicture} alt="Profile picture" />)}
      <div className='profileDetails'>
        <p className='profileSubheading'>First name:</p>
        <p className='profileDetail'>{firstName}</p>
        <p className='profileSubheading'>Last name:</p>
        <p className='profileDetail'>{lastName}</p>
        <p className='profileSubheading'>Email:</p>
        <p className='profileDetail'>{email}</p>
      </div>
      <div className="followingContainer">
        <p className='followingHeading'>Following:</p>
        {following.length && (
          <div className='following'>
            {following.map((followedUser) => {
              return (
                <div key={followedUser._id} className='followedUser' id={followedUser._id}>
                    <img src={followedUser.profile_image} alt="followedUser" width="75px" height="75px" className="followedUserImage" />
                    <div className='followedUsername'>{followedUser.username}</div>
                </div>
              )
            })}
          </div>
        )}
        <Link className='profileLink' id='addFriends' to={`/odin-book/users/${userid}/userslist`}>Add new friends</Link>
      </div>
      <div className='profileLinks'>
        {userid ? (
          <>      
            <Link className='profileLink allConvos' id='goToFeed' to={`/odin-book/users/${userid}/feed`}>See Feed</Link>
            <Link className='profileLink deleteAccount' id='deleteAccount' to={`/odin-book/users/${userid}/delete`}>Delete Account</Link>
          </>
        ) : (
          <div className='profileLink' onClick={() => navigate(-1)}>Go back</div>
        )}
      </div>
      <AddPost userid={userid} token={token} />
      {posts.length && (
        <div className='posts'>
          {posts.map((post) => {
            return (
              <ProfilePost key={post._id} userid={userid} token={token} postid={post._id} postTimestamp={post.timestamp_formatted} postText={post.text} postImage={post.post_image} postLikes={post.likes} />
            )
          })}
        </div>
      )}
    </div>
  ) : <Loading />
}

export default Profile;