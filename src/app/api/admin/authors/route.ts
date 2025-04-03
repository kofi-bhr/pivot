import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Try to get authors ordered by display_order first
    let authorsQuery = supabase
      .from('authors')
      .select('*');
    
    try {
      // Try to order by display_order
      const { data: authors, error } = await authorsQuery
        .order('display_order', { ascending: true });
      
      if (!error) {
        return NextResponse.json(authors);
      }
    } catch (orderError) {
      console.error('Error ordering by display_order, falling back to first_name:', orderError);
    }
    
    // Fallback to ordering by first_name if display_order doesn't exist
    const { data: authors, error } = await supabase
      .from('authors')
      .select('*')
      .order('first_name');

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
    const { first_name, last_name, image_url, description, display_order } = data;

    if (!first_name || !last_name) {
      return NextResponse.json(
        { error: 'First name and last name are required' },
        { status: 400 }
      );
    }

    const { data: author, error } = await supabase
      .from('authors')
      .insert({ 
        first_name, 
        last_name, 
        image_url, 
        description,
        display_order: display_order || 9999
      })
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

export async function PATCH(request: Request) {
  try {
    const data = await request.json();
    const { authorIds } = data;
    
    if (!authorIds || !Array.isArray(authorIds)) {
      return NextResponse.json(
        { error: 'Author IDs array is required' },
        { status: 400 }
      );
    }
    
    // Check if display_order column exists
    try {
      // Try to update the first author to test if the column exists
      const testUpdate = await supabase
        .from('authors')
        .update({ display_order: 1 })
        .eq('id', authorIds[0]);
      
      if (testUpdate.error && testUpdate.error.message.includes('column "display_order" of relation "authors" does not exist')) {
        // Column doesn't exist, return a more helpful error
        return NextResponse.json(
          { 
            error: 'The display_order column does not exist in the authors table. Please run the database migration first.',
            details: 'Migration file: 20250403_add_display_order_to_authors.sql'
          },
          { status: 500 }
        );
      }
      
      // If we get here, the column exists, proceed with updates
      const updates = authorIds.map((id, index) => {
        return supabase
          .from('authors')
          .update({ display_order: index + 1 })
          .eq('id', id);
      });
      
      // Execute all updates
      await Promise.all(updates);
      
      return NextResponse.json({ success: true });
    } catch (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error updating author order:', error);
    return NextResponse.json(
      { error: 'Failed to update author order' },
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
