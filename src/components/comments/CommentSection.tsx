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
          {/* Comment form section */}
          <div className="rounded-lg bg-[#7ED0E7] p-8 mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-white font-montserrat sm:text-4xl mb-8">Comments</h2>
            
            {/* Comment form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="author" className="block text-sm font-bold font-montserrat text-white">
                  Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="author"
                    id="author"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#7ED0E7] sm:text-sm sm:leading-6"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="comment" className="block text-sm font-bold font-montserrat text-white">
                  Add your comment
                </label>
                <div className="mt-2">
                  <textarea
                    rows={4}
                    name="comment"
                    id="comment"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#7ED0E7] sm:text-sm sm:leading-6"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="rounded-md bg-white px-3.5 py-2.5 text-sm font-bold font-montserrat text-[#7ED0E7] shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Post comment
                </button>
              </div>
            </form>
          </div>

          {/* Comments list */}
          <div className="rounded-lg bg-[#E1FFFE] p-8">
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="pb-6 last:pb-0 border-b border-[#7ED0E7] last:border-0">
                  <h3 className="font-bold font-montserrat text-[#7ED0E7] text-lg">
                    {comment.author_name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 font-montserrat">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}