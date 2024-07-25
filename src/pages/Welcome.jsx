import { useEffect, useState } from 'react'
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import '../styles/Welcome.css';
import Loading from "./Loading";
import LoginAsGuest from "./LoginAsGuest";

const Welcome = ({ userid, setToken, setUserid, setUsername, setProfilePicture, setLocalStorageItems }) => {
  const [loading, setLoading] = useState(true);
  const [userCount, setUserCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API}/odin-book`)
      .then(response => response.json())
      .then(data => {
        setUserCount(data.numberOfUsers);
        setPostCount(data.numberOfPosts);
        setCommentCount(data.numberOfComments);
      })
      .catch(error => setError(error.msg))
      .finally(() => setLoading(false));
  }, [])

  if (error) return <div className='error'>A network error was encountered. {error}</div>
  if (loading) return <Loading/>
  return (
    <div className='welcomePage'>
      <h1 className='welcomeHeading'>Welcome to Odin Book!</h1>
      <div className='counts'>
        <div className='userCount'>Number of users: {userCount}</div>
        <div className='postCount'>Number of posts: {postCount}</div>
        <div className='commentCount'>Number of comments: {commentCount}</div>
      </div>
      {!userid && (<div className='welcomeBtns'>
        <div>
          <Link id='signupBtn' className="welcomeBtn link" to={'/odin-book/users/signup'}>Sign up</Link>
          <Link id='loginBtn' className="welcomeBtn link" to={'/odin-book/users/login'}>Log in</Link>
        </div>
        <LoginAsGuest setToken={setToken} setUserid={setUserid} setUsername={setUsername} setProfilePicture={setProfilePicture} setLocalStorageItems={setLocalStorageItems} />
      </div>)}
    </div>
  )
}

Welcome.propTypes = {
  userid: PropTypes.string,
  setToken: PropTypes.func, 
  setUserid: PropTypes.func, 
  setUsername: PropTypes.func,
  setProfilePicture: PropTypes.func,
  setLocalStorageItems: PropTypes.func,
}

export default Welcome;