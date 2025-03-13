'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { generateKofiComment } from '@/lib/easterEggs';

interface Comment {
  id: number | string;
  article_id: number | string;
  commenter_name: string;
  content: string;
  created_at: string;
  is_easter_egg?: boolean;
}

interface CommentSectionProps {
  articleId: number | string;
  initialComments: Comment[];
}

export default function CommentSection({ articleId, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add Kofi's easter egg comment if chance hits
  useEffect(() => {
    const kofiComment = generateKofiComment(articleId);
    if (kofiComment) {
      // Insert Kofi's comment at a random position
      const position = Math.floor(Math.random() * (comments.length + 1));
      const newComments = [...comments];
      newComments.splice(position, 0, kofiComment);
      setComments(newComments);
    }
  }, [articleId, comments]);

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
    <section className="mt-12 border-t border-gray-200 pt-10">
      <h2 className="text-2xl font-bold mb-8 font-serif">Discussion</h2>

      <form onSubmit={handleSubmit} className="mb-12 bg-gray-50 p-6 rounded-lg border border-gray-100">
        <h3 className="text-lg font-medium mb-6 text-gray-800 font-serif">Leave a comment</h3>
        
        <div className="mb-5">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
            required
            placeholder="Your name"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
            Comment
          </label>
          <textarea
            id="comment"
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
            required
            placeholder="Share your thoughts..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 font-medium transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Comment'}
        </button>
      </form>

      {comments.length > 0 ? (
        <div className="space-y-8">
          {comments.map(comment => (
            <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-0">
              <div className="flex justify-between items-start mb-3">
                <h3 className={`font-medium text-gray-900 text-lg ${comment.is_easter_egg ? 'text-blue-600' : ''}`}>
                  {comment.commenter_name}
                </h3>
                <time className="text-sm text-gray-500">
                  {new Date(comment.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {comment.is_easter_egg ? (
                  <span>
                    {comment.content.includes('venturedglobal.org') ? (
                      <>
                        {comment.content.split('venturedglobal.org')[0]}
                        <a 
                          href="https://venturedglobal.org" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          venturedglobal.org
                        </a>
                        {comment.content.split('venturedglobal.org')[1]}
                      </>
                    ) : (
                      comment.content
                    )}
                  </span>
                ) : (
                  comment.content
                )}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </section>
  );
}