import { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/AddPost.css';
import Loading from '../pages/Loading';

AddPost.propTypes = {
    userid: PropTypes.string,
    token: PropTypes.string,
    setPostAdded: PropTypes.func,
}

function AddPost({ userid, token, setPostAdded }) {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const addPost = (e) => {
        e.preventDefault();
        setLoading(true);
        fetch(`${import.meta.env.VITE_API}/odin-book/users/${userid}/posts/?` + new URLSearchParams({
            secret_token: token,
        }), {
            method: 'POST',
            mode: 'cors',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                user: userid,
                text: text,
            })
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data.post._id)
            if (file !== '') {
                const formData = new FormData();
                formData.append("postImage", file);
                return fetch(`${import.meta.env.VITE_API}/odin-book/users/${userid}/posts/${data.post._id}/uploadimage/?` + new URLSearchParams({
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
            setPostAdded({ added: true });
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
        <form encType='multipart/form-data' name='addPostForm' className='addPostForm' onSubmit={(e) => addPost(e)}>
            <div className='addPostHeading'>Create a new post</div>
            <textarea className="addPostText" value={text} placeholder="Write your post here" name="text" id="text" rows="3" cols="30" onChange={(event) => setText(event.target.value)}></textarea>
            <div className="addPostBtns">
                <input type="file" id="postImage" name="postImage" onChange={handleSelectFile} multiple={false}></input>
                <button type="submit" className="createPost">Post</button>
            </div>
            <div className='message'>{message}</div>
        </form>
    )
}

export default AddPost;