import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom';
import { PropTypes } from "prop-types";
import '../styles/Nav.css';

const Nav = ({
  userid,
  username,
  profilePicture,
  token,
  setToken,
  setUserid,
  setProfilePicture,
  setUsername,
  requestDetails,
  clearLocalStorage
}) => {
  const location = useLocation();
  const [currentRoute, setCurrentRoute] = useState(location.pathname);

  useEffect(() => {
        setCurrentRoute(location.pathname);
    }, [location.pathname]);
  
  const handleLogout = () => {
    clearLocalStorage();
    setToken(null);
    setUserid(null);
    setProfilePicture(null);
    setUsername(null);
  };

  const isActiveRoute = (path) => currentRoute === path;

  return (
    <nav>
      <ul className='mainMenu'>
        {(!userid || !isActiveRoute('odin-book')) && (
          <li>
            <Link
              className='link'
              onClick={() => setCurrentRoute('odin-book')}
              to='/odin-book'
            >
              Home
            </Link>
          </li>
        )}
        {!userid && !isActiveRoute('odin-book/users/login') && (
          <li>
            <Link
              className='link'
              onClick={() => setCurrentRoute('odin-book/users/login')}
              to='/odin-book/users/login'
            >
              Log in
            </Link>
          </li>
        )}
        {!userid && !isActiveRoute('odin-book/users/signup') && (
          <li>
            <Link
              className='link'
              onClick={() => setCurrentRoute('odin-book/users/signup')}
              to='/odin-book/users/signup'
            >
              Sign up
            </Link>
          </li>
        )}
        {userid && !isActiveRoute(`odin-book/users/$userid`) && (
          <li>
            <Link
              className='link'
              onClick={() => setCurrentRoute(`odin-book/users/${userid}`)}
              to={`odin-book/users/${userid}`}
            >
              Profile
            </Link>
          </li>
        )}
        {userid && !isActiveRoute(`/odin-book/users/${userid}/feed`) && (
          <li>
            <Link
              className='link'
              onClick={() => setCurrentRoute(`odin-book/users/${userid}/feed`)}
              to={`odin-book/users/${userid}/feed`}
            >
              Feed
            </Link>
          </li>
        )}
        {userid && !isActiveRoute(`/odin-book/users/${userid}/addfriends`) && (
          <li className="addFriendsNavDiv">
            <Link
              className='link'
              onClick={() => setCurrentRoute(`odin-book/users/${userid}/addfriends`)}
              to={`odin-book/users/${userid}/addfriends`}
            >
              Add Friends
            </Link>
            <div className='requestNotification'>{requestDetails.length}</div>
          </li>
        )}
      </ul>
      <div className="lowerNav">
        {profilePicture !== "" ? (
          <img src={profilePicture} alt="Profile Image" className="profileImage" />
        ) : (
          <img src="../assets/images/default.jpg" alt="Profile Image" className="profileImage" />
        )}
        {token && !isActiveRoute('odin-book/users/login') && !isActiveRoute('odin-book/users/logout') && (
          <p className='loggedInAs'>Logged in as {username}</p>)}
        {userid && !isActiveRoute('odin-book/users/logout') && (
          <Link
            className='logout'
            onClick={handleLogout}
            to='odin-book/users/logout'
          >
            Log out
          </Link>
        )}
      </div>
    </nav>
  )
}

Nav.propTypes = {
  userid: PropTypes.string,
  username: PropTypes.string,
  profilePicture: PropTypes.string,
  token: PropTypes.string,
  setToken: PropTypes.func.isRequired,
  setUserid: PropTypes.func.isRequired,
  setProfilePicture: PropTypes.func.isRequired,
  setUsername: PropTypes.func.isRequired,
  requestDetails: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
        profile_image: PropTypes.string,
        username: PropTypes.string.isRequired,
    })).isRequired,
  clearLocalStorage: PropTypes.func.isRequired,
}

export default Nav;