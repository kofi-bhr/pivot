import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Try to get staff ordered by display_order first
    const staffQuery = supabase
      .from('staff')
      .select('*');
    
    try {
      // Try to order by display_order
      const { data: staff, error } = await staffQuery
        .order('display_order', { ascending: true });
      
      if (!error) {
        return NextResponse.json(staff);
      }
    } catch (orderError) {
      console.error('Error ordering by display_order, falling back to last_name:', orderError);
    }
    
    // Fallback to ordering by last_name if display_order doesn't exist
    const { data: staff, error } = await supabase
      .from('staff')
      .select('*')
      .order('last_name');

    if (error) {
      throw error;
    }

    return NextResponse.json(staff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json(
      { error: 'Failed to fetch staff' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { 
      first_name, 
      last_name, 
      title, 
      department, 
      image_url, 
      bio, 
      contact_email,
      linkedin_url,
      personal_site_url
    } = data;

    if (!first_name || !last_name || !title) {
      return NextResponse.json(
        { error: 'First name, last name, and title are required' },
        { status: 400 }
      );
    }

    const { data: staffMember, error } = await supabase
      .from('staff')
      .insert({ 
        first_name, 
        last_name, 
        title, 
        department, 
        image_url, 
        bio, 
        contact_email,
        linkedin_url,
        personal_site_url
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(staffMember);
  } catch (error) {
    console.error('Error creating staff member:', error);
    return NextResponse.json(
      { error: 'Failed to create staff member' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Staff ID is required' },
        { status: 400 }
      );
    }
    
    const data = await request.json();
    const { 
      first_name, 
      last_name, 
      title, 
      department, 
      image_url, 
      bio, 
      contact_email,
      linkedin_url,
      personal_site_url,
      is_visible
    } = data;

    if (!first_name || !last_name || !title) {
      return NextResponse.json(
        { error: 'First name, last name, and title are required' },
        { status: 400 }
      );
    }

    const { data: staffMember, error } = await supabase
      .from('staff')
      .update({ 
        first_name, 
        last_name, 
        title, 
        department, 
        image_url, 
        bio, 
        contact_email,
        linkedin_url,
        personal_site_url,
        is_visible,
        updated_at: new Date()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(staffMember);
  } catch (error) {
    console.error('Error updating staff member:', error);
    return NextResponse.json(
      { error: 'Failed to update staff member' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const data = await request.json();
    const { staffIds } = data;
    
    if (!staffIds || !Array.isArray(staffIds)) {
      return NextResponse.json(
        { error: 'Staff IDs array is required' },
        { status: 400 }
      );
    }
    
    // Check if display_order column exists
    try {
      // Try to update the first staff member to test if the column exists
      const testUpdate = await supabase
        .from('staff')
        .update({ display_order: 1 })
        .eq('id', staffIds[0]);
      
      if (testUpdate.error && testUpdate.error.message.includes('column "display_order" of relation "staff" does not exist')) {
        // Column doesn't exist, return a more helpful error
        return NextResponse.json(
          { 
            error: 'The display_order column does not exist in the staff table. Please run the database migration first.',
            details: 'Migration file: 20250403_add_display_order_to_staff.sql'
          },
          { status: 500 }
        );
      }
      
      // If we get here, the column exists, proceed with updates
      const updates = staffIds.map((id, index) => {
        return supabase
          .from('staff')
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
    console.error('Error updating staff order:', error);
    return NextResponse.json(
      { error: 'Failed to update staff order' },
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
        { error: 'Staff ID is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('staff')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting staff member:', error);
    return NextResponse.json(
      { error: 'Failed to delete staff member' },
      { status: 500 }
    );
  }
}
