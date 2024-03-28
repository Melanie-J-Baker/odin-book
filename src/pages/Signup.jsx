import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import '../styles/Signup.css';

function Signup() {
    const [usernameInput, setUsernameInput] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const fetchDone = useRef(false);
 
    const submitSignup = () => {
        if (fetchDone.current) return;
        fetchDone.current = false;
        fetch(`${import.meta.env.VITE_API}/odin-book/users/signup`, {
            method: 'POST',
            mode: 'cors',
            credentials : "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: usernameInput,
                first_name: firstName,
                last_name: lastName,
                email: email,
                password: passwordInput,
                password_confirm: confirmPassword,
                profile_image: profileImage,
            })
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data);
        }).catch(error => setErrorMessage(error));
        fetchDone.current = true;
    };

    return !fetchDone.current ? (
        <div className="signup">
            <h1 className="signupHeading">Enter your details</h1>
            <div className="signupInputs">
                <input id="signupUsername" autoComplete="username" name="username" className="signupInput" type="text" placeholder="Enter your username" value={usernameInput} onChange={(event) => setUsernameInput(event.target.value)} />
                <input id="signupFirstName" autoComplete="name" name="first_name" className="signupInput" type="text" placeholder="Enter your first name" value={firstName} onChange={(event) => setFirstName(event.target.value)} />
                <input id="signupLastName" autoComplete="name" name="last_name" className="signupInput" type="text" placeholder="Enter your last name" value={lastName} onChange={(event) => setLastName(event.target.value)} />
                <input id="email" autoComplete="email" name="email" className="signupInput" type="email" placeholder="Enter your email address" value={email} onChange={(event) => setEmail(event.target.value)} />
                <input id="signupPassword" autoComplete="new-password" name="password" className="signupInput" type="password" placeholder="Enter your password" value={passwordInput} onChange={(event) => setPasswordInput(event.target.value)} />
                <input id="signupConfirmPassword" autoComplete="new-password" name="password_confirm" className="signupInput" type="password" placeholder="Re-enter your password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
                <input id="profileImage" name="profile_image" className="signupInput" type="image" value={profileImage} onChange={(event) => setProfileImage(event.target.value)} />
                <button type="button" className="signupBtn" onClick={submitSignup}>Sign up</button>
                <Link id="cancelSignup" className="cancelSignup" to={'/odin-book'}>Cancel</Link>
            </div>
            <div className="errorMsg">{errorMessage}</div>
        </div>        
    ) : (
        <div className="accountCreated">
            <h1 className="accountCreated">Account created!</h1>
            <Link id="toLogin" className="toLogin" to={'/odin-book/users/login'}>Please log in</Link>
        </div >)
}

export default Signup;