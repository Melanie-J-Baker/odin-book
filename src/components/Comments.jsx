import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Loading from '../pages/Loading';
import Comment from '../components/Comment';

Comments.propTypes = {
    userid: PropTypes.string,
    token: PropTypes.string,
    postid: PropTypes.string,
}

function Comments({ userid, postid, token }) {
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
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
        }).catch(error => {
            setError(error)
        }).finally(() => setLoading(false));
    }, [postid, token]);

    if (error) return <p>A network error was encountered loading Comments (error)</p>
    if (loading) return <Loading/>
    return comments.length > 0 ? (
        <div className='comments'>
            <div className='commentsHeading'>Comments:</div>
            {comments.map((comment) => (
                <Comment key={comment._id} userid={userid} token={token} commentid={comment._id} commentImage={comment.comment_image} commentText={comment.text} commentUsername={comment.user.username} commentTimestamp={comment.timestamp_formatted} commentLikes={comment.likes} />
            ))}
        </div>
    ) : (<div className='noComments'>No comments</div>)
}

export default Comments;