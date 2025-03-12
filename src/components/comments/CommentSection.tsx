'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Comment {
  id: number;
  article_id: number;
  commenter_name: string;
  content: string;
  created_at: string;
}

interface CommentSectionProps {
  articleId: number;
  initialComments: Comment[];
}

export default function CommentSection({ articleId, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim() || isSubmitting) return;

    setIsSubmitting(true);

    const { data, error } = await supabase
      .from('comments')
      .insert({
        article_id: articleId,
        commenter_name: name.trim(),
        content: content.trim()
      })
      .select()
      .single();

    if (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to submit comment. Please try again.');
    } else if (data) {
      setComments(prev => [data as Comment, ...prev]);
      setName('');
      setContent('');
    }

    setIsSubmitting(false);
  };

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-8">Comments</h2>

      <form onSubmit={handleSubmit} className="mb-12">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
            Comment
          </label>
          <textarea
            id="comment"
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Comment'}
        </button>
      </form>

      <div className="space-y-6">
        {comments.map(comment => (
          <div key={comment.id} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-900">{comment.commenter_name}</h3>
              <time className="text-sm text-gray-500">
                {new Date(comment.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
            <p className="text-gray-700">{comment.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
}