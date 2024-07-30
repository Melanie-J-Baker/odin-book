import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Loading from './Loading';
import Post from '../components/Post';
import AddPost from '../components/AddPost';
import LoggedOut from './LoggedOut';
import '../styles/Feed.css';

const Feed = ({ token, userid }) => {
    const [loading, setLoading] = useState(true);
    const [feedPosts, setFeedPosts] = useState();
    const [error, setError] = useState(null);
    const [postLiked, setPostLiked] = useState({ liked: false });
    const [postAdded, setPostAdded] = useState({ added: false });
    const [postDeleted, setPostDeleted] = useState({ deleted: false })

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API}/odin-book/users/${userid}/feed/?${new URLSearchParams({ secret_token: token })}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(response => response.json())
            .then(data => setFeedPosts(data.feedPosts))
            .catch(error => setError(error.message || 'An error occurred'))
            .finally(() => setLoading(false));
    }, [token, userid, postLiked, postAdded, postDeleted])

    if (!token) return <LoggedOut />
    if (loading) return <Loading/> 
    if (error) return <p className="error">A network error was encountered. {error}</p>
    return (
        <div className="feed">
            <AddPost userid={userid} token={token} setPostAdded={setPostAdded} />
            <h2 className="feedHeading">Feed</h2>
            {feedPosts.length ? (
                feedPosts.map(post => (
                    <Post
                        className="post"
                        key={post._id}
                        userid={userid}
                        token={token}
                        postid={post._id}
                        postUserId={post.user._id}
                        postUsername={post.user.username}
                        postTimestamp={post.timestamp_formatted}
                        postText={post.text}
                        postUserImage={post.user.profile_image}
                        postImage={post.post_image}
                        postLikes={post.likes}
                        setPostLiked={setPostLiked}
                        setPostDeleted={setPostDeleted}
                    />
            ))
        ) : (
            <div className='noPosts'>There are no posts in your feed</div>            
        )}
        </div>
    )  
}

Feed.propTypes = {
    token: PropTypes.string,
    userid: PropTypes.string,
}

export default Feed;