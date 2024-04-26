import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Welcome from './pages/Welcome';
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
import './styles/App.css';

function App() {
  const [username, setUsername] = useState(
    localStorage.getItem('username') === 'null' || localStorage.getItem('token') === 'null'
      ? null
      : localStorage.getItem('username')
  )
  const [profilePicture, setProfilePicture] = useState(
    localStorage.getItem('profilePicture') === 'null'
      ? null
      : localStorage.getItem('profilePicture')
  );
  const [token, setToken] = useState(
    localStorage.getItem('token') === 'null'
      ? null
      : localStorage.getItem('token')
  );
  const [userid, setUserid] = useState(
    localStorage.getItem('userid') === 'null'
      ? null
      : localStorage.getItem('userid')
  );
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestDetails, setRequestDetails] = useState([]);
  const [deleted, setDeleted] = useState('');
  const [accepted, setAccepted] = useState('');

  useEffect(() => {
    localStorage.setItem('token', token);
    localStorage.setItem('userid', userid);
    localStorage.setItem('username', username);
    localStorage.setItem('profilePicture', profilePicture);
  }, [token, userid, profilePicture, username]);

  useEffect(() => {
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
            console.log(error);
            setError(error.msg);
        }).finally(() => setRequestsLoading(false));
    }, [token, userid, deleted, accepted])

  const sendFollowRequest = (newUserId) => {
    fetch(`${import.meta.env.VITE_API}/odin-book/users/${userid}/followrequest/?` + new URLSearchParams({
        secret_token: token,
    }), {
        method: 'PUT',
        mode: 'cors',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            toFollow: newUserId
        })
    }).then((response) => {
        return response.json();
    }).then((data) => {
      console.log(data);
    }).catch((error) => {
      console.log(error);
      setError(error)
    })
  }

  return (
    <Router>
      <Nav userid={userid} username={username} profilePicture={profilePicture} token={token} setToken={setToken} setUserid={setUserid} setProfilePicture={setProfilePicture} setUsername={setUsername} requestDetails={requestDetails} />
      <Routes>
        <Route path="/" element={<Welcome userid={userid} />} />
        <Route path="/odin-book" element={<Welcome userid={userid} />} />
        <Route path="/odin-book/users/:userid/addfollows" element={<UsersList token={token} userid={userid} sendFollowRequest={sendFollowRequest} users={users} setUsers={setUsers} error={error} setError={setError} requestsLoading={requestsLoading} requestDetails={requestDetails} setDeleted={setDeleted} setAccepted={setAccepted} />}/>
        <Route path="/odin-book/users/login" element={<Login setToken={setToken} setUserid={setUserid} setUsername={setUsername} setProfilePicture={setProfilePicture} />} />
        <Route path="/odin-book/users/signup" element={<Signup />} />
        <Route path="/odin-book/users/logout" element={<Logout/>} />
        <Route path="/odin-book/users/:userid" element={<PersonalProfile token={token} userid={userid} />} />
        <Route path="/odin-book/users/:userid/updateprofile" element={<UpdateProfile token={token} userid={userid} setUsername={setUsername} setProfilePicture={setProfilePicture} />} />
        <Route path="/odin-book/users/:userid/deleteaccount" element={<DeleteAccount token={token} userid={userid} setUsername={setUsername} setToken={setToken} setProfilePicture={setProfilePicture} setUserid={setUserid}/>} />
        <Route path="/odin-book/users/:userid/changepassword" element={<ChangePassword token={token} userid={userid} />} />
        <Route path="/odin-book/users/:userid/profile" element={<Profile token={token} currentuserid={userid} sendFollowRequest={sendFollowRequest} setUsers={setUsers} />} />
        <Route path="/odin-book/users/:userid/feed" element={<Feed token={token} userid={userid} />} />
        <Route path="/odin-book/posts/:postid/update" element={<UpdatePost token={token} userid={userid} />} />
        <Route path="/odin-book/comments/:commentid/update" element={<UpdateComment token={token} userid={userid} />} />
      </Routes>
    </Router>
  )
}

export default App
