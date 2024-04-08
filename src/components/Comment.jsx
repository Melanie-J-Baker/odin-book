import PropTypes from 'prop-types';
import { useRef, useState, useEffect } from 'react';
import Loading from '../pages/Loading';
import '../styles/Comment.css';

Comment.propTypes = {
    userid: PropTypes.string,
    token: PropTypes.string,
    commentid: PropTypes.string,
}

function Comment({ userid, token, commentid }) {
    const fetchDone = useRef(false);
    const [commentImage, setCommentImage] = useState();
    const [commentText, setCommentText] = useState();
    const [commentUsername, setCommentUsername] = useState();
    const [commentTimestamp, setCommentTimestamp] = useState();
    const [commentLikes, setCommentLikes] = useState();
    const [message, setMessage] = useState();

    useEffect(() => {
        if (fetchDone.current) return;
        const fetchComment = () => {
            fetch(`${import.meta.env.VITE_API}/odin-book/comments/${commentid}/?` + new URLSearchParams({
                secret_token: token,
            }), {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }).then((response) => {
                return response.json();
            }).then((data) => {
                setCommentImage(data.comment_image);
                setCommentText(data.text);
                setCommentUsername(data.user.username);
                setCommentTimestamp(data.timestamp_formatted);
                setCommentLikes(data.likes);
            }).catch(error => console.log(error));
            fetchDone.current = true;
        }
        fetchComment();
    }, [commentid, token])

    const likeComment = (commentid) => {
        fetch(`${import.meta.env.VITE_API}/odin-book/comments/${commentid}/?` + new URLSearchParams({
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
            setCommentLikes(data.comment.likes)
            setMessage(data.message);
            setTimeout(() => {
                setMessage("");
            }, 2000)
        })
    }
    
    return fetchDone.current ? (
        <div className='comment' id={commentid}>
            {commentImage && (<img src={commentImage} alt="Comment image" className='commentImage' />)}
            <div className="commentText">{commentText}</div>
            <div className='commentUsername'>{commentUsername}</div>
            <div className='commentTimestamp'>{commentTimestamp}</div>
            <div className="commentLikesDiv">
                {!commentLikes.includes(userid) ? (<div className='likeBtnComment' id={commentid} onClick={(event) => likeComment(event.target.id)}></div>) : (<div className='commentLiked' onClick={(event) => likeComment(event.target.id)}></div>)}
                {commentLikes.length === 1 ? (
                    <div className='commentLikes'>1 like</div>
                ) : (
                    <div className='commentLikes'>{commentLikes.length} likes</div>
                )}
                <div className='commentMessage'>{message}</div>
            </div>
        </div>
        
    ) : (
            <Loading/>
    )
}

export default Comment;