import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import '../styles/Welcome.css'
import Loading from "./Loading";
import { PropTypes } from 'prop-types'

function Welcome({userid}) {
  const fetchDone = useRef(false);
  const [userCount, setUserCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);


  useEffect(() => {
    if (fetchDone.current) return;
    fetchDone.current = false;
    const fetchData = () => {
      fetch(`${import.meta.env.VITE_API}/odin-book`)
        .then((response) => {
          return response.json()
        }).then((data) => {
          setUserCount(data.numberOfUsers);
          setPostCount(data.numberOfPosts);
          setCommentCount(data.numberOfComments);
        }).catch(error => console.log(error));
    }
    fetchData();
    fetchDone.current = true;
  }, [])

  return fetchDone.current ? (
    <div className='welcomePage'>
      <h1 className='welcomeHeading'>Welcome to Odin Book!</h1>
      <div className='counts'>
        <div className='userCount'>Number of users: {userCount}</div>
        <div className='postCount'>Number of posts: {postCount}</div>
        <div className='commentCount'>Number of comments: {commentCount}</div>
      </div>
      {!userid && (<div className='welcomeBtns'>
        <Link id='signupBtn' className="welcomeBtn" to={'/odin-book/users/signup'}>Sign up</Link>
        <Link id='loginBtn' className="welcomeBtn" to={'/odin-book/users/login'}>Log in</Link>
      </div>)}
    </div>
  ) : <Loading />
}

Welcome.propTypes = {
  userid: PropTypes.string
}

export default Welcome;