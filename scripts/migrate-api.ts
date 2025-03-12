import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
const supabaseUrl = 'https://nxpqrfbdumnouztbdcqk.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigrations() {
  try {
    // Add tags column to authors
    console.log('Adding tags column to authors table...');
    await supabase.rpc('alter_authors_add_tags');
    
    // Add tags column to articles
    console.log('Adding tags column to articles table...');
    await supabase.rpc('alter_articles_add_tags');
    
    // Set author_id NOT NULL
    console.log('Setting author_id NOT NULL...');
    await supabase.rpc('set_author_id_not_null');
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
