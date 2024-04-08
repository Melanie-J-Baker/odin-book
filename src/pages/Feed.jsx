import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';
import Loading from './Loading';
import Post from '../components/Post';
import AddPost from '../components/AddPost';
import '../styles/Feed.css';

Feed.propTypes = {
    token: PropTypes.string,
    userid: PropTypes.string,
}

function Feed({ token, userid }) {
    const fetchDone = useRef(false);
    const [feedPosts, setFeedPosts] = useState([]);

    useEffect(() => {
        if (fetchDone.current) return;
        const fetchData = () => {
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
            }).catch(error => console.log(error));
        }
        fetchData()
        fetchDone.current = true;
    }, [token, userid])

    return fetchDone.current ? (
        <div className="feed">
            <AddPost userid={userid} token={token} />
            <h2 className="feedHeading">Feed</h2>
            {feedPosts.map((post) => {
                return (
                    <Post className="post" key={post._id} userid={userid} token={token} postid={post._id} postUserImage={post.user.profile_image} postUsername={post.user.username} postTimestamp={post.timestamp_formatted} postText={post.text} postImage={post.post_image} postLikes={post.likes}/>
                )
            })}
        </div>
    ) : (
        <Loading/>
    )
            
}

export default Feed;