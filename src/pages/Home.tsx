import { useEffect, useState } from 'react';
import { Post, subscribeToPosts, deletePost } from '../services/PostService';
import CreatePost from '../components/CreatePost';
import PostList from '../components/PostList';

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToPosts((newPosts) => {
      setPosts(newPosts);
    });

    return () => unsubscribe();
  }, []);

  const handleDeletePost = async (postId: string) => {
    try {
      await deletePost(postId);
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <CreatePost />
      <PostList posts={posts} onDeletePost={handleDeletePost} />
    </div>
  );
};

export default Home;

