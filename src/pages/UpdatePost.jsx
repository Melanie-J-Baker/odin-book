import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../styles/UpdatePost.css';
import Loading from './Loading';

UpdatePost.propTypes = {
    token: PropTypes.string,
    userid: PropTypes.string,
}

function UpdatePost({ token, userid }) {
    const { postid } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [postText, setPostText] = useState('');
    const [postImage, setPostImage] = useState('');
    const [status, setStatus] = useState('');
    const [formSubmit, setFormSubmit] = useState(false);
    const [newPostImage, setNewPostImage] = useState('');

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API}/odin-book/posts/${postid}/?` + new URLSearchParams({
            secret_token: token,
        }), {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setPostText(data.text);
            setPostImage(data.post_image);
        }).catch(error => {
            setError(error)
        }).finally(() => setLoading(false));
    })

    const handleSelectFile = (e) => {
        setNewPostImage(e.target.files[0]);
    }

    const updatePost = (e) => {
        e.preventDefault();
        setLoading(true);
        fetch(`${import.meta.env.VITE_API}/odin-book/users/${userid}/posts/${postid}/?` + new URLSearchParams({
            secret_token: token,
        }), {
            method: 'PUT',
            mode: 'cors',
            credentials : "include",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                text: postText
            })
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setStatus(data.status);
        }).catch(error => {
            setError(error)
            setStatus(error)
        }).finally(() => {
            setLoading(false);
            setFormSubmit(true);
        })
        if (newPostImage !== '') {
            setFormSubmit(false);
            const formData = new FormData();
            formData.append("postImage", newPostImage);
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
                setStatus(data.status);
                setError(data.error);
            }).catch(error => {
                setError(error.msg)
                setStatus(error.msg)
            }).finally(() => {
                setLoading(false);
                setFormSubmit(true);
            })
        }
    }
    
    if (error) return <p>A network error was encountered ({error})</p>
    if (loading) return <Loading />
    return !formSubmit ? (
        <form className='updatePostForm'>
            <div className='updatePostHeading'>Update post</div>
            <textarea className="updatePostText" defaultValue={postText} name="text" id="text" rows="3" cols="30" onChange={(event) => setPostText(event.target.value)}></textarea>
            <div className="updatePostImage">
                {postImage && (<img src={postImage} alt="Post image" className='updatePostImage' />)}
                <input type="file" id="postImage" defaultValue={postImage}  name="postImage" onChange={handleSelectFile} multiple={false}></input>
            </div>
            <button type="button" className="updatePostSubmit" onClick={(e) => updatePost(e)}>Update Post</button>
        </form>
    ) : formSubmit && !error ? (
        <div className="postUpdated">
            <div className="postUpdatedHeading">{status}</div>
            <Link id="back" className="back link" to={`/odin-book/users/${userid}/`}>Back to Profile</Link>
        </div > 
    ) : (
        <>
            <div className='error'>{error}</div>
            <Link id="back" className="back link" to={`/odin-book/users/${userid}/`}>Back to Profile</Link>
        </>
    )
}

export default UpdatePost;