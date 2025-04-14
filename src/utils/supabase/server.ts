// @ts-nocheck
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: { path: string; maxAge: number }) {
          try {
            cookieStore.set({ name, value, ...options });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (e) {
            // Handle cookie error
          }
        },
        remove(name: string, options: { path: string }) {
          try {
            cookieStore.delete({ name, ...options });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (e) {
            // Handle cookie error
          }
        },
      },
    }
  );
} 