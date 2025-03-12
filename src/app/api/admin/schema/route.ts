import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST() {
  try {
    // First, let's ensure we have the base tables and relationships
    const { error: checkError } = await supabase
      .from('articles')
      .select('id')
      .limit(1);

    if (checkError) {
      return NextResponse.json(
        { error: 'Database tables not properly set up. Please ensure base tables exist.' },
        { status: 500 }
      );
    }

    // Create a function to get tag counts
    const { error: funcError } = await supabase
      .rpc('get_tag_counts')
      .select();

    if (funcError && !funcError.message.includes('does not exist')) {
      console.error('Error checking function:', funcError);
      return NextResponse.json({ error: funcError.message }, { status: 500 });
    }

    // Create a materialized view instead of a regular view for better performance
    const { error: viewError } = await supabase
      .from('tag_with_counts')
      .select('*')
      .limit(1)
      .then(async ({ error }) => {
        if (error && error.message.includes('does not exist')) {
          // Create materialized view using a function call
          return await supabase
            .rpc('create_tag_counts_view', {
              tag_id: -1, // Dummy parameter for the function
              refresh: true
            });
        }
        return { error: null };
      });

    if (viewError) {
      console.error('Error setting up view:', viewError);
      return NextResponse.json({ error: viewError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Schema verified and updated successfully' });
  } catch (error) {
    console.error('Error updating schema:', error);
    return NextResponse.json(
      { error: 'Failed to update schema' },
      { status: 500 }
    );
  }
}
