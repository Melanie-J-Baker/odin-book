import PropTypes from 'prop-types';
import { useState } from 'react';
import Loading from '../pages/Loading';
import '../styles/Comment.css';

Comment.propTypes = {
    userid: PropTypes.string,
    token: PropTypes.string,
    commentid: PropTypes.string,
    commentImage: PropTypes.string,
    commentText: PropTypes.string,
    commentUsername: PropTypes.string,
    commentTimestamp: PropTypes.string,
    commentLikes: PropTypes.array,
}

function Comment({ userid, token, commentid, commentImage, commentText, commentUsername, commentTimestamp, commentLikes }) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState();
    const [likeError, setLikeError] = useState('');

    const likeComment = (id) => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API}/odin-book/comments/${id}/?` + new URLSearchParams({
            secret_token: token,
        }), {
            method: 'PUT',
            mode: 'cors',
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                liked: userid
            })
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setMessage(data.message);
            setTimeout(() => {
                setMessage("");
            }, 2000)
        }).catch((error) => {
            setLikeError(error)
        }).finally(() => setLoading(false));
    }
    
    if (likeError) return <p>Error liking comment (likeError)</p>
    if (loading) return <Loading/>
    return (
        <div className='comment' id={commentid}>
            {commentImage && (<img src={commentImage} alt="Comment image" className='commentImage' />)}
            <div className="commentText">{commentText}</div>
            <div className='commentUsername'>{commentUsername}</div>
            <div className='commentTimestamp'>{commentTimestamp}</div>
            <div className="commentLikesDiv">
                {commentLikes.includes(userid) ? (<div className='commentLiked' id={commentid} onClick={(event) => likeComment(event.target.id)}></div>) : (<div className='likeBtnComment' id={commentid} onClick={(event) => likeComment(event.target.id)}></div>)}
                {commentLikes.length === 1 ? (
                    <div className='commentLikes'>1 like</div>
                ) : (
                    <div className='commentLikes'>{commentLikes.length} likes</div>
                )}
                <div className='commentMessage'>{message}</div>
            </div>
        </div>
    )
}

export default Comment;