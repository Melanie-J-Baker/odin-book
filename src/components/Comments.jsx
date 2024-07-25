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
    const [commentDeleted, setCommentDeleted] = useState({ deleted: false });

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API}/odin-book/posts/${postid}/comments/?${new URLSearchParams({ secret_token: token })}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => response.json())
            .then(data => setComments(data))
            .catch(error => setError(error.message || 'An error occurred'))
            .finally(() => setLoading(false));
    }, [postid, token, commentAdded, commentLiked, commentDeleted]);

    if (loading) return <Loading />
    if (error) return <p className='error'>A network error was encountered. {error}</p>
    return (
        <div className='comments'>
            {comments.length ? (
                <>
                    <div className='commentsHeading'>Comments</div>
                    {comments.map((comment) => (
                        <Comment
                            key={comment._id}
                            userid={userid}
                            token={token}
                            commentid={comment._id}
                            commentImage={comment.comment_image}
                            commentText={comment.text}
                            commentUsername={comment.user.username}
                            commentUserImage={comment.user.profile_image}
                            commentUserId={comment.user._id}
                            commentTimestamp={comment.timestamp_formatted}
                            commentLikes={comment.likes}
                            setCommentLiked={setCommentLiked}
                            setCommentDeleted={setCommentDeleted}
                        />
                    ))}
                </>
            ) : (
                <div className='noComments'>No comments</div>
            )}
            <AddComment
                userid={userid}
                token={token}
                postid={postid}
                setCommentAdded={setCommentAdded}
            />
        </div>
    );
};

Comments.propTypes = {
    userid: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    postid: PropTypes.string.isRequired,
}

export default Comments;