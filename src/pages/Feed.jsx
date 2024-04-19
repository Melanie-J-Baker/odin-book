import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Loading from './Loading';
import Post from '../components/Post';
import AddPost from '../components/AddPost';
import '../styles/Feed.css';

Feed.propTypes = {
    token: PropTypes.string,
    userid: PropTypes.string,
}

function Feed({ token, userid }) {
    const [loading, setLoading] = useState(true);
    const [feedPosts, setFeedPosts] = useState();
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API}/odin-book/users/${userid}/feed/?` + new URLSearchParams({
            secret_token: token,
        }), {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        }).then((response) => {
            return response.json();
        }).then((data) => {
            setFeedPosts(data.feedPosts)
        }).catch(error => {
            setError(error)
        }).finally(() => setLoading(false));
    }, [token, userid])

    if (error) return <p>A network error was encountered (error)</p>
    if (loading) return <Loading/> 
    return (
        <div className="feed">
            <AddPost userid={userid} token={token} />
            <h2 className="feedHeading">Feed</h2>
            {feedPosts.length ? feedPosts.map((post) => {
                return (
                    <Post className="post" key={post._id} userid={userid} token={token} postid={post._id} postUserId={post.user._id} postUsername={post.user.username} postTimestamp={post.timestamp_formatted} postText={post.text} postUserImage={post.user.profile_image} postImage={post.post_image} postLikes={post.likes} />
                )
            }) : (
                <div className='noPosts'>There are no posts in your feed</div>
            )}
        </div>
    )  
}

export default Feed;