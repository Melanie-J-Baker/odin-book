import { useEffect, useState } from 'react';
import { PropTypes } from "prop-types";
import { Link } from 'react-router-dom';
import Loading from './Loading';
import '../styles/Logout.css';

const Logout = ({clearLocalStorage}) => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API}/odin-book/users/logout`, { mode: 'cors', method: 'POST', credentials: "include" })
            .then(response => response.json())
            .then(data => {
                setMessage(data.message);
                clearLocalStorage();
            })
            .catch(error => setError(error.message || 'An error occurred'))
            .finally(() => setLoading(false));
    }, [clearLocalStorage])
    
    if (loading) return <Loading/>
    if (error) return <p className='error'>A network error was encountered. {error}</p>
    return (
        <div className="loggedOut" >
            <div className="loggedOutText">{message}</div>
            <Link className="homeLink link" to="/odin-book">Home</Link>
        </div >
    )
}

Logout.propTypes = {
  clearLocalStorage: PropTypes.func.isRequired,
}

export default Logout;