#!/bin/bash

# Check for required environment variables
if [ -z "$SUPABASE_DB_HOST" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "Error: Required environment variables not set"
    echo "Please ensure SUPABASE_DB_HOST and SUPABASE_SERVICE_ROLE_KEY are set"
    exit 1
fi

# Apply the migration
PGPASSWORD="$SUPABASE_SERVICE_ROLE_KEY" /opt/homebrew/opt/postgresql@14/bin/psql \
    -h "$SUPABASE_DB_HOST" \
    -p 5432 \
    -d postgres \
    -U "postgres.nxpqrfbdumnouztbdcqk" \
    -f ./supabase/migrations/20250311_schema_updates.sql
