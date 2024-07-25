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

const LOCAL_STORAGE_KEYS = ['username', 'profilePicture', 'token', 'userid'];

const getLocalStorageItem = (itemName) => {
  const item = localStorage.getItem(itemName);
  return item === 'null' ? null : item;
};

const setLocalStorageItems = (items) => {
  items.forEach(([key, value]) => localStorage.setItem(key, value));
};

const clearLocalStorage = () => {
  LOCAL_STORAGE_KEYS.forEach(key => localStorage.removeItem(key));
};

const  App = () => {
  const [username, setUsername] = useState(getLocalStorageItem('username'))
  const [profilePicture, setProfilePicture] = useState(getLocalStorageItem('profilePicture'));
  const [token, setToken] = useState(getLocalStorageItem('token'));
  const [userid, setUserid] = useState(getLocalStorageItem('userid'));
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestDetails, setRequestDetails] = useState([]);
  const [deleted, setDeleted] = useState('');
  const [accepted, setAccepted] = useState('');
  const [data, setData] = useState('');

  useEffect(() => {
    setLocalStorageItems([
      ['token', token],
      ['userid', userid],
      ['username', username],
      ['profilePicture', profilePicture]
    ])
  }, [token, userid, profilePicture, username]);

  const handleOnUserIdle = () => {
    if (localStorage.getItem('token')) {
      clearLocalStorage();
      setUsername(null);
      setUserid(null);
      setToken(null);
      setProfilePicture(null);
      window.location.reload();
    }
  }

  useIdleTimer({
    timeout: 30 * 60 * 1000, // 30 mins in ms
    onIdle: handleOnUserIdle,
    debounce: 500, // in ms
  });

  useEffect(() => {
    if (userid) {
      setRequestsLoading(true);
      fetch(`${import.meta.env.VITE_API}/odin-book/users/${userid}/?${new URLSearchParams({ secret_token: token})}`, {
          mode: 'cors',
          headers: {
              'Authorization': `Bearer ${token}`,
          },
      })
        .then(response => response.json())
        .then(data => setRequestDetails(data.user.requests))
        .catch(error => setError(error.message || 'An error occurred'))
        .finally(() => setRequestsLoading(false));
    }
  }, [token, userid, deleted, accepted])

  const sendFriendRequest = (newUserId) => {
    fetch(`${import.meta.env.VITE_API}/odin-book/users/${userid}/friendrequest/?${new URLSearchParams({ secret_token: token })}`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ toFriend: newUserId })
    })
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => setError(error.message || 'An error occurred'))
  }

  return (
    <Router>
      <Nav userid={userid} username={username} profilePicture={profilePicture} token={token} setToken={setToken} setUserid={setUserid} setProfilePicture={setProfilePicture} setUsername={setUsername} requestDetails={requestDetails} clearLocalStorage={clearLocalStorage} />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Welcome userid={userid} />} />
        <Route path="/odin-book" element={<Welcome userid={userid} setToken={setToken} setUserid={setUserid} setUsername={setUsername} setProfilePicture={setProfilePicture} setLocalStorageItems={setLocalStorageItems} />} />
        <Route path="/odin-book/users/:userid/addfriends" element={<UsersList token={token} userid={userid} sendFriendRequest={sendFriendRequest} users={users} setUsers={setUsers} error={error} setError={setError} requestsLoading={requestsLoading} requestDetails={requestDetails} setDeleted={setDeleted} setAccepted={setAccepted} data={data} />}/>
        <Route path="/odin-book/users/login" element={<Login setToken={setToken} setUserid={setUserid} setUsername={setUsername} setProfilePicture={setProfilePicture} setLocalStorageItems={setLocalStorageItems} />} />
        <Route path="/odin-book/users/signup" element={<Signup />} />
        <Route path="/odin-book/users/logout" element={<Logout clearLocalStorage={clearLocalStorage} />} />
        <Route path="/odin-book/users/:userid" element={<PersonalProfile token={token} userid={userid} />} />
        <Route path="/odin-book/users/:userid/updateprofile" element={<UpdateProfile token={token} userid={userid} setUsername={setUsername} setProfilePicture={setProfilePicture} setLocalStorageItems={setLocalStorageItems} />} />
        <Route path="/odin-book/users/:userid/deleteaccount" element={<DeleteAccount token={token} userid={userid} setUsername={setUsername} setToken={setToken} setProfilePicture={setProfilePicture} setUserid={setUserid} clearLocalStorage={clearLocalStorage} />} />
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
