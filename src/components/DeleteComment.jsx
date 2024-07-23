import { useState } from 'react';
import PropTypes from 'prop-types';
import Loading from '../pages/Loading';
import '../styles/DeleteComment.css';

function DeleteComment({commentid, token, setCommentDeleted, setDeleteCommentShowing}) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [data, setData] = useState('');
    const [formSubmit, setFormSubmit] = useState(false);


    const deleteComment = (commentid) => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API}/odin-book/comments/${commentid}/?` + new URLSearchParams({
            secret_token: token,
        }), {
            method: 'DELETE',
            mode: 'cors',
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setData(data.message);
            setCommentDeleted({ deleted: true });
        }).catch((error) => {
            setError(error.msg)
        }).finally(() => {
            setLoading(false);
            setFormSubmit(true);
        })
    }

    if (error) return <p className='error'>A network error was encountered. {error}</p>
    if (loading) return <Loading />
    return !formSubmit && !data && (
        <div className='deleteCommentConfirm'>
            <div className='deleteCommentText'>Are you sure you want to delete this comment?</div>
            <div className='deleteCommentBtns'>
                <div className='confirmBtn deleteCommentBtn' onClick={() => deleteComment(commentid)}>Confirm</div>
                <div className='cancelBtn deleteCommentBtn' onClick={() => setDeleteCommentShowing(false)}>Cancel</div>
            </div>
        </div>
    )
}

DeleteComment.propTypes = {
    commentid: PropTypes.string,
    token: PropTypes.string,
    setCommentDeleted: PropTypes.func,
    setDeleteCommentShowing: PropTypes.func,
}

export default DeleteComment;