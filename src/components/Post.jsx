import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import Comments from '../components/Comments';
import LikeUsers from '../components/LikeUsers';
import DeletePost from '../components/DeletePost';
import Loading from '../pages/Loading';
import '../styles/Post.css';

const Post = ({ userid, token, postid, postUserId, postUsername, postTimestamp, postText, postUserImage, postImage, postLikes, setPostLiked, setPostDeleted }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const [likeUsersShowing, setLikeUsersShowing] = useState(false);
    const [deletePostShowing, setDeletePostShowing] = useState(false); 
    const component = "post";

    const likePost = (id) => {
        setLoading(true);
        fetch(`${import.meta.env.VITE_API}/odin-book/posts/${id}/like?` + new URLSearchParams({
            secret_token: token,
        }), {
            method: 'PUT',
            mode: 'cors',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ likes: userid })
        })
            .then(response => response.json())
            .then(data => {
                setMessage(data.message);
                setPostLiked({ liked: true });
                setTimeout(() => setMessage(""), 2000)
            })
            .catch(error => setError(error.msg))
            .finally(() => setLoading(false))
    }

    const showDeletePost = () => deletePostShowing === false ? setDeletePostShowing(true) : setDeletePostShowing(false);

    const showLikeUsers = () => likeUsersShowing === true ? setLikeUsersShowing(false) : setLikeUsersShowing(true);

    if (error) return <p className="error">A network error was encountered. {error}</p>
    if (loading) return <Loading />
    return (
        <div className='post'>
            {deletePostShowing && (<DeletePost postid={postid} token={token} setPostDeleted={setPostDeleted} setDeletePostShowing={setDeletePostShowing} />)}
            <div className='postUserDetails'>
                <div className='userDetails'>
                    <img src={postUserImage} alt='Profile Image' className='postProfileImage' />
                    <div className="postUsernameTimestamp">
                        <div className='postUsername'>{postUsername}</div>
                        <div className='postTimestamp'>{postTimestamp}</div>
                    </div>
                </div>
                {postUserId == userid ? (
                    <div className='postOptions'>
                        <div id={postid} className='updatePost' onClick={(e) => navigate(`/odin-book/posts/${e.target.id}/update`)}></div>
                        <div id={postid} className='deletePost' onClick={() => showDeletePost()}></div>
                    </div>
                ) : <div className='postOptions'></div>}
            </div>
            <div className="postDiv">
                <div className="postText">{postText}</div>
                {postImage && (<img src={postImage} alt="Post Image" className='postImage' />)}
                <div className="likesDiv" >
                    <div className="likes">
                        {postLikes && !postLikes.includes(userid) ? (<div className='likeBtnPost' id={postid} onClick={(event) => likePost(event.target.id)}></div>) : (<div className='postLiked' id={postid} onClick={(event) => likePost(event.target.id)}></div>)}
                        {postLikes.length === 1 ? (
                            <div className="postLikes" onClick={() => showLikeUsers()}>1 like</div>
                        ) : (
                            <div className="postLikes" onClick={() => showLikeUsers()}>{postLikes.length} likes</div>
                        )}
                    </div>
                    {likeUsersShowing && (<LikeUsers component={component} id={postid} token={token} showLikeUsers={showLikeUsers} />)}
                    {message && (<div className='postMessage'>{message}</div>)}
                </div>
            </div>
            <Comments userid={userid} postid={postid} token={token} />
        </div>
    )
}

Post.propTypes = {
    userid: PropTypes.string,
    token: PropTypes.string,
    postid: PropTypes.string,
    postUserId: PropTypes.string,
    postUsername: PropTypes.string,
    postTimestamp: PropTypes.string,
    postText: PropTypes.string,
    postUserImage: PropTypes.string,
    postImage: PropTypes.string,
    postLikes: PropTypes.array,
    setPostLiked: PropTypes.func,
    setPostDeleted: PropTypes.func,
}

export default Post;