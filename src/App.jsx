import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useIdleTimer } from "react-idle-timer";
import Welcome from './pages/Welcome';
import ErrorPage from './pages/ErrorPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PersonalProfile from './pages/PersonalProfile';
import UpdateProfile from './pages/UpdateProfile';
import DeleteAccount from './pages/DeleteAccount';
import ChangePassword from './pages/ChangePassword';
import Logout from './pages/Logout';
import Nav from './components/Nav';
import Feed from './pages/Feed';
import UsersList from './pages/UsersList';
import Profile from './pages/Profile';
import UpdatePost from './pages/UpdatePost';
import UpdateComment from './pages/UpdateComment';
import ScrollToTop from "./components/ScrollToTop";
import './styles/App.css';

function App() {
  const checkLocalStorage = (itemName) => {
    if (localStorage.getItem(itemName) === 'null') {
      return null;
    } else {
      localStorage.getItem(itemName);
    }
  }

  const [username, setUsername] = useState(checkLocalStorage('username'))
  const [profilePicture, setProfilePicture] = useState(checkLocalStorage('profilePicture'));
  const [token, setToken] = useState(checkLocalStorage('token'));
  const [userid, setUserid] = useState(checkLocalStorage('userid'));
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestDetails, setRequestDetails] = useState([]);
  const [deleted, setDeleted] = useState('');
  const [accepted, setAccepted] = useState('');
  const [data, setData] = useState('');

  const handleOnUserIdle = () => {
    if (localStorage.getItem('token')) {
      localStorage.clear();
      setUsername(null);
      setUserid(null);
      setToken(null);
      setProfilePicture(null);
      localStorage.getItem('token') === null && window.location.reload();
    }
  }

  const IDLE_TIME = 30 * 60 * 1000; // 30 mins in ms
  const GENERAL_DEBOUNCE_TIME = 500; // in ms
  useIdleTimer({
    timeout: IDLE_TIME,
    onIdle: handleOnUserIdle,
    debounce: GENERAL_DEBOUNCE_TIME,
  });

  useEffect(() => {
    localStorage.setItem('token', token);
    localStorage.setItem('userid', userid);
    localStorage.setItem('username', username);
    localStorage.setItem('profilePicture', profilePicture);
  }, [token, userid, profilePicture, username]);

  useEffect(() => {
    if (userid) {
      setRequestsLoading(true);
      fetch(`${import.meta.env.VITE_API}/odin-book/users/${userid}/?` + new URLSearchParams({
          secret_token: token,
      }), {
          mode: 'cors',
          headers: {
              "Authorization": `Bearer ${token}`,
          },
      }).then((response) => {
          return response.json();
      }).then((data) => {
          setRequestDetails(data.user.requests);
      }).catch((error) => {
          setError(error.msg);
      }).finally(() => setRequestsLoading(false));
    }
  }, [token, userid, deleted, accepted])

  const sendFriendRequest = (newUserId) => {
    fetch(`${import.meta.env.VITE_API}/odin-book/users/${userid}/friendrequest/?` + new URLSearchParams({
        secret_token: token,
    }), {
        method: 'PUT',
        mode: 'cors',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            toFriend: newUserId
        })
    }).then((response) => {
        return response.json();
    }).then((data) => {
      setData(data)
    }).catch((error) => {
      setError(error.msg)
    })
  }

  return (
    <Router>
      <Nav userid={userid} username={username} profilePicture={profilePicture} token={token} setToken={setToken} setUserid={setUserid} setProfilePicture={setProfilePicture} setUsername={setUsername} requestDetails={requestDetails} />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Welcome userid={userid} />} />
        <Route path="/odin-book" element={<Welcome userid={userid} setToken={setToken} setUserid={setUserid} setUsername={setUsername} setProfilePicture={setProfilePicture}/>} />
        <Route path="/odin-book/users/:userid/addfriends" element={<UsersList token={token} userid={userid} sendFriendRequest={sendFriendRequest} users={users} setUsers={setUsers} error={error} setError={setError} requestsLoading={requestsLoading} requestDetails={requestDetails} setDeleted={setDeleted} setAccepted={setAccepted} data={data} />}/>
        <Route path="/odin-book/users/login" element={<Login setToken={setToken} setUserid={setUserid} setUsername={setUsername} setProfilePicture={setProfilePicture} />} />
        <Route path="/odin-book/users/signup" element={<Signup />} />
        <Route path="/odin-book/users/logout" element={<Logout/>} />
        <Route path="/odin-book/users/:userid" element={<PersonalProfile token={token} userid={userid} />} />
        <Route path="/odin-book/users/:userid/updateprofile" element={<UpdateProfile token={token} userid={userid} setUsername={setUsername} setProfilePicture={setProfilePicture} />} />
        <Route path="/odin-book/users/:userid/deleteaccount" element={<DeleteAccount token={token} userid={userid} setUsername={setUsername} setToken={setToken} setProfilePicture={setProfilePicture} setUserid={setUserid}/>} />
        <Route path="/odin-book/users/:userid/changepassword" element={<ChangePassword token={token} userid={userid} />} />
        <Route path="/odin-book/users/:userid/profile" element={<Profile token={token} currentuserid={userid} sendFriendRequest={sendFriendRequest} setUsers={setUsers} requestDetails={requestDetails}/>} />
        <Route path="/odin-book/users/:userid/feed" element={<Feed token={token} userid={userid} />} />
        <Route path="/odin-book/posts/:postid/update" element={<UpdatePost token={token} userid={userid} />} />
        <Route path="/odin-book/comments/:commentid/update" element={<UpdateComment token={token} userid={userid} />} />
        <Route path="*" element={<ErrorPage/>} />
      </Routes>
    </Router>
  )
}

export default App
