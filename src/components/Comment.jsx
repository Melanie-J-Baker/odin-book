import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../pages/Loading';
import LikeUsers from '../components/LikeUsers';
import '../styles/Comment.css';

function Comment({ userid, token, commentid, commentImage, commentText, commentUsername, commentUserImage, commentUserId, commentTimestamp, commentLikes, setCommentLiked, setCommentDeleted }) {
    const navigate = useNavigate();
    const component = "comment";
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState();
    const [error, setError] = useState();
    const [likeError, setLikeError] = useState('');
    const [likeUsersShowing, setLikeUsersShowing] = useState(false);

    const likeComment = (id) => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API}/odin-book/comments/${id}/like/?` + new URLSearchParams({
            secret_token: token,
        }), {
            method: 'PUT',
            mode: 'cors',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                liked: userid
            })
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setMessage(data.message);
            setCommentLiked({ liked: true })
            setTimeout(() => {
                setMessage("");
            }, 2000)
        }).catch((error) => {
            setLikeError(error.msg)
        }).finally(() => setLoading(false));
    }

    const deleteComment = (commentid) => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API}/odin-book/comments/${commentid}/?` + new URLSearchParams({
            secret_token: token,
        }), {
            method: 'DELETE',
            mode: 'cors',
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setMessage(data.message);
            setTimeout(() => {
                setMessage("");
            }, 4000)
            setCommentDeleted({ deleted: true });
        }).catch((error) => {
            setError(error.msg)
        }).finally(() => setLoading(false))
    }

    const showLikeUsers = () => {
        setLikeUsersShowing(true);
    }

    const hideLikeUsers = () => {
        setLikeUsersShowing(false);
    }
    
    if (likeError) return <p className='error'>Error liking comment {likeError}</p>
    if (error) return <p className='error'>A network error was encountered. {error}</p>
    if (loading) return <Loading/>
    return (
        <div className='comment' id={commentid}>
            <div className="commentUserDetails">
                <img src={commentUserImage} alt='Profile Image' className='commentProfileImage' />
                <div className='commentUsername'>{commentUsername}</div>
                <div className='commentTimestamp'>{commentTimestamp}</div>
            </div>
            <div className="commentDiv">
                <div className="commentImageTextDiv">
                    {commentImage && (<img src={commentImage} alt="Comment image" className='commentImage' />)}
                    <div className="commentText">{commentText}</div>
                </div>
                <div className="commentLikesDiv">
                    <div className="likes">
                        {commentLikes.includes(userid) ? (<div className='commentLiked' id={commentid} onClick={(event) => likeComment(event.target.id)}></div>) : (<div className='likeBtnComment' id={commentid} onClick={(event) => likeComment(event.target.id)}></div>)}
                        {commentLikes.length === 1 ? (
                            <div className='commentLikes' onClick={showLikeUsers}>1 like</div>
                        ) : (
                            <div className='commentLikes' onClick={showLikeUsers}>{commentLikes.length} likes</div>
                        )}
                    </div>
                    {likeUsersShowing && (<LikeUsers component={component} id={commentid} token={token} hideLikeUsers={hideLikeUsers} />)}
                    <div className='commentMessage'>{message}</div>  
                    {commentUserId == userid ? (
                        <div className='commentOptions'>
                            <div id={commentid} className='updateComment' onClick={(e) => navigate(`/odin-book/comments/${e.target.id}/update`)}></div>
                            <div id={commentid} className='deleteComment' onClick={(e) => deleteComment(e.target.id)}></div>
                        </div>
                    ) : (
                        <div className='commentOptions'></div>
                    )}
                </div>
            </div>
        </div>
    )
}

Comment.propTypes = {
    userid: PropTypes.string,
    token: PropTypes.string,
    commentid: PropTypes.string,
    commentImage: PropTypes.string,
    commentText: PropTypes.string,
    commentUsername: PropTypes.string,
    commentUserImage: PropTypes.string,
    commentUserId: PropTypes.string,
    commentTimestamp: PropTypes.string,
    commentLikes: PropTypes.array,
    setCommentLiked: PropTypes.func,
    setCommentDeleted: PropTypes.func,
}

export default Comment;