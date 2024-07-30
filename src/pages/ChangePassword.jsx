import { useState } from 'react';
import { Link } from "react-router-dom";
import '../styles/ChangePassword.css';
import PropTypes from 'prop-types';
import Loading from './Loading';
import LoggedOut from './LoggedOut';

const ChangePassword = ({ token, userid }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [responseStatus, setResponseStatus] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleChangePassword = () => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API}/odin-book/users/${userid}/changePassword?${new URLSearchParams({ secret_token: token })}`, {
            method: 'PUT',
            mode: 'cors',
            credentials : "include",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setResponseStatus(data.message))
            .catch(error => setError(error.message || 'An error occurred'))
            .finally(() => {
                setLoading(false);
                setFormSubmitted(true);
            })
    }

    if (loading) return <Loading/>
    if (!token) return <LoggedOut/>
    if (error) return <div className='error'>A network error was encountered. {error}</div>
    return !formSubmitted ? (
        <div className='changePassword'>
            <h1 className="changePasswordHeading">Change password</h1>
            <div className="changePasswordInputs">
                <label htmlFor='currentPassword' className='changePasswordLabel'>Current password</label>
                <input
                    id='currentPassword'
                    autoComplete='current-password'
                    name='currentPassword'
                    className='changePasswordInput'
                    type='password'
                    placeholder='Enter current password'
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                />
                <label htmlFor='newPassword' className='changePasswordLabel'>New Password</label>
                <div className='changePasswordText'>Must exceed 8 characters, 1 uppercase, 1 lowercase and 1 number</div>
                <input
                    id='newPassword'
                    autoComplete='new-password'
                    name='password'
                    className='changePasswordInput'
                    type='password'
                    placeholder='Enter new password'
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                />
                <label htmlFor='confirmPassword' className='changePasswordLabel'>Confirm new password</label>
                <input
                    id='confirmPassword'
                    autoComplete='new-password'
                    name='password_confirm'
                    className='changePasswordInput'
                    type='password'
                    placeholder='Re-enter new password'
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                />
                <button
                    type="button"
                    className="changePasswordBtn"
                    onClick={handleChangePassword}>Change Password
                </button>
            </div>
        </div>
    ) : (
        <div className='passwordChanged'>
            <div className='passwordChangedHeading'>{responseStatus}</div>
                <Link id="backToProfile" className="backToProfile link" to={`/odin-book/users/${userid}`}>Back to profile</Link>
        </div>
    )
}

ChangePassword.propTypes = {
    token: PropTypes.string,
    userid: PropTypes.string,
}

export default ChangePassword;