import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../styles/UpdateProfile.css';
import PropTypes from 'prop-types';
import Loading from "./Loading";

function UpdateProfile({ token, userid, setUsername, setProfilePicture }) {
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
    const [file, setFile] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API}/odin-book/users/${userid}/?` + new URLSearchParams({
            secret_token: token,
        }), {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setUsernameInput(data.user.username);
            setFirstName(data.user.first_name);
            setLastName(data.user.last_name);
            setEmail(data.user.email);
            setProfileImage(data.user.profile_image);
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
            credentials : 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
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
            setStatus(data.status);
            localStorage.setItem('username', data.user.username);
            setUsername(data.user.username);
            if (file == '') {
                navigate(`/odin-book/users/${data.user._id}/`)
            }
        }).catch(error => {
            setErrorMessage(error.msg);
        }).finally(() => {
            setLoading(false);
            setFormSubmit(true);
        })
        if (file !== '') {
            setFormSubmit(false);
            const formData = new FormData();
            formData.append('profileImage', file);
            setLoading(true);
            fetch(`${import.meta.env.VITE_API}/odin-book/users/${userid}/newprofileimage/?` + new URLSearchParams({
                secret_token: token,
            }), {
                method: 'PUT',
                mode: 'cors',
                credentials : 'include',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            }).then((response) => {
                return response.json();
            }).then((data) => {
                setErrorMessage(data.message);
                setStatus(data.message);
                localStorage.setItem('profilePicture', data.user.profile_image)
                setProfilePicture(data.user.profile_image);
            }).catch(error => {
                setErrorMessage(error.message)
            }).finally(() => {
                setLoading(false);
                setFormSubmit(true);
            })
        }
    };

    const handleSelectFile = (e) => {
        setFile(e.target.files[0])
    }

    if (error) return <div className="error">A netork error was encountered. {error}</div>
    if (loading) return <Loading/>
    return !formSubmit ? (
        <div className="updateProfile">
            <h2 className="updateProfileHeading">Update your details</h2>
            <form encType="multipart/form-data" className="updateProfileInputs">
                {profileImage && (<img src={profileImage} alt="Current profile image" className="currentProfileImage" />)}
                <label htmlFor="updateProfileUsername" className="updateProfileLabel">Username</label>
                <input id="updateProfileUsername" autoComplete="username" name="username" className="updateProfileInput" type="text" placeholder="Enter new username" defaultValue={usernameInput} onChange={(event) => setUsernameInput(event.target.value)} />
                <label htmlFor="updateProfileFirstName" className="updateProfileLabel">First name</label>
                <input id="updateProfileFirstName" autoComplete="name" name="first_name" className="updateProfileInput" type="text" placeholder="Enter new first name" defaultValue={firstName} onChange={(event) => setFirstName(event.target.value)} />
                <label htmlFor="updateProfileLastName" className="updateProfileLabel">Last name</label>
                <input id="updateProfileLastName" autoComplete="name" name="last_name" className="updateProfileInput" type="text" placeholder="Enter new last name" defaultValue={lastName} onChange={(event) => setLastName(event.target.value)} />
                <label htmlFor="updateProfileEmail" className="updateProfileLabel">Email</label>
                <input id="updateProfileEmail" autoComplete="email" name="email" className="updateProfileInput" type="email" placeholder="Enter new email address" defaultValue={email} onChange={(event) => setEmail(event.target.value)} />
                <div className="fileInputDiv">
                    <label htmlFor="profileImage" className="fileInputLabel">Profile image: </label>
                    <input type="file" id="profileImage" name="profileImage" onChange={handleSelectFile} multiple={false}></input>
                </div>
                <button type="button" className="updateProfileBtn" onClick={submitUpdateProfile}>Update Profile</button>
                <Link id="changePassword" className="changePasswordBtn link" to={`/odin-book/users/${userid}/changepassword`}>Change Password</Link>
                <Link id="cancelUpdateProfile" className="cancelUpdateProfile link" to={`/odin-book/users/${userid}`}>Cancel</Link>
            </form>
            <div className="errorMsg">{errorMessage}</div>
        </div>        
    ) : formSubmit && !errorMessage && !error ? (
        <div className="accountUpdated">
                <div className="accountUpdatedHeading">{status}</div>
            <Link id="backToProfile" className="backToProfile link" to={`/odin-book/users/${userid}`}>Back to profile</Link>
        </div >
    ) : (
        <> 
            <div className="errorMessage">An error has occurred! {errorMessage} {error}</div>
            <Link id="backToProfile" className="backToProfile link" to={`/odin-book/users/${userid}`}>Back to profile</Link>
        </>
    )
}

UpdateProfile.propTypes = {
    token: PropTypes.string,
    userid: PropTypes.string,
    setUsername: PropTypes.func,
    setProfilePicture: PropTypes.func,
}

export default UpdateProfile;