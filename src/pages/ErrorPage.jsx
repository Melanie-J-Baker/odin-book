import { Link } from 'react-router-dom';
import '../styles/ErrorPage.css';

const ErrorPage = () => (
    <div className='errorPage'>
        <h1>Oh no, this route does not exist!</h1>
        <Link to='/'>Go back to home page by clicking here!</Link>
    </div>
);
export default ErrorPage;