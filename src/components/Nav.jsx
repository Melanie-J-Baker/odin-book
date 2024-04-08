import { useState } from 'react'
import { useLocation, Link } from 'react-router-dom';
import { PropTypes } from "prop-types";

function Nav ({ userid, username, token, setToken, setUserid, setProfilePicture, setUsername }) {
  const location = useLocation();
  const [currentRoute, setCurrentRoute] = useState(location.pathname);
  
  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setUserid(null);
    setProfilePicture(null);
    setUsername(null);
  };
  
  if (!token) return null;

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
        {userid && currentRoute !== 'odin-book/users/logout' && (<li>
          <Link className='link' onClick={() => handleLogout()} to="odin-book/users/logout">Log out</Link>
        </li>)}
      </ul>
      {username && currentRoute !== 'odin-book/users/login' && currentRoute !== 'odin-book/users/logout' && (<p className='loggedInAs'>Logged in as {username}</p>)}
    </nav>
  )
}

Nav.propTypes = {
  userid: PropTypes.string,
  username: PropTypes.string,
  token: PropTypes.string,
  setToken: PropTypes.func,
  setUserid: PropTypes.func,
  setProfilePicture: PropTypes.func,
  setUsername: PropTypes.func
}

export default Nav;