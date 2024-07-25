import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Loading from '../pages/Loading';
import AddComment from '../components/AddComment';
import Comment from '../components/Comment';
import '../styles/Comments.css';

const Comments = ({ userid, postid, token }) => {
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [error, setError] = useState(null);
    const [commentAdded, setCommentAdded] = useState({ added: false });
    const [commentLiked, setCommentLiked] = useState({ liked: false });
    const [commentDeleted, setCommentDeleted] = useState({deleted: false});

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API}/odin-book/posts/${postid}/comments/?` + new URLSearchParams({
            secret_token: token,
        }), {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        })
            .then(response => response.json())
            .then(data => setComments(data))
            .catch(error => setError(error))
            .finally(() => setLoading(false));
    }, [postid, token, commentAdded, commentLiked, commentDeleted]);

    if (error) return <p className='error'>A network error was encountered. {error}</p>
    if (loading) return <Loading/>
    return comments.length != 0 ? (
        <div className='comments'>
            <div className='commentsHeading'>Comments</div>
            {comments.map((comment) => (
                <Comment key={comment._id} userid={userid} token={token} commentid={comment._id} commentImage={comment.comment_image} commentText={comment.text} commentUsername={comment.user.username} commentUserImage={comment.user.profile_image} commentUserId={comment.user._id} commentTimestamp={comment.timestamp_formatted} commentLikes={comment.likes} setCommentLiked={setCommentLiked} setCommentDeleted={setCommentDeleted}/>
            ))}
            <AddComment userid={userid} token={token} postid={postid} setCommentAdded={setCommentAdded} />
        </div>
    ) : (
        <>
            <div className='noComments'>No comments</div>
            <AddComment userid={userid} token={token} postid={postid} setCommentAdded={setCommentAdded} />
        </>
    )
}

Comments.propTypes = {
    userid: PropTypes.string,
    token: PropTypes.string,
    postid: PropTypes.string,
}

export default Comments;