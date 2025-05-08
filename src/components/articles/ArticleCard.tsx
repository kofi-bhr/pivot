import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import type { Article } from '@/lib/supabase';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export default function ArticleCard({ article, featured = false }: ArticleCardProps) {
  // Function to truncate text and strip HTML tags
  const truncateText = (text: string | null | undefined, maxLength: number = 120): string => {
    if (!text) return '';
    // Strip HTML tags
    const strippedText = text.replace(/<[^>]*>/g, '');
    return strippedText.length > maxLength ? strippedText.substring(0, maxLength) + '...' : strippedText;
  };

  // Format the date safely
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return '';
    }
  };

  return (
    <div className={`group relative flex flex-col h-full ${featured ? 'col-span-2 row-span-2' : ''}`}>
      <div className="relative w-full overflow-hidden rounded-lg">
        <Link href={`/articles/${article.id}`}>
          {article.cover_image_url ? (
            <div className="relative h-[225px] w-full">
              <Image
                src={article.cover_image_url}
                alt={article.title}
                fill
                className="object-cover transition duration-300 group-hover:scale-105"
              />
            </div>
          ) : (
            <div className="h-[225px] w-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </Link>
      </div>
      <div className="mt-4 flex flex-col flex-grow">
        <div className="flex items-center gap-x-2 mb-2">
          {article.tags && article.tags.length > 0 && article.tags.map((tag, index) => (
            <Link
              key={index}
              href={`/topics/${encodeURIComponent(tag)}`}
              className="text-xs font-medium text-blue-600 hover:text-blue-800"
            >
              {tag}
            </Link>
          ))}
          <span className="text-xs text-gray-500">
            {formatDate(article.published_at)}
          </span>
        </div>
        <Link href={`/articles/${article.id}`} className="mt-2 group-hover:underline">
          <h3 className={`font-semibold text-gray-900 ${featured ? 'text-2xl' : 'text-lg'} mb-3`}>
            {article.title}
          </h3>
        </Link>
        
        {article.content && (
          <p className="text-gray-600 text-sm mb-4 text-justify leading-relaxed">
            {truncateText(article.content)}
            {article.content.length > 120 && (
              <Link href={`/articles/${article.id}`}>
                <span className="font-bold ml-1" style={{ color: '#293A4A' }}>READ MORE</span>
              </Link>
            )}
          </p>
        )}
        
        {article.author && (
          <div className="mt-auto flex items-center gap-x-3">
            <Link href={`/authors/${article.author.id}`} className="flex items-center">
              <div className="flex-shrink-0">
                {article.author.image_url ? (
                  <div className="relative w-10 h-10 overflow-hidden rounded-full">
                    <Image
                      src={article.author.image_url}
                      alt={`${article.author.first_name || ''} ${article.author.last_name || ''}`}
                      width={40}
                      height={40}
                      className="object-cover"
                      style={{ borderRadius: '50%' }}
                      onError={(e) => {
                        // Fallback to initials if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        if (target.parentElement) {
                          target.parentElement.classList.add('bg-gray-200', 'flex', 'items-center', 'justify-center');
                          const span = document.createElement('span');
                          span.className = 'text-xs text-gray-500';
                          const firstName = article.author?.first_name || '';
                          const lastName = article.author?.last_name || '';
                          span.innerText = `${firstName.charAt(0)}${lastName.charAt(0)}`;
                          target.parentElement.appendChild(span);
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-gray-200 flex items-center justify-center rounded-full">
                    <span className="text-xs text-gray-500">
                      {article.author.first_name?.charAt(0) || ''}{article.author.last_name?.charAt(0) || ''}
                    </span>
                  </div>
                )}
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <span className="text-sm font-medium text-gray-600 hover:text-gray-900 truncate">
                  {article.author.first_name || ''} {article.author.last_name || ''}
                </span>
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}