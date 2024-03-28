import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Logout.css';
import Loading from './Loading';

function Logout() {
    const responseSending = useRef(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (responseSending.current) return;
        responseSending.current = true;
        const submitLogout = () => {
            fetch(`${import.meta.env.VITE_API}/odin-book/users/logout`, { mode: 'cors', method: 'POST', credentials: "include" })
                .then((response) => {
                    return response.json();
                }).then((data) => {
                    console.log(data);
                    localStorage.clear();
                }).catch(error => console.log(error));
        };
        submitLogout();
        responseSending.current = false;
        setTimeout(() => {
            navigate('/odin-book')
        }, 3000);
    })
    
    return !responseSending.current ? (
        <div className="loggedOut" >
            <div className="loggedOutText">You have logged out!</div>
            <Link className="homeLink" to="/odin-book">Home</Link>
        </div >
    )  : (<Loading /> )
}

export default Logout;