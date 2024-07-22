import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import Loading from './Loading';

function LoginAsGuest({setToken, setUserid, setUsername, setProfilePicture}) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);

    const submitLogin = () => {
        const username = "Guest";
        const password = "Password1";
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
                username: username.toString(),
                password: password.toString(),
            }),
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data);
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
            setErrorMessage(error.msg)
        }).finally(() => {
            setLoading(false);
            setFormSubmitted(true);
        })
    };

    if (errorMessage) return (
        <div className="error">
            <div className="errorText">A network error was encountered. {errorMessage}</div>
        </div>
    )
    if (loading) return <Loading/>
    return !formSubmitted ? (
        <button className="loginBtn" onClick={submitLogin}>Log in as Guest</button>
    ) : (
        <div className="loggingIn">
            <div className="loggingInText">Attempting login...</div>
        </div>
    )
}

LoginAsGuest.propTypes = {
    setToken: PropTypes.func,
    setUserid: PropTypes.func,
    setUsername: PropTypes.func,
    setProfilePicture: PropTypes.func,
}

export default LoginAsGuest;