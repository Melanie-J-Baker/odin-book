import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../styles/UpdateComment.css';
import Loading from './Loading';
import LoggedOut from './LoggedOut';

const UpdateComment = ({ token, userid }) => {
    const { commentid } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [commentImage, setCommentImage] = useState('');
    const [status, setStatus] = useState('');
    const [formSubmit, setFormSubmit] = useState(false);
    const [file, setFile] = useState('');

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API}/odin-book/comments/${commentid}/?${new URLSearchParams({ secret_token: token })}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setCommentText(data.text);
                setCommentImage(data.comment_image);
            })
            .catch(error => setError(error.message || 'An error occurred'))
            .finally(() => setLoading(false));
    }, [commentid, token])

    const updateComment = (e) => {
        e.preventDefault();
        setLoading(true);
        fetch(`${import.meta.env.VITE_API}/odin-book/comments/${commentid}/?${new URLSearchParams({ secret_token: token })}`, {
            method: 'PUT',
            mode: 'cors',
            credentials : "include",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ text: commentText })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setStatus(data.status);
                file == '' && navigate(-1);
            })
            .catch(error => {
                setError(error.message || 'An error occurred')
                setStatus(error.message || 'An error occurred')
            })
            .finally(() => {
                setLoading(false);
                setFormSubmit(true);
            })
            if (file) {
                handleFileUpload();
            }
    }

    const handleFileUpload = () => {
        setFormSubmit(false);
        const formData = new FormData();
        formData.append("commentImage", file);
        setLoading(true);
        fetch(`${import.meta.env.VITE_API}/odin-book/comments/${commentid}/uploadimage/?${new URLSearchParams({ secret_token: token })}`, {
            method: 'PUT',
            mode: 'cors',
            credentials : "include",
            headers: { 'Authorization': `Bearer ${token}`},
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setStatus(data.status || data.message);
                setError(data.error);
            })
            .catch(error => {
                setError(error.message || 'An error occurred')
                setStatus(error.message || 'An error occurred')
            })
            .finally(() => {
                setLoading(false);
                setFormSubmit(true);
            })
    }

    const handleSelectFile = (e) => setFile(e.target.files[0]);

    if (loading) return <Loading />
    if (!token) return <LoggedOut/>
    if (error) return <div className="error">A network error was encountered. {error}</div>
    return !formSubmit ? (
        <form encType="multipart/form-data" className='updateCommentForm'>
            <div className='updateCommentHeading'>Update comment</div>
            {commentImage && (<img src={commentImage} alt="Comment image" className='updateCommentImage' />)}
            <textarea
                className="updateCommentText"
                defaultValue={commentText}
                name="text"
                id="text"
                rows="5"
                cols="50"
                onChange={(event) => setCommentText(event.target.value)}
            ></textarea>
            <input
                type="file"
                accept=".jpg, .png, .gif, .svg, .webp"
                id="commentImage"
                className="commentImageInput"
                name="commentImage"
                onChange={handleSelectFile}
                multiple={false}
            ></input>
            <button type="button" className="updateCommentSubmit" onClick={(e) => updateComment(e)}>Update Comment</button>
            <div className='back link' onClick={() => navigate(-1)}>Cancel</div>
        </form>
    ) : formSubmit && !error ? (
        <div className="commentUpdated">
            <div className="commentUpdatedHeading">{status}</div>
            <Link className="back link" to={`/odin-book/users/${userid}/feed`}>Back to Feed</Link>
            <Link className="back link" to={`/odin-book/users/${userid}/`}>Back to Profile</Link>
        </div > 
    ) : (
        <>
            <div className='error'>{error}</div>
            <Link className="back link" to={`/odin-book/users/${userid}/feed`}>Back to Feed</Link>
            <Link className="back link" to={`/odin-book/users/${userid}/`}>Back to Profile</Link>
                    
        </>
    )
}

UpdateComment.propTypes = {
    token: PropTypes.string,
    userid: PropTypes.string,
}

export default UpdateComment;