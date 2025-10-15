import { Post } from '../services/PostService';
import PostCard from './PostCard';

interface PostListProps {
  posts: Post[];
  onDeletePost: (postId: string) => void;
}

const PostList: React.FC<PostListProps> = ({ posts, onDeletePost }) => {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No posts yet. Be the first to post!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onDelete={onDeletePost} />
      ))}
    </div>
  );
};

export default PostList;

