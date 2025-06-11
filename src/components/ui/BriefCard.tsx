"use client";
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'; // For animation

// Define the structure of a policy brief object, matching your Supabase table
import { Author } from '../../lib/supabase';

// Define the structure of a brief object, matching your Supabase table
export interface Brief {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  summary?: string | null;
  image_url?: string | null;
  file_url: string;
  author: Author | null;
  department?: string | null;
  published?: boolean;
  display_order?: number | null;
}

interface BriefCardProps {
  brief: Brief;
}

export default function BriefCard({ brief }: BriefCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // This effect helps trigger the animation once the component is mounted
    // and the image URL is present.
    if (brief.image_url) {
      const img = new (window as any).Image();
      img.src = brief.image_url;
      img.onload = () => {
        setImageLoaded(true);
      };
      // Check if image is already complete (e.g. cached)
      if (img.complete) {
        setImageLoaded(true);
      } else {
        // Fallback timeout if onload still doesn't fire for some reason
        const timer = setTimeout(() => setImageLoaded(true), 200);
        // Cleanup timer on component unmount or if brief.image_url changes
        return () => clearTimeout(timer);
      }
    } else {
      setImageLoaded(true); // No image to load, consider animation complete
    }
  }, [brief.image_url]);

  // Placeholder for category if not provided by brief data
  const displayCategory = brief.department || "POLICY AREA";
  const displayAuthor = brief.author ? `${brief.author.first_name} ${brief.author.last_name}` : "Staff Writer";

  // Sanitize title for use as a filename (basic example)
  const sanitizedTitle = brief.title?.replace(/[^a-zA-Z0-9_-]/g, '').replace(/\s+/g, '_');
  // Attempt to get file extension from URL, default to .pdf if not found
  const fileExtension = brief.file_url.split('.').pop() || 'pdf';
  const downloadFilename = sanitizedTitle ? `${sanitizedTitle}.${fileExtension}` : `policy_brief.${fileExtension}`;


  return (
    <div className="flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden h-full">
      {brief.image_url && (
        <div className="relative w-full aspect-[16/9] overflow-hidden"> {/* Common aspect ratio for images */}
          <Image
            src={brief.image_url}
            alt={brief.title || 'Brief Image'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transition-transform duration-[2500ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${
              imageLoaded ? 'scale-100' : 'scale-175' // Updated scale, duration, and easing
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
          IN {displayCategory} <span className="text-slate-500">BY</span> {displayAuthor}
        </p>
        {brief.summary && (
          <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-grow"> {/* line-clamp limits description lines */}
            {brief.summary}
          </p>
        )}
        {/* Spacer to push button to bottom if description is short */}
        {!brief.summary && <div className="flex-grow"></div>}
      </div>
      <div className="p-5 pt-0 mt-auto"> {/* mt-auto pushes this to the bottom */}
        <Link
          href={brief.file_url}
          target="_blank"
          rel="noopener noreferrer"
          download={downloadFilename} // Added download attribute with a generated filename
          className="block w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-lg text-center text-sm transition-colors duration-200"
        >
          Download Brief &rarr; {/* Updated text */}
        </Link>
      </div>
    </div>
  );
}
