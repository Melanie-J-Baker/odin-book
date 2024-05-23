import { useState } from 'react';
import { Link } from "react-router-dom";
import '../styles/ChangePassword.css';
import PropTypes from 'prop-types';
import Loading from './Loading';

function ChangePassword({ token, userid }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formSubmit, setFormSubmit] = useState(false);
    const [responseStatus, setResponseStatus] = useState('');

    const handleChangePassword = () => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API}/odin-book/users/${userid}/changePassword?` + new URLSearchParams({
            secret_token: token,
        }), {
            method: 'PUT',
            mode: 'cors',
            credentials : "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                currentPassword: currentPassword,
                newPassword: newPassword,
                confirmPassword: confirmPassword
            })
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setResponseStatus(data.message);
        }).catch(error => {
            setError(error.msg)
        }).finally(() => {
            setLoading(false);
            setFormSubmit(true);
        })

    }

    if (error) return <div className='error'>A network error was encountered. {error}</div>
    if (loading) return <Loading/>
    return !formSubmit ? (
        <div className='changePassword'>
            <h1 className="changePasswordHeading">Change password</h1>
            <div className="changePasswordInputs">
                <input id="currentPassword" autoComplete='current-password' name="currentPassword" className="changePasswordInput" type="password" placeholder="Enter current password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} />
                <input id="newPassword" autoComplete="new-password" name="password" className="changePasswordInput" type="password" placeholder="Enter new password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
                <input id="confirmPassword" autoComplete="new-password" name="password_confirm" className="changePasswordInput" type="password" placeholder="Re-enter new password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
                <button type="button" className="changePasswordBtn" onClick={handleChangePassword}>Change Password</button>
            </div>
        </div>
    ) : formSubmit && !error ? (
        <div className='passwordChanged'>
            <div className='passwordChangedHeading'>{responseStatus}</div>
            <Link id="backToProfile" className="backToProfile link" to={`/odin-book/users/${userid}`}>Back to profile</Link>
        </div>
    ) : (
        <div className='error'>{error}</div>
    )
}

ChangePassword.propTypes = {
    token: PropTypes.string,
    userid: PropTypes.string,
}

export default ChangePassword;