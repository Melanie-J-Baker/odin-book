import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Loading from '../pages/Loading';
import Comment from '../components/Comment';
import '../styles/Post.css';

Post.propTypes = {
    userid: PropTypes.string,
    token: PropTypes.string,
    postid: PropTypes.string,
    postUserImage: PropTypes.string,
    postUsername: PropTypes.string,
    postTimestamp: PropTypes.string,
    postText: PropTypes.string,
    postImage: PropTypes.string,
    postLikes: PropTypes.array,
}
function Post({ userid, token, postid, postUserImage, postUsername, postTimestamp, postText, postImage, postLikes}) {
    const fetchDone = useRef(false);
    const [comments, setComments] = useState([]);
    const [message, setMessage] = useState('');
    
    useEffect(() => {
        if (fetchDone.current) return;
        const fetchComments = () => {
            fetch(`${import.meta.env.VITE_API}/odin-book/posts/${postid}/comments/?` + new URLSearchParams({
                secret_token: token,
            }), {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }).then((response) => {
                return response.json();
            }).then((data) => {
                setComments(data);
            }).catch(error => console.log(error));
        }
        fetchComments()
        fetchDone.current = true;
    }, [postid, token])

    const likePost = (postid) => {
        fetch(`${import.meta.env.VITE_API}/odin-book/posts/${postid}/?` + new URLSearchParams({
            secret_token: token,
        }), {
            method: 'PUT',
            mode: 'cors',
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                likes: userid
            })
        }).then((response) => {
        return response.json();
        }).then((data) => {
        console.log(data);
        setMessage(data.message);
        })
    }

    return fetchDone.current ? (
        <div className="post">
            <div className="postUserDetails">
                <img src={postUserImage} alt='Profile Image' className='feedProfileImage' />
                <div className="postUsernameTimestamp">
                    <div className='postUsername'>{postUsername}</div>
                    <div className="postTimestamp">{postTimestamp}</div>
                </div>
            </div>
            <div className="postText">{postText}</div>
            <img src={postImage} alt="Post Image" className='postImage' />
            {!postLikes.includes(userid) ? (<div className='likeBtnPost' id={postid} onClick={(event) => likePost(event.target.id)}></div>) : (<><div className='postLiked'></div><div className='postLikedText'>Liked</div></>)}
            {postLikes.length === 1 ? (
                <div className="postLikes">1 like</div>
            ) : (
                <div className="postLikes">{postLikes.length} likes</div>
            )}
            <div className='message'>{message}</div>
            {comments.length !== 0 ? (
                <div className='comments'>
                    <div className='commentsHeading'>Comments</div>
                    {comments.map((comment) => (
                        <Comment key={comment._id} userid={userid} token={token} commentid={comment._id} />
                    ))}
                </div>
            ) : (
                <div className='noComments'>No comments</div>
            )}
        </div>
    ) : (
        <Loading />
    )
}

export default Post;