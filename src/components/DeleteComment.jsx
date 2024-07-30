import { useState } from 'react';
import PropTypes from 'prop-types';
import Loading from '../pages/Loading';
import '../styles/DeleteComment.css';

const DeleteComment = ({
    commentid,
    token,
    setCommentDeleted,
    setDeleteCommentShowing
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleDeleteComment = (commentid) => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API}/odin-book/comments/${commentid}/?${new URLSearchParams({ secret_token: token })}`, {
            method: 'DELETE',
            mode: 'cors',
            headers: { 'Authorization': `Bearer ${token}` },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(() => setCommentDeleted({ deleted: true }))
            .catch(error => setError(error.message || 'An error occurred'))
            .finally(() => {
                setLoading(false);
                setFormSubmitted(true);
            })
    }

    if (loading) return <Loading />
    if (error) return <p className='error'>A network error was encountered. {error}</p>
    return !formSubmitted ? (
        <div className='deleteCommentConfirm'>
            <div className='deleteCommentText'>Are you sure you want to delete this comment?</div>
            <div className='deleteCommentBtns'>
                <div className='confirmBtn deleteCommentBtn' onClick={() => handleDeleteComment(commentid)}>Confirm</div>
                <div className='cancelBtn deleteCommentBtn' onClick={() => setDeleteCommentShowing(false)}>Cancel</div>
            </div>
        </div>
    ) : null;
};

DeleteComment.propTypes = {
    commentid: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    setCommentDeleted: PropTypes.func.isRequired,
    setDeleteCommentShowing: PropTypes.func.isRequired,
}

export default DeleteComment;