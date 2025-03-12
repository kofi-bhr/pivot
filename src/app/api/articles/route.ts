import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { Tag } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { title, content, summary, coverImage, tags: tagString, author_id } = data;

    if (!title || !content || !author_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create article
    const { data: article, error: articleError } = await supabase
      .from('articles')
      .insert({
        title,
        content,
        excerpt: summary,
        cover_image_url: coverImage,
        author_id,
        status: 'draft'
      })
      .select()
      .single();

    if (articleError) {
      console.error('Error creating article:', articleError);
      return NextResponse.json(
        { error: 'Failed to create article' },
        { status: 500 }
      );
    }

    // Handle tags if provided
    if (tagString) {
      const tags = tagString.split(',').map((tag: string) => tag.trim());
      
      for (const tagName of tags) {
        // Get or create tag
        const { data: existingTag, error: tagError } = await supabase
          .from('tags')
          .select()
          .eq('name', tagName)
          .single();

        if (tagError && tagError.code !== 'PGRST116') { // PGRST116 is "not found"
          console.error('Error finding tag:', tagError);
          continue;
        }

        let tagId: number;
        if (!existingTag) {
          const { data: newTag, error: createTagError } = await supabase
            .from('tags')
            .insert({ name: tagName })
            .select()
            .single();

          if (createTagError) {
            console.error('Error creating tag:', createTagError);
            continue;
          }
          tagId = newTag.id;
        } else {
          tagId = existingTag.id;
        }

        // Create article-tag relationship
        const { error: relationError } = await supabase
          .from('article_tags')
          .insert({
            article_id: article.id,
            tag_id: tagId
          });

        if (relationError) {
          console.error('Error creating article-tag relationship:', relationError);
        }
      }
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data: articles, error } = await supabase
      .from('articles')
      .select(`
        *,
        author:author_id(*),
        tags:article_tags(
          tag:tag_id(*)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}
