import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';

interface ArticleContentProps {
  content: string;
}

export default function ArticleContent({ content }: ArticleContentProps) {
  // Parse the content as HTML if it's not already HTML
  // Just use the HTML content directly since we're storing HTML now
  const htmlContent = content;

  return (
    <div 
      className="prose prose-lg max-w-none whitespace-pre-wrap"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      style={{ tabSize: 4 }}
    />
  );
}
