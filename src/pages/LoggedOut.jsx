import { Link } from 'react-router-dom';
import '../styles/LoggedOut.css';

const LoggedOut = () => (
    <div className='loggedOut'>
        <h1>You have been logged out</h1>
        <Link to="/">Go to home page</Link>
    </div>
);

export default LoggedOut;