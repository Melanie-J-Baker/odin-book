import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import Loading from './Loading';
import '../styles/Login.css';
import LoginAsGuest from "./LoginAsGuest";

const Login = ({setToken, setUserid, setUsername, setProfilePicture, setLocalStorageItems}) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [usernameInput, setUsernameInput] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);

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
                username: usernameInput,
                password
            }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Problem loggin in. Please try again.");
                }
                return response.json();
            })
            .then(data => {
                if (data.user && data.token) {
                    setErrorMessage("");
                    setLocalStorageItems([
                        ['token', data.token],
                        ['userid', data.user.userid],
                        ['username', data.user.username],
                        ['profilePicture', data.user.profile_image]
                    ])
                    setToken(data.token);
                    setUserid(data.user._id);
                    setUsername(data.user.username);
                    setProfilePicture(data.user.profile_image);
                    navigate(`/odin-book/users/${data.user._id}/feed`);
                } else {
                    setErrorMessage("Problem logging in. Please try again.") 
                }
            })
            .catch(error => setErrorMessage(error.message || 'An error occurred'))
            .finally(() => {
                setLoading(false);
                setFormSubmitted(true);
            })
    };

    if (loading) return <Loading/>
    
    return errorMessage ? (
        <div className="error">
            <div className="errorText">{errorMessage}</div>
            <Link id="backToHome" className="backToHome link" to='/odin-book'>Go back</Link>
        </div>
    ) : formSubmitted ? (
        <div className="loggingIn">
            <div className="loggingInText">Attempting login...</div>
        </div>
    ) : (
        <div className="login">
            <h1 className="loginHeading">Log in</h1>
                    <input
                        autoComplete="username"
                        id="loginUsername"
                        name="username"
                        className="loginInput"
                        type="text"
                        placeholder="Enter your username"
                        value={usernameInput}
                        onChange={(event) => setUsernameInput(event.target.value)}
                    />
                    <input
                        autoComplete="current-password"
                        id="loginPassword"
                        name="password"
                        className="loginInput"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
            <button className="loginBtn" onClick={submitLogin}>Log in</button>
                    <LoginAsGuest
                        setToken={setToken}
                        setUserid={setUserid}
                        setUsername={setUsername}
                        setProfilePicture={setProfilePicture}
                        setLocalStorageItems={setLocalStorageItems}
                    />
            <Link id="cancelSignup" className="cancelSignup link" to='/odin-book'>Cancel</Link>
        </div>
    )
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired,
    setUserid: PropTypes.func.isRequired,
    setUsername: PropTypes.func.isRequired,
    setProfilePicture: PropTypes.func.isRequired,
    setLocalStorageItems: PropTypes.func.isRequired,
}

export default Login;