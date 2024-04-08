import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/AddPost.css'

AddPost.propTypes = {
    userid: PropTypes.string,
    token: PropTypes.string,
}

function AddPost({userid, token}) {
    const fetchDone = useRef(false);
    const [text, setText] = useState();
    const [postImage, setPostImage] = useState();

    const addPost = () => {
        if (fetchDone.current) return;
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
                post_image: postImage
            })
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data)
        }).catch(error => console.log(error))
        fetchDone.current = true;
        //navigate(0)
    }
    return (
        <form className='addPostForm'>
            <textarea className="addPostText" value={text} placeholder="Write your post here" rows="3" cols="30" onChange={(event) => setText(event.target.value)}></textarea>
            <div className="addPostBtns">
                <label htmlFor='addPostImage' className='addPostImageLabel'>Add image</label>
                <input type="file" id="addPostImage" onChange={(event) => setPostImage(event.target.value)}></input>
                <button className="createPost" onClick={addPost}>Post</button>
            </div>
        </form>
    )
}

export default AddPost;