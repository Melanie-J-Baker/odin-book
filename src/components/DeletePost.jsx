import { useState } from 'react';
import PropTypes from 'prop-types';
import Loading from '../pages/Loading';
import '../styles/DeletePost.css';

const DeletePost= ({ postid, token, setPostDeleted, setDeletePostShowing }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [data, setData] = useState('');
    const [formSubmit, setFormSubmit] = useState(false);

    const deletePost = (postid) => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API}/odin-book/posts/${postid}/?` + new URLSearchParams({
            secret_token: token,
        }), {
            method: 'DELETE',
            mode: 'cors',
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then(data => {
                setData(data);
                setPostDeleted({ deleted: true });
            })
            .catch(error => setError(error.msg))
            .finally(() => {
                setLoading(false);
                setFormSubmit(true);
            })
    }

    if (error) return <p className='error'>A network error was encountered. {error}</p>
    if (loading) return <Loading />
    return !formSubmit && !data && (
        <div className='deletePostConfirm'>
            <div className='deletePostText'>Are you sure you want to delete this post?</div>
            <div className='deletePostBtns'>
                <div className='confirmBtn deletePostBtn' onClick={() => deletePost(postid)}>Confirm</div>
                <div className='cancelBtn deletePostBtn' onClick={() => setDeletePostShowing(false)}>Cancel</div>
            </div>
        </div>
    )
}

DeletePost.propTypes = {
    postid: PropTypes.string,
    token: PropTypes.string,
    setPostDeleted: PropTypes.func,
    setDeletePostShowing: PropTypes.func,
}

export default DeletePost;