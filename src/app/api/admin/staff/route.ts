import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
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
