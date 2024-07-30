import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../pages/Loading';
import LikeUsers from '../components/LikeUsers';
import DeleteComment from '../components/DeleteComment';
import '../styles/Comment.css';

const Comment = ({
    userid,
    token,
    commentid,
    commentImage,
    commentText,
    commentUsername,
    commentUserImage,
    commentUserId,
    commentTimestamp,
    commentLikes,
    setCommentLiked,
    setCommentDeleted
}) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState();
    const [likeError, setLikeError] = useState('');
    const [likeUsersShowing, setLikeUsersShowing] = useState(false);
    const [deleteCommentShowing, setDeleteCommentShowing] = useState(false);

    const likeComment = (id) => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API}/odin-book/comments/${id}/like/?${new URLSearchParams({ secret_token: token })}`, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ liked: userid })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setMessage(data.message);
                setCommentLiked({ liked: true })
                setTimeout(() => setMessage(''), 2000);
            })
            .catch(error => setLikeError(error.message || 'An error occurred'))
            .finally(() => setLoading(false));
    }

    const toggleLikeUsers = () => setLikeUsersShowing(prev => !prev);
    const toggleDeleteComment = () => setDeleteCommentShowing(prev => !prev);
    
    if (loading) return <Loading/>
    if (likeError) return <p className='error'>Error liking comment {likeError}</p>
    
    return (
        <div className='comment' id={commentid}>
            {deleteCommentShowing && (
                <DeleteComment
                    commentid={commentid}
                    token={token}
                    setCommentDeleted={setCommentDeleted}
                    setDeleteCommentShowing={setDeleteCommentShowing}
                />
            )}
            <div className="commentUserDetails">
                <img src={commentUserImage} alt='Profile Image' className='commentProfileImage' />
                <div className='commentUsername'>{commentUsername}</div>
                <div className='commentTimestamp'>{commentTimestamp}</div>
            </div>
            <div className="commentDiv">
                <div className="commentImageTextDiv">
                    {commentImage && <img src={commentImage} alt="Comment image" className='commentImage' />}
                    <div className="commentText">{commentText}</div>
                </div>
                <div className="commentLikesDiv">
                    <div className="likes">
                        <div
                            className={commentLikes.includes(userid) ? 'commentLiked' : 'likeBtnComment'}
                            id={commentid}
                            onClick={() => likeComment(commentid)}
                        />
                        <div className='commentLikes' onClick={toggleLikeUsers}>
                            {commentLikes.length} {commentLikes.length === 1 ? 'like' : 'likes'}
                        </div>
                    </div>
                    {likeUsersShowing && (
                        <LikeUsers
                            component="comment"
                            id={commentid}
                            token={token}
                            showLikeUsers={toggleLikeUsers}
                        />
                    )}
                    <div className='commentMessage'>{message}</div>  
                    {commentUserId === userid && (
                        <div className='commentOptions'>
                            <div
                                id={commentid}
                                className='updateComment'
                                onClick={() => navigate(`/odin-book/comments/${commentid}/update`)}
                            />
                            <div
                                id={commentid}
                                className='deleteComment'
                                onClick={() => toggleDeleteComment()}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

Comment.propTypes = {
    userid: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    commentid: PropTypes.string.isRequired,
    commentImage: PropTypes.string,
    commentText: PropTypes.string.isRequired,
    commentUsername: PropTypes.string.isRequired,
    commentUserImage: PropTypes.string.isRequired,
    commentUserId: PropTypes.string.isRequired,
    commentTimestamp: PropTypes.string.isRequired,
    commentLikes: PropTypes.arrayOf(PropTypes.string).isRequired,
    setCommentLiked: PropTypes.func.isRequired,
    setCommentDeleted: PropTypes.func.isRequired,
}

export default Comment;