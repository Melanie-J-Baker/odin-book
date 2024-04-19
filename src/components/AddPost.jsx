import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../styles/AddPost.css';
import Loading from '../pages/Loading';

AddPost.propTypes = {
    userid: PropTypes.string,
    token: PropTypes.string,
}

function AddPost({ userid, token }) {
    const navigate = useNavigate();
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [postImage, setPostImage] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [postid, setPostid] = useState('');

    const handleSelectFile = (e) => {
        setPostImage(e.target.files[0]);
    }

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
            console.log(data);
            setPostid(data.post._id);
            navigate(0)
        }).catch(error => {
            setError(error.msg)
        }).finally(() => {
            setLoading(false);
        });
        if (postImage !== '') {
            const formData = new FormData();
            formData.append("postImage", postImage);
            setLoading(true);
            fetch(`${import.meta.env.VITE_API}/odin-book/users/${userid}/posts/${postid}/uploadimage/?` + new URLSearchParams({
                secret_token: token,
            }), {
                method: 'PUT',
                mode: 'cors',
                credentials : "include",
                headers: {
                    'Content-Type': undefined,
                    Authorization: `Bearer ${token}`,
                },
                body: formData
            }).then((response) => {
                return response.json();
            }).then((data) => {
                setMessage(data.message);
                setError(data.error);
                setTimeout(() => {
                    setMessage('');
                }, 10000)
                //navigate(0);
            }).catch(error => {
                setError(error.msg)
                setMessage(error.msg)
                setTimeout(() => {
                    setMessage('');
                }, 10000)
            }).finally(() => {
                setLoading(false);
            })
        }
    }

    if (error) return <p>A network error was encountered (error)</p>
    if (loading) return <Loading/>
    return (
        <form name='addPostForm' className='addPostForm' onSubmit={(e) => addPost(e)}>
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