'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Comment {
  id: number;
  content: string;
  author_name: string;
  created_at: string;
}

export default function CommentSection({ articleId }: { articleId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');

  useEffect(() => {
    // Fetch comments on mount
    fetchComments();
  }, []);

  const fetchComments = async () => {
    const { data: comments, error } = await supabase
      .from('comments')
      .select('*')
      .eq('article_id', articleId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      return;
    }

    setComments(comments || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim() || !authorName.trim()) {
      return;
    }

    const { error } = await supabase
      .from('comments')
      .insert([
        {
          content: newComment.trim(),
          author_name: authorName.trim(),
          article_id: articleId,
        },
      ]);

    if (error) {
      console.error('Error inserting comment:', error);
      return;
    }

    // Clear form and refresh comments
    setNewComment('');
    setAuthorName('');
    fetchComments();
  };

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Comments</h2>
          
          {/* Comment form */}
          <form onSubmit={handleSubmit} className="mt-12 space-y-6">
            <div>
              <label htmlFor="author" className="block text-sm font-medium leading-6 text-gray-900">
                Name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="author"
                  id="author"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="comment" className="block text-sm font-medium leading-6 text-gray-900">
                Add your comment
              </label>
              <div className="mt-2">
                <textarea
                  rows={4}
                  name="comment"
                  id="comment"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Post comment
              </button>
            </div>
          </form>

          {/* Comments list */}
          <div className="mt-16 space-y-6 divide-y divide-gray-100">
            {comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-0">
                <h3 className="font-medium text-gray-900 text-lg">
                  {comment.author_name}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}