import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import Loading from './Loading';
import LoggedOut from './LoggedOut';
import '../styles/DeleteAccount.css';

const DeleteAccount = ({
    token,
    userid,
    setUsername,
    setToken,
    setProfilePicture,
    setUserid,
    clearLocalStorage
}) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleDeleteAccount = () => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API}/odin-book/users/${userid}/?${new URLSearchParams({ secret_token: token })}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => response.json())
            .then(data => {
                setMessage(data.message);
                if (data.user) {
                    clearLocalStorage();
                    setUsername('');
                    setToken('');
                    setProfilePicture('');
                    setUserid('');
                    setTimeout(() => navigate('/odin-book'), 5000);
                }
            })
            .catch(error => setError(error.message || 'An error occurred'))
            .finally(() => {
                setLoading(false)
                setIsSubmitted(true);
            });
    }

    if (loading) return <Loading />
    if (!token) return <LoggedOut/>
    if (error) return <p className='error'>A network error was encountered. {error}</p>
    return isSubmitted ? (
        <div className='deleteAccount'>
            <div className='accountDeleted'>Account deleted. {message}</div>
            <Link className="goHome link" to='/odin-book'>Home</Link>
        </div>
    ) : (
        <div className='deleteAccount'>
            <div className='deleteAccountText'>Are you sure you want to delete this account?</div>
            <div className='deleteAccountBtns'>
                <div className='confirmBtn' onClick={() => handleDeleteAccount()}>Confirm</div>
                <div className='cancelBtn' onClick={() => navigate(-1)}>Cancel</div>
            </div>
        </div>
    )
}

DeleteAccount.propTypes = {
    token: PropTypes.string.isRequired,
    userid: PropTypes.string.isRequired,
    setUsername: PropTypes.func.isRequired,
    setToken: PropTypes.func.isRequired,
    setProfilePicture: PropTypes.func.isRequired,
    setUserid: PropTypes.func.isRequired,
    clearLocalStorage: PropTypes.func.isRequired,
}

export default DeleteAccount;