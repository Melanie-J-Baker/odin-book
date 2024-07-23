import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import Loading from './Loading';
import '../styles/DeleteAccount.css';

function DeleteAccount({ token, userid, setUsername, setToken, setProfilePicture, setUserid }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [data, setData] = useState('');
    const [formSubmit, setFormSubmit] = useState(false);

    const handleDeleteAccount = () => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API}/odin-book/users/${userid}/?` + new URLSearchParams({
            secret_token: token,
        }), {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setData(data.message);
            setTimeout(() => {
                navigate('/odin-book');
            }, 5000)
            if (data.user) {
                localStorage.clear()
                setUsername('')
                setToken('')
                setProfilePicture('')
                setUserid('')
            }
        }).catch(error => {
            setError(error.msg)
        }).finally(() => {
            setLoading(false)
            setFormSubmit(true);
        });
    }

    if (error) return <p className='error'>A network error was encountered. {error}</p>
    if (loading) return <Loading />
    if (data) return <div>{data}</div>
    return !formSubmit ? (
        <div className='deleteAccount'>
            <div className='deleteAccountText'>Are you sure you want to delete this account?</div>
            <div className='deleteAccountBtns'>
                <div className='confirmBtn' onClick={() => handleDeleteAccount()}>Confirm</div>
                <div className='cancelBtn' onClick={() => navigate(-1)}>Cancel</div>
            </div>
        </div>
    ) : (
        <div className='deleteAccount'>
            <div className='accountDeleted'>Account deleted{data}</div>
            <Link className="goHome link" to={'/odin-book'}>Home</Link>
        </div>
    )
}

DeleteAccount.propTypes = {
    token: PropTypes.string,
    userid: PropTypes.string,
    setUsername: PropTypes.func,
    setToken: PropTypes.func,
    setProfilePicture: PropTypes.func,
    setUserid: PropTypes.func 
}

export default DeleteAccount;