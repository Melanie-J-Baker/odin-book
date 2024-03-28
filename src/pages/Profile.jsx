import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate} from 'react-router-dom';
import '../styles/Profile.css'
import Loading from "./Loading";
import { PropTypes } from 'prop-types';

function Profile({ token, userid, username, profilePicture }) {
  const fetchDone = useRef(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [following, setFollowing] = useState([]);
  const [posts, setPosts] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
    if (fetchDone.current) return;
    fetchDone.current = false;
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
      <h1 className='profileHeading'>{username}&#39;s Profile</h1>
      {profilePicture && (<img className='profileDetail' id="profileImage" src={profilePicture} alt="Profile picture" />)}
      <div className='profileDetails'>
        <p className='profileSubheading'>First name:</p>
        <p className='profileDetail'>{firstName}</p>
        <p className='profileSubheading'>Last name:</p>
        <p className='profileDetail'>{lastName}</p>
        <p className='profileSubheading'>Email:</p>
        <p className='profileDetail'>{email}</p>
        <p className='profileSubheading'>Following:</p>
        {following.length ? (<p className='profileDetail'>{following}</p>) : ( <Link className='profileLink' id='addFriends' to={`/odin-book/users/${userid}/userslist`}>Add new friends</Link>)}
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
      {posts.length && (
        <div className='posts'>
          {posts.map((post) => {
            return (
              <div key={post._id} className="post" id={post._id}>
                <div className="postText">{post.text}</div>
                <div className="postTimestamp">{post.timestamp_formatted}</div>
                <img src={post.post_image} alt="Post Image" className='postImage' />
                <div className="postLikes"></div>
                <Link className='postLink' id='goToPost' to={`/odin-book/users/${userid}/posts/${post._id}`}>See post</Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  ) : <Loading />
}

Profile.propTypes = {
  token: PropTypes.string,
  userid: PropTypes.string,
  username: PropTypes.string,
  profilePicture: PropTypes.string
}

export default Profile;