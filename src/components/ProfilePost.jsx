import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Loading from '../pages/Loading';
import '../styles/ProfilePost.css';
import Comment from '../components/Comment';

ProfilePost.propTypes = {
    userid: PropTypes.string,
    token: PropTypes.string,
    postid: PropTypes.string,
    postTimestamp: PropTypes.string,
    postText: PropTypes.string,
    postImage: PropTypes.string,
    postLikes: PropTypes.array,
}
function ProfilePost({ userid, token, postid, postTimestamp, postText, postImage, postLikes }) {
    const fetchDone = useRef(false);
    const [comments, setComments] = useState([]);

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
            fetchDone.current = true;
        }
        fetchComments()
    })
    
    return fetchDone.current ? (
        <div className="profilePost">
            <div className="postText">{postText}</div>
            <div className="postTimestamp">{postTimestamp}</div>
            <img src={postImage} alt="Post Image" className='postImage' />
            {postLikes.length === 1 ? (
                <div className="postLikes">1 like</div>
            ) : (
                <div className="postLikes">{postLikes.length} likes</div>
            )}
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

export default ProfilePost;