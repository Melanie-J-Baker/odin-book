import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../styles/UpdateProfile.css';
import PropTypes from 'prop-types';
import Loading from "./Loading";

UpdateProfile.propTypes = {
    token: PropTypes.string,
    userid: PropTypes.string,
    setUsername: PropTypes.func,
}

function UpdateProfile({ token, userid, setUsername }) {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [usernameInput, setUsernameInput] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [formSubmit, setFormSubmit] = useState(false);
    const [loading, setLoading] = useState(true);
    const [profileImage, setProfileImage] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API}/odin-book/users/${userid}/?` + new URLSearchParams({
            secret_token: token,
        }), {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setUsernameInput(data.user.username);
            setFirstName(data.user.first_name);
            setLastName(data.user.last_name);
            setEmail(data.user.email);
        }).catch(error => {
            setError(error.msg)
        }).finally(() => setLoading(false));
    },[token, userid])
 
    const submitUpdateProfile = () => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API}/odin-book/users/${userid}/?` + new URLSearchParams({
            secret_token: token,
        }), {
            method: 'PUT',
            mode: 'cors',
            credentials : "include",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                username: usernameInput,
                first_name: firstName,
                last_name: lastName,
                email: email
            })
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data);
            setStatus(data.status);
            localStorage.setItem("username", data.user.username);
            setUsername(data.user.username);
            navigate(`/odin-book/users/${data.user._id}/`)
        }).catch(error => {
            setErrorMessage(error.msg);
        }).finally(() => {
            setLoading(false);
            setFormSubmit(true);
        })
        if (profileImage !== '') {
            setFormSubmit(false);
            const formData = new FormData();
            formData.append("profileImage", profileImage);
            setLoading(true);
            fetch(`${import.meta.env.VITE_API}/odin-book/users/${userid}/newprofileimage/?` + new URLSearchParams({
                secret_token: token,
            }), {
                method: 'PUT',
                mode: 'cors',
                credentials : "include",
                headers: {
                    'Content-Type': undefined,
                    Authorization: `Bearer ${token}`,
                },
                body: formData
            }).then((response) => {
                return response.json();
            }).then((data) => {
                console.log(data);
                setErrorMessage(data.error.msg);
                console.log(data.user.profile_image);
                //setProfileImage(data.user.profile_image);
                //localStorage.setItem('profilePicture', data.user.profile_image)
                navigate(0);
            }).catch(error => {
                setErrorMessage(error.msg)
            }).finally(() => {
                setLoading(false);
                setFormSubmit(true);
            })
        }
    };

    const handleSelectFile = (e) => {
        setProfileImage(e.target.files[0])
    }

    if (error) return <div className="error">({error})</div>
    if (loading) return <Loading/>
    return !formSubmit ? (
        <div className="updateProfile">
            <h2 className="updateProfileHeading">Update your details</h2>
            <form className="updateProfileInputs">
                <input id="updateProfileUsername" autoComplete="username" name="username" className="updateProfileInput" type="text" placeholder="Enter new username" defaultValue={usernameInput} onChange={(event) => setUsernameInput(event.target.value)} />
                <input id="updateProfileFirstName" autoComplete="name" name="first_name" className="updateProfileInput" type="text" placeholder="Enter new first name" defaultValue={firstName} onChange={(event) => setFirstName(event.target.value)} />
                <input id="updateProfileLastName" autoComplete="name" name="last_name" className="updateProfileInput" type="text" placeholder="Enter new last name" defaultValue={lastName} onChange={(event) => setLastName(event.target.value)} />
                <input id="updateProfileEmail" autoComplete="email" name="email" className="updateProfileInput" type="email" placeholder="Enter new email address" defaultValue={email} onChange={(event) => setEmail(event.target.value)} />
                <input type="file" id="profileImage" name="profileImage" onChange={handleSelectFile} multiple={false}></input>
                <button type="button" className="updateProfileBtn" onClick={submitUpdateProfile}>Update Profile</button>
                <Link id="changePassword" className="changePasswordBtn link" to={`/odin-book/users/${userid}/changepassword`}>Change Password</Link>
                <Link id="cancelUpdateProfile" className="cancelUpdateProfile link" to={`/odin-book/users/${userid}`}>Cancel</Link>
            </form>
            <div className="errorMsg">{errorMessage}</div>
        </div>        
    ) : formSubmit && !errorMessage && !error ? (
        <div className="accountUpdated">
                <div className="accountUpdatedHeading">Account updated {status}</div>
            <Link id="backToProfile" className="backToProfile link" to={`/odin-book/users/${userid}`}>Back to profile</Link>
        </div >
    ) : (
        <> 
            <div className="errorMessage">An error has occurred! {errorMessage} {error}</div>
            <Link id="backToProfile" className="backToProfile link" to={`/odin-book/users/${userid}`}>Back to profile</Link>
        </>
    )
}

export default UpdateProfile;