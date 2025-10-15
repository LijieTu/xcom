import { useEffect, useState } from 'react';
import { Post, subscribeToPosts, deletePost } from '../services/PostService';
import CreatePost from '../components/CreatePost';
import PostList from '../components/PostList';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const { currentUser } = useAuth();

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
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main content - Posts feed */}
        <div className="flex-1 lg:order-1 order-2">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Posts</h2>
          <PostList posts={posts} onDeletePost={handleDeletePost} />
        </div>

        {/* Sidebar - Create post (only show if logged in) */}
        {currentUser && (
          <div className="lg:w-96 lg:order-2 order-1">
            <div className="lg:sticky lg:top-4">
              <CreatePost />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

