import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import '../styles/UpdatePost.css';
import Loading from './Loading';

function UpdatePost({ token, userid }) {
    const { postid } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [postText, setPostText] = useState('');
    const [currentPostImage, setCurrentPostImage] = useState('');
    const [status, setStatus] = useState('');
    const [formSubmit, setFormSubmit] = useState(false);
    const [file, setFile] = useState('');

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API}/odin-book/posts/${postid}/?` + new URLSearchParams({
            secret_token: token,
        }), {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setPostText(data.text);
            setCurrentPostImage(data.post_image);
        }).catch(error => {
            setError(error.msg)
        }).finally(() => setLoading(false));
    })

    const updatePost = (e) => {
        e.preventDefault();
        setLoading(true);
        fetch(`${import.meta.env.VITE_API}/odin-book/users/${userid}/posts/${postid}/?` + new URLSearchParams({
            secret_token: token,
        }), {
            method: 'PUT',
            mode: 'cors',
            credentials : 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                text: postText
            })
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setStatus(data.status);
            if (file == '') {
                navigate(-1)
            }
        }).catch(error => {
            setError(error.msg)
            setStatus(error.msg)
        }).finally(() => {
            setLoading(false);
            setFormSubmit(true);
        })
        if (file !== '') {
            setFormSubmit(false);
            const formData = new FormData();
            formData.append("postImage", file);
            setLoading(true);
            fetch(`${import.meta.env.VITE_API}/odin-book/users/${userid}/posts/${postid}/uploadimage/?` + new URLSearchParams({
                secret_token: token,
            }), {
                method: 'PUT',
                mode: 'cors',
                credentials : 'include',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            }).then((response) => {
                return response.json();
            }).then((data) => {
                setStatus(data.status || data.message);
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

    const handleSelectFile = (e) => {
        setFile(e.target.files[0]);
    }
    
    if (error) return <div className="error">A network error was encountered. {error}</div>
    if (loading) return <Loading />
    return !formSubmit ? (
        <div className="updatePostDiv">
            {currentPostImage && (<img src={currentPostImage} alt="Post image" className='updatePostImage' />)}
            <form encType="multipart/form-data" className='updatePostForm'>
                <div className='updatePostHeading'>Update post</div>
                <textarea className="updatePostText" defaultValue={postText} name="text" id="text" rows="3" cols="30" onChange={(event) => setPostText(event.target.value)}></textarea>
                <input type="file" id="postImage" className="postImageInput"  name="postImage" onChange={handleSelectFile} multiple={false}></input>
                <button type="button" className="updatePostSubmit" onClick={(e) => updatePost(e)}>Update Post</button>
                <div className='back link' onClick={() => navigate(-1)}>Cancel</div>
            </form>
        </div>
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

UpdatePost.propTypes = {
    token: PropTypes.string,
    userid: PropTypes.string,
}

export default UpdatePost;