import { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/AddPost.css';
import Loading from '../pages/Loading';

const AddPost = ({ userid, token, setPostAdded }) => {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const addPost = (e) => {
        e.preventDefault();
        setLoading(true);
        fetch(`${import.meta.env.VITE_API}/odin-book/users/${userid}/posts/?${new URLSearchParams({ secret_token: token })}`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                user: userid,
                text
            })
        })
            .then(response => response.json())
            .then(data => {
                if (file) {
                    const formData = new FormData();
                    formData.append('postImage', file);
                    return fetch(`${import.meta.env.VITE_API}/odin-book/users/${userid}/posts/${data.post._id}/uploadimage/?${new URLSearchParams({ secret_token: token })}`, {
                        method: 'PUT',
                        mode: 'cors',
                        credentials : 'include',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                        body: formData
                    })
                        .then(response => response.json())
                        .then(data => setMessage(data.status))
                        .catch(error => {
                            setError(error.message || 'An error occurred')
                            setMessage(error.message || 'An error occurred')
                            setTimeout(() => {
                                setMessage('');
                                setError('');
                            }, 3000)
                        })
                        .finally(() => setLoading(false))
                }
            })
            .catch(error => setError(error.message || 'An error occurred'))
            .finally(() => {
                setLoading(false);
                setPostAdded({ added: true });
                setText('');
                setFile('');
            });
    }

    const handleFileChange = (e) => setFile(e.target.files[0]);

    if (loading) return <Loading/>
    if (error) return <div className='error'>A network error was encountered. {error}</div>

    return (
        <form encType='multipart/form-data' name='addPostForm' className='addPostForm' onSubmit={(e) => addPost(e)}>
            <div className='addPostHeading'>Create a new post</div>
            <textarea
                className="addPostText"
                value={text}
                placeholder="Write your post here"
                name="text"
                id="text"
                rows="3"
                cols="30"
                onChange={(e) => setText(e.target.value)}
            />
            <div className="addPostBtns">
                <input
                    type="file"
                    accept=".jpg, .png, .gif, .svg, .webp"
                    id="postImage"
                    name="postImage"
                    onChange={handleFileChange}
                    multiple={false}
                />
                <button type="submit" className="createPost">Post</button>
            </div>
            <div className='message'>{message}</div>
        </form>
    )
}

AddPost.propTypes = {
    userid: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    setPostAdded: PropTypes.func.isRequired,
}

export default AddPost;