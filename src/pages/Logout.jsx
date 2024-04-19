import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Loading from './Loading';
import '../styles/Logout.css';

function Logout() {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API}/odin-book/users/logout`, { mode: 'cors', method: 'POST', credentials: "include" })
            .then((response) => {
                return response.json();
            }).then((data) => {
                console.log(data);
                localStorage.clear();
            }).catch(error => {
                setError(error)
            }).finally(() => setLoading(false));
    }, [])
    
    if (error) return <p>A network error was encountered (error)</p>
    if (loading) return <Loading/>
    return (
        <div className="loggedOut" >
            <div className="loggedOutText">You have logged out!</div>
            <Link className="homeLink link" to="/odin-book">Home</Link>
        </div >
    )
}

export default Logout;