import React, { useEffect, useState } from 'react';
import { getCommunityPosts, createPost } from '../mockService';
import { Post } from '../types';

export const Community = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newContent, setNewContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    refresh();
  }, []);

  const refresh = () => getCommunityPosts().then(setPosts);

  const handleSubmit = async () => {
    if (!newContent) return;
    setIsPosting(true);
    await createPost({
      userId: 'me',
      userName: 'Guest User',
      content: newContent,
      locationTag: 'Pakistan'
    });
    setNewContent('');
    setIsPosting(false);
    refresh();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Traveler Community</h1>
      
      {/* Create Post */}
      <div className="bg-white p-4 rounded-xl shadow border mb-8">
        <textarea 
          className="w-full border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
          rows={3}
          placeholder="Share your experience..."
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
        />
        <div className="flex justify-between items-center mt-2">
          <button className="text-sm text-gray-500 hover:text-emerald-600">📷 Add Photo</button>
          <button 
            onClick={handleSubmit}
            disabled={isPosting}
            className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
          >
            {isPosting ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-5 rounded-xl shadow border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                {post.userName.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">{post.userName}</h4>
                <p className="text-xs text-gray-400">{new Date(post.timestamp).toLocaleDateString()}</p>
              </div>
            </div>
            <p className="text-gray-700 mb-3">{post.content}</p>
            {post.locationTag && (
              <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded">📍 {post.locationTag}</span>
            )}
            <div className="mt-4 pt-3 border-t flex gap-4 text-sm text-gray-500">
              <button className="hover:text-emerald-600">❤️ {post.likes} Likes</button>
              <button className="hover:text-emerald-600">💬 Comment</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
