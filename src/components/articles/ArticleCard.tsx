import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import type { Article } from '@/lib/supabase';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export default function ArticleCard({ article, featured = false }: ArticleCardProps) {
  return (
    <div className={`group relative flex flex-col ${featured ? 'col-span-2 row-span-2' : ''}`}>
      <div className="relative w-full overflow-hidden rounded-lg">
        <Link href={`/articles/${article.id}`}>
          <Image
            src={article.cover_image_url}
            alt={article.title}
            width={featured ? 800 : 400}
            height={featured ? 450 : 225}
            className="h-[225px] w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </Link>
      </div>
      <div className="mt-4 flex flex-col">
        <div className="flex items-center gap-x-2">
          {article.tags?.map((tag) => (
            <Link
              key={tag.id}
              href={`/tags/${tag.name}`}
              className="text-xs font-medium text-blue-600 hover:text-blue-800"
            >
              {tag.name}
            </Link>
          ))}
          <span className="text-xs text-gray-500">
            {format(new Date(article.published_at), 'MMM d, yyyy')}
          </span>
        </div>
        <Link href={`/articles/${article.id}`} className="mt-2 group-hover:underline">
          <h3 className={`font-semibold text-gray-900 ${featured ? 'text-2xl' : 'text-lg'}`}>
            {article.title}
          </h3>
        </Link>
        {article.authors && article.authors.length > 0 && (
          <div className="mt-4 flex items-center gap-x-2">
            {article.authors.map((author) => (
              <Link key={author.id} href={`/authors/${author.id}`} className="flex items-center">
                <Image
                  src={author.image_url}
                  alt={`${author.first_name} ${author.last_name}`}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="ml-2 text-sm text-gray-600 hover:text-gray-900">
                  {author.first_name} {author.last_name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 