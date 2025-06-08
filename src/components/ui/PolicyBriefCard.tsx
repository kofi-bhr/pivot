"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react'; // For animation

// Define the structure of a policy brief object, matching your Supabase table
export interface PolicyBrief {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description?: string | null;
  image_url?: string | null;
  file_url: string;
  authors?: string[] | null; // Assuming this is an array of author names
  published_date?: string | null;
  display_order?: number | null;
  // Add a field for the category like "CRIMINAL JUSTICE", "PUBLIC HEALTH POLICY"
  // This should ideally come from your Supabase table.
  // For now, I'll add a placeholder. You'll need to add this to your Supabase table
  // and fetch it.
  category?: string | null;
}

interface PolicyBriefCardProps {
  brief: PolicyBrief;
}

export default function PolicyBriefCard({ brief }: PolicyBriefCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // This effect helps trigger the animation once the component is mounted
    // and the image URL is present.
    if (brief.image_url) {
      // Simulate image loading for animation trigger,
      // real Image `onLoad` will also set it.
      const img = new (window as any).Image();
      img.src = brief.image_url;
      img.onload = () => {
        setImageLoaded(true);
      };
      // Fallback if onload doesn't fire quickly (e.g. cached image)
      setTimeout(() => setImageLoaded(true), 50);
    } else {
      setImageLoaded(true); // No image to load, consider animation complete
    }
  }, [brief.image_url]);

  // Placeholder for category if not provided by brief data
  const displayCategory = brief.category || "POLICY AREA";
  const displayAuthors = brief.authors?.join(', ') || "Staff Writer";

  return (
    <div className="flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden h-full">
      {brief.image_url && (
        <div className="relative w-full aspect-[16/9] overflow-hidden"> {/* Common aspect ratio for images */}
          <Image
            src={brief.image_url}
            alt={brief.title || 'Policy Brief Image'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transition-transform duration-2000 ease-[cubic-bezier(0.25,1,0.5,1)] ${
              imageLoaded ? 'scale-100' : 'scale-150' // Increased initial scale, longer duration
            }`}
            onLoad={() => setImageLoaded(true)} // Ensure imageLoaded is true when image actually loads
            priority // If these cards are above the fold, consider adding priority
          />
        </div>
      )}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg md:text-xl font-semibold font-montserrat mb-2 text-slate-800 leading-tight">
          {brief.title}
        </h3>
        <p className="text-xs uppercase text-gray-700 font-semibold mb-2 tracking-wider">
          IN {displayCategory} <span className="text-slate-500">BY</span> {displayAuthors}
        </p>
        {brief.description && (
          <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-grow"> {/* line-clamp limits description lines */}
            {brief.description}
          </p>
        )}
        {/* Spacer to push button to bottom if description is short */}
        {!brief.description && <div className="flex-grow"></div>}
      </div>
      <div className="p-5 pt-0 mt-auto"> {/* mt-auto pushes this to the bottom */}
        <Link
          href={brief.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-lg text-center text-sm transition-colors duration-200"
        >
          Read Brief &rarr;
        </Link>
      </div>
    </div>
  );
}
