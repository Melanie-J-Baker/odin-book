import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Comments from '../components/Comments';
import LikeUsers from '../components/LikeUsers';
import DeletePost from '../components/DeletePost';
import Loading from '../pages/Loading';
import '../styles/Post.css';

const Post = ({
    userid,
    token,
    postid,
    postUserId,
    postUsername,
    postTimestamp,
    postText,
    postUserImage,
    postImage,
    postLikes,
    setPostLiked,
    setPostDeleted
}) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const [likeUsersShowing, setLikeUsersShowing] = useState(false);
    const [deletePostShowing, setDeletePostShowing] = useState(false); 

    const handleLikePost = (id) => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API}/odin-book/posts/${id}/like?${new URLSearchParams({ secret_token: token })}`, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ likes: userid })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setMessage(data.message);
                setPostLiked({ liked: true });
                setTimeout(() => setMessage(""), 2000)
            })
            .catch(error => setError(error.message || 'An error occurred'))
            .finally(() => setLoading(false))
    }

    const toggleDeletePost = () => setDeletePostShowing(prev => !prev);
    const toggleLikeUsers = () => setLikeUsersShowing(prev => !prev);

    if (loading) return <Loading />
    if (error) return <p className="error">A network error was encountered. {error}</p>
    
    return (
        <div className='post'>
            {deletePostShowing && (
                <DeletePost
                    postid={postid}
                    token={token}
                    setPostDeleted={setPostDeleted}
                    setDeletePostShowing={setDeletePostShowing}
                />
            )}
            <div className='postUserDetails'>
                <div className='userDetails'>
                    <img src={postUserImage} alt='Profile Image' className='postProfileImage' />
                    <div className="postUsernameTimestamp">
                        <div className='postUsername'>{postUsername}</div>
                        <div className='postTimestamp'>{postTimestamp}</div>
                    </div>
                </div>
                {postUserId === userid && (
                    <div className='postOptions'>
                        <div
                            id={postid}
                            className='updatePost'
                            onClick={(e) => navigate(`/odin-book/posts/${e.target.id}/update`)}
                        ></div>
                        <div
                            id={postid}
                            className='deletePost'
                            onClick={() => toggleDeletePost()}
                        ></div>
                    </div>
                )}
            </div>
            <div className="postDiv">
                <div className="postText">{postText}</div>
                {postImage && (
                    <img src={postImage} alt="Post Image" className='postImage' />
                )}
                <div className="likesDiv" >
                    <div className="likes">
                        {postLikes && !postLikes.includes(userid) ? (
                            <div
                                className='likeBtnPost'
                                id={postid}
                                onClick={(event) => handleLikePost(event.target.id)}
                            />
                        ) : (
                            <div
                                className='postLiked'
                                id={postid}
                                onClick={(event) => handleLikePost(event.target.id)}
                            ></div>
                        )}
                        <div className="postLikes" onClick={toggleLikeUsers}>
                            {postLikes.length} {postLikes.length === 1 ? 'like' : 'likes'}
                        </div>
                    </div>
                    {likeUsersShowing && (
                        <LikeUsers
                            component="post" id={postid} token={token} showLikeUsers={toggleLikeUsers}
                        />
                    )}
                    {message && <div className='postMessage'>{message}</div>}
                </div>
            </div>
            <Comments userid={userid} postid={postid} token={token} />
        </div>
    )
}

Post.propTypes = {
    userid: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    postid: PropTypes.string.isRequired,
    postUserId: PropTypes.string.isRequired,
    postUsername: PropTypes.string.isRequired,
    postTimestamp: PropTypes.string.isRequired,
    postText: PropTypes.string.isRequired,
    postUserImage: PropTypes.string.isRequired,
    postImage: PropTypes.string,
    postLikes: PropTypes.arrayOf(PropTypes.string).isRequired,
    setPostLiked: PropTypes.func.isRequired,
    setPostDeleted: PropTypes.func.isRequired,
}

export default Post;