import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import Loading from './Loading';

DeleteAccount.propTypes = {
    token: PropTypes.string,
    userid: PropTypes.string
}

function DeleteAccount({ token, userid }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [data, setData] = useState('');
    
    const handleDeleteAccount = () => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API}/odin-book/users/${userid}/?` + new URLSearchParams({
            secret_token: token,
        }), {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data);
            setData(data);
            setTimeout(() => {
                navigate('/odin-book');
            }, 5000)
        }).catch(error => {
            setError(error)
        }).finally(() => setLoading(false));
    }

    if (error) return <p>A network error was encountered (error)</p>
    if (loading) return <Loading />
    if (data) return <div>{data}</div>
    return (
        <div className='deleteAccount'>
            <div className='deleteAccountText'>Are you sure you want to delete your account?</div>
            <div className='deleteAccountBtns'>
                <div className='confirmBtn' onClick={() => handleDeleteAccount()}>Confirm</div>
                <div className='cancelBtn' onClick={() => navigate(-1)}>Cancel</div>
            </div>
        </div>
    )
}

export default DeleteAccount;