import { useState } from 'react'
import { useLocation, Link } from 'react-router-dom';
import { PropTypes } from "prop-types";
import '../styles/Nav.css';

function Nav ({ userid, username, profilePicture, token, setToken, setUserid, setProfilePicture, setUsername, requestDetails }) {
  const location = useLocation();
  const [currentRoute, setCurrentRoute] = useState(location.pathname);
  
  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setUserid(null);
    setProfilePicture(null);
    setUsername(null);
  };

  return (
    <nav>
      <ul className='mainMenu'>
        {currentRoute !== 'odin-book' && (<li>
          <Link className="link" onClick={() => setCurrentRoute('odin-book')} to="/odin-book">Home</Link>
        </li>)}
        {!userid && currentRoute !== 'odin-book/users/login' && (<li>
          <Link className="link" onClick={() => setCurrentRoute('odin-book/users/login')} to="/odin-book/users/login">Log in</Link>
        </li>)}
        {!userid && currentRoute !== 'odin-book/users/signup' && (<li>
          <Link className='link' onClick={() => setCurrentRoute('odin-book/users/signup')} to="/odin-book/users/signup">Sign up</Link>
        </li>)}
        {userid && currentRoute !== 'odin-book/users/logout' && (<li>
          <Link className='link' onClick={() => setCurrentRoute(`odin-book/users/${userid}`)} to={`odin-book/users/${userid}`}>Profile</Link>
        </li>)}
        {userid && currentRoute !== 'odin-book/users/logout' && (<li>
          <Link className='link' onClick={() => setCurrentRoute(`odin-book/users/${userid}/feed`)} to={`odin-book/users/${userid}/feed`}>Feed</Link>
        </li>)}
        {userid && currentRoute !== 'odin-book/users/:userid/addfollows' && (<li id='follow'>
          <Link className='link' onClick={() => setCurrentRoute(`odin-book/users/${userid}/addfollows`)} to={`odin-book/users/${userid}/addfollows`}>Follow</Link>
          <div className='requestNotification'>{requestDetails.length}</div>
        </li>)}
      </ul>
      <div className="lowerNav">
        {profilePicture && (<img src={profilePicture} alt="Profile Image" className="profileImage"/>)}
        {token && currentRoute !== 'odin-book/users/login' && currentRoute !== 'odin-book/users/logout' && (<p className='loggedInAs'>Logged in as {username}</p>)}
        {userid && currentRoute !== 'odin-book/users/logout' && (<Link className='logout' onClick={() => handleLogout()} to="odin-book/users/logout">Log out</Link>)}
      </div>
    </nav>
  )
}

Nav.propTypes = {
  userid: PropTypes.string,
  username: PropTypes.string,
  profilePicture: PropTypes.string,
  token: PropTypes.string,
  setToken: PropTypes.func,
  setUserid: PropTypes.func,
  setProfilePicture: PropTypes.func,
  setUsername: PropTypes.func,
  requestDetails: PropTypes.array,
}

export default Nav;