import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function executeSql(client: SupabaseClient, query: string) {
  const { data, error } = await client.rpc('exec_sql', { query });
  if (error) throw error;
  return data;
}

async function runMigration() {
  try {
    const migrationSQL = fs.readFileSync(
      path.join(__dirname, '../supabase/migrations/20250311_schema_updates.sql'),
      'utf8'
    );

    // Create exec_sql function if it doesn't exist
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION exec_sql(query text)
      RETURNS void AS $$
      BEGIN
        EXECUTE query;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;

    console.log('Creating exec_sql function...');
    await supabase.rpc('exec_sql', { query: createFunctionSQL }).catch(() => {
      // Function might already exist, continue
      console.log('Function may already exist, continuing...');
    });

    console.log('Running migration...');
    await executeSql(supabase, migrationSQL);
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
