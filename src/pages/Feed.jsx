import PropTypes from 'prop-types';
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

Feed.propTypes = {
    token: PropTypes.string,
    userid: PropTypes.string,
    username: PropTypes.string,
    profilePicture: PropTypes.string
}

function Feed({ token, userid, /*username, profilePicture*/ }) {
    const fetchDone = useRef(false);
    const [feedPosts, setFeedPosts] = useState([]);

    useEffect(() => {
        if (fetchDone.current) return;
        const fetchData = () => {
            fetch(`${import.meta.env.VITE_API}/odin-book/users/${userid}/feed?` + new URLSearchParams({
                secret_token: token,
            }), {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }).then((response) => {
                return response.json();
            }).then((data) => {
                console.log(data);
                setFeedPosts(data.feedPosts)
            }).catch(error => console.log(error));
            fetchDone.current = true;
        }
        fetchData()
    }, [token, userid])

    {
        feedPosts && (
            <div className="feed">
                <h2>Feed</h2>
                {feedPosts.map((post) => {
                    return (
                        <div key={post._id} className="post" id={post._id}>
                            <div className="postText">{post.text}</div>
                            <div className="postTimestamp">{post.timestamp_formatted}</div>
                            <img src={post.post_image} alt="Post Image" className='postImage' />
                            <div className="postLikes"></div>
                            <Link className='postLink' id='goToPost' to={`/odin-book/users/${userid}/posts/${post._id}`}>See post</Link>
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default Feed;