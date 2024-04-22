import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import Loading from './Loading';
import '../styles/Login.css';

Login.propTypes = {
    setToken: PropTypes.func,
    setUserid: PropTypes.func,
    setUsername: PropTypes.func,
    setProfilePicture: PropTypes.func,
}

function Login({setToken, setUserid, setUsername, setProfilePicture}) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [usernameInput, setUsernameInput] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const submitLogin = () => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API}/odin-book/users/login`, {
            method: 'POST',
            mode: 'cors',
            credentials : "include",
            headers: {
                "Accept": "application/x-www-form-urlencoded; charset=UTF-8",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            },
            body: new URLSearchParams({
                username: usernameInput.toString(),
                password: password.toString(),
            }),
        }).then((response) => {
            return response.json();
        }).then((data) => {
            if (data.user && data.token) {
                setErrorMessage("");
                localStorage.setItem("token", data.token);
                localStorage.setItem("userid", data.user._id);
                localStorage.setItem("username", data.user.username);
                localStorage.setItem("profilePicture", data.user.profile_image);
                setToken(data.token);
                setUserid(data.user._id);
                setUsername(data.user.username);
                setProfilePicture(data.user.profile_image);
                setTimeout(() => {
                    navigate(`/odin-book/users/${data.user._id}/feed`)
                }, 2000)
            } else {
                setErrorMessage("Problem logging in. Please try again.") 
            }
        }).catch(error => {
            setErrorMessage(error)
        }).finally(() => {
            setLoading(false);
        })
    };

    if (errorMessage) return (
        <div className="error">
            <div className="errorText">{errorMessage}</div>
            <Link id="backToHome" className="backToHome link" to={'/odin-book'}>Go back</Link>
        </div>
    )
    if (loading) return <Loading/>
    return (
        <div className="login">
            <h1 className="loginHeading">Log in</h1>
            <input autoComplete="username" id="loginUsername" name="username" className="loginInput" type="text" placeholder="Enter your username" value={usernameInput} onChange={(event) => setUsernameInput(event.target.value)} />
            <input autoComplete="current-password" id="loginPassword" name="password" className="loginInput" type="password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} />
            <button className="loginBtn" onClick={submitLogin}>Log in</button>
            <p className="errorMessage">{errorMessage}</p>
            <Link id="cancelSignup" className="cancelSignup link" to={'/odin-book'}>Cancel</Link>
        </div>
    )
}

export default Login;