import { useState } from 'react';
import PropTypes from 'prop-types';
import Loading from '../pages/Loading';
import '../styles/DeletePost.css';

const DeletePost= ({ postid, token, setPostDeleted, setDeletePostShowing }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [data, setData] = useState('');
    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleDeletePost = (postid) => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API}/odin-book/posts/${postid}/?${new URLSearchParams({ secret_token: token})}`, {
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
            .then(data => {
                setData(data);
                setPostDeleted({ deleted: true });
            })
            .catch(error => setError(error.message || 'An error occurred'))
            .finally(() => {
                setLoading(false);
                setFormSubmitted(true);
            })
    }

    if (loading) return <Loading />
    if (error) return <p className='error'>A network error was encountered. {error}</p>
    return !formSubmitted && !data ? (
        <div className='deletePostConfirm'>
            <div className='deletePostText'>Are you sure you want to delete this post?</div>
            <div className='deletePostBtns'>
                <div className='confirmBtn deletePostBtn' onClick={() => handleDeletePost(postid)}>Confirm</div>
                <div className='cancelBtn deletePostBtn' onClick={() => setDeletePostShowing(false)}>Cancel</div>
            </div>
        </div>
    ) : null;
}

DeletePost.propTypes = {
    postid: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    setPostDeleted: PropTypes.func.isRequired,
    setDeletePostShowing: PropTypes.func.isRequired,
}

export default DeletePost;