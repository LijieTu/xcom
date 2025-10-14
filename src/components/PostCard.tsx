import { useState } from 'react';
import { Post } from '../services/PostService';
import { useAuth } from '../contexts/AuthContext';
import EditPost from './EditPost';

interface PostCardProps {
  post: Post;
  onDelete: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onDelete }) => {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const isAuthor = currentUser?.uid === post.authorId;
  
  const formatDate = (timestamp: any) => {
    if (timestamp?.toDate) {
      return timestamp.toDate().toLocaleString();
    }
    return 'Unknown date';
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      onDelete(post.id);
    }
  };

  if (isEditing) {
    return <EditPost post={post} onCancel={() => setIsEditing(false)} />;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-2xl font-bold text-gray-800">{post.title}</h2>
        {isAuthor && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Delete
            </button>
          </div>
        )}
      </div>
      <div className="flex gap-3 text-sm text-gray-600 mb-4">
        <span className="font-medium">{post.author}</span>
        <span>|</span>
        <span>{formatDate(post.timestamp)}</span>
      </div>
      <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
    </div>
  );
};

export default PostCard;

