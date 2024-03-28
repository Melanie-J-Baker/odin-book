import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Logout from './pages/Logout';
import Nav from './components/Nav';
import Feed from './pages/Feed';
import UsersList from './pages/UsersList';
import './styles/App.css'

function App() {
  const [username, setUsername] = useState(
    localStorage.getItem('username') === 'null'
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
  useEffect(() => {
    localStorage.setItem('token', token);
    localStorage.setItem('userid', userid);
    localStorage.setItem('username', username)
    localStorage.setItem('profilePicture', profilePicture);
  }, [token, userid, profilePicture, username]);
  return (
    <Router>
      <Nav userid={userid} username={username} token={token} setToken={setToken} setUserid={setUserid} setProfilePicture={setProfilePicture} setUsername={setUsername} />
      <Routes>
        <Route path="/" element={<Welcome userid={userid} />} />
        <Route path="/odin-book" element={<Welcome userid={userid} />} />
        <Route path="/odin-book/users" element={<UsersList />}/>
        <Route path="/odin-book/users/login" element={<Login /> } />
        <Route path="/odin-book/users/signup" element={<Signup />} />
        <Route path="/odin-book/users/logout" element={<Logout/>} />
        <Route path="/odin-book/users/:userid" element={<Profile token={token} userid={userid} username={username} profilePicture={profilePicture} />} />
        <Route path="/odin-book/users/:userid/feed" element={<Feed />} />
      </Routes>
    </Router>
  )
}

export default App
