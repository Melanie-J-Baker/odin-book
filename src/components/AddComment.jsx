import { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/AddComment.css';
import Loading from '../pages/Loading';

function AddComment({ userid, token, postid, setCommentAdded }) {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const addComment = (e) => {
        e.preventDefault();
        setLoading(true);
        fetch(`${import.meta.env.VITE_API}/odin-book/posts/${postid}/comments?` + new URLSearchParams({
            secret_token: token,
        }), {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                post: postid,
                user: userid,
                text: text,
            })
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data.comment._id)
            if (file !== '') {
                const formData = new FormData();
                formData.append("commentImage", file);
                return fetch(`${import.meta.env.VITE_API}/odin-book/comments/${data.comment._id}/uploadimage/?` + new URLSearchParams({
                    secret_token: token,
                }), {
                    method: 'PUT',
                    mode: 'cors',
                    credentials : "include",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData
                }).then((response) => {
                    return response.json();
                }).then((data) => {
                    console.log(data)
                    setMessage(data.status);
                    setTimeout(() => {
                        setMessage('');
                    }, 3000)
                }).catch(error => {
                    console.log(error)
                    setError(error.message)
                    setMessage(error.message)
                    setTimeout(() => {
                        setMessage('');
                        setError('');
                    }, 3000)
                }).finally(() => {
                    setLoading(false);
                })
            }
        }).catch(error => {
            console.log(error)
            setError(error.msg)
        }).finally(() => {
            setLoading(false);
            setCommentAdded({ added: true });
            setText('');
            setFile('');
        });
    }

    const handleSelectFile = (e) => {
        setFile(e.target.files[0]);
    }

    if (error) return <div className='error'>A network error was encountered. {error}</div>
    if (loading) return <Loading/>
    return (
        <form encType='multipart/form-data' name='addCommentForm' className='addCommentForm' onSubmit={(e) => addComment(e)}>
            <div className="commentFormDiv">
                <textarea className="addCommentText" value={text} placeholder="Write your comment here" name="text" id="text" rows="2" cols="30" onChange={(event) => setText(event.target.value)}></textarea>
                <button type="submit" className="addCommentBtn">Comment</button>
            </div>    
                <input type="file" id="commentImage" name="commentImage" onChange={handleSelectFile} multiple={false}></input>
            <div className='message'>{message}</div>
        </form>
    )
}

AddComment.propTypes = {
    userid: PropTypes.string,
    token: PropTypes.string,
    postid: PropTypes.string,
    setCommentAdded: PropTypes.func,
}

export default AddComment;