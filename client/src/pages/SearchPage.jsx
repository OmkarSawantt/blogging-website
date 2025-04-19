import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Loader from '../components/Loader';
import axios from 'axios';
import PostItem from '../components/PostItem';

const SearchPage = () => {
    const location = useLocation();
    const searchTerm = String(location.state);
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            setError(null);  // Reset error state before making a request
            
            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_BASE_URL}/posts/search`,
                    { text: searchTerm },  // Send JSON object instead of FormData
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                );
                setPosts(response.data);
            } catch (err) {
                console.error("Error fetching posts:", err);
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, [searchTerm]);

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return <div className="error">An error occurred: {error.message}</div>;
    }

    return (
        <section className="posts">
            {posts.length > 0 ? (
                <div className="container posts__container">
                    {posts.map(({ _id: id, thumbnail, category, title, description, creator, createdAt }) => (
                        <PostItem
                            key={id}
                            postID={id}
                            thumbnail={thumbnail}
                            category={category}
                            title={title}
                            description={description}
                            authorID={creator}
                            createdAt={createdAt}
                        />
                    ))}
                </div>
            ) : (
                <h2 className="center">No Post Found</h2>
            )}
        </section>
    );
};

export default SearchPage;
