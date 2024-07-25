import { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/AddComment.css';
import Loading from '../pages/Loading';

const AddComment = ({ userid, token, postid, setCommentAdded }) => {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const addComment = (e) => {
        e.preventDefault();
        setLoading(true);
        fetch(`${import.meta.env.VITE_API}/odin-book/posts/${postid}/comments?${new URLSearchParams({ secret_token: token })}`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                post: postid,
                user: userid,
                text
            })
        })
            .then(response => response.json())
            .then(data => {
                if (file) {
                    const formData = new FormData();
                    formData.append("commentImage", file);
                    return fetch(`${import.meta.env.VITE_API}/odin-book/comments/${data.comment._id}/uploadimage/?${new URLSearchParams({ secret_token: token })}`, {
                        method: 'PUT',
                        mode: 'cors',
                        credentials : 'include',
                        headers: { 'Authorization': `Bearer ${token}` },
                        body: formData
                    })
                        .then(response => response.json())
                        .then(data => setMessage(data.status))
                        .catch(error => {
                            setError(error.message || 'An error occurred');
                            setMessage(error.message || 'An error occurred');
                        })
                        .finally(() => {
                            setLoading(false);
                            setTimeout(() => {
                                setMessage('');
                                setError('');
                            }, 3000)
                        })
                }
            })
            .catch(error => setError(error.message || 'An error occurred'))
            .finally(() => {
                setLoading(false);
                setCommentAdded({ added: true });
                setText('');
                setFile('');
            });
    }

    const handleFileChange = (e) => setFile(e.target.files[0]);

    if (loading) return <Loading/>
    if (error) return <div className='error'>A network error was encountered. {error}</div>
    
    return (
        <form encType='multipart/form-data' name='addCommentForm' className='addCommentForm' onSubmit={addComment}>
            <div className="commentFormDiv">
                <textarea
                    className="addCommentText"
                    value={text}
                    placeholder="Write your comment here"
                    name="text"
                    id="text"
                    rows="2"
                    cols="30"
                    onChange={(e) => setText(e.target.value)}
                />
                <button type="submit" className="addCommentBtn">Comment</button>
            </div>    
            <input
                type="file"
                accept=".jpg, .png, .gif, .svg, .webp"
                id="commentImage"
                name="commentImage"
                onChange={handleFileChange}
                multiple={false}
            />
            <div className='message'>{message}</div>
        </form>
    )
}

AddComment.propTypes = {
    userid: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    postid: PropTypes.string.isRequired,
    setCommentAdded: PropTypes.func.isRequired,
}

export default AddComment;