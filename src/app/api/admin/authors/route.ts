import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: authors, error } = await supabase
      .from('authors')
      .select('*')
      .order('name');

    if (error) {
      throw error;
    }

    return NextResponse.json(authors);
  } catch (error) {
    console.error('Error fetching authors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch authors' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, image_url, role } = data;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const { data: author, error } = await supabase
      .from('authors')
      .insert({ name, image_url, role })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(author);
  } catch (error) {
    console.error('Error creating author:', error);
    return NextResponse.json(
      { error: 'Failed to create author' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Author ID is required' },
        { status: 400 }
      );
    }

    // Check if author has any articles
    const { count, error: countError } = await supabase
      .from('articles')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', id);

    if (countError) {
      throw countError;
    }

    if (count && count > 0) {
      return NextResponse.json(
        { error: 'Cannot delete author with existing articles' },
        { status: 400 }
      );
    }

    // Delete the author
    const { error } = await supabase
      .from('authors')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting author:', error);
    return NextResponse.json(
      { error: 'Failed to delete author' },
      { status: 500 }
    );
  }
}
