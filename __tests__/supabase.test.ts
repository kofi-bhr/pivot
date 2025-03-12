import { createClient } from '@supabase/supabase-js';
import { describe, expect, test } from '@jest/globals';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

describe('Supabase Connection and Schema Tests', () => {
  test('should connect to Supabase', async () => {
    const { data, error } = await supabase.from('articles').select('count').limit(1);
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  test('should have correct tables', async () => {
    const expectedTables = ['articles', 'authors', 'tags', 'article_tags', 'comments'];
    
    for (const table of expectedTables) {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1);
      
      expect(error).toBeNull();
      expect(data).toBeDefined();
    }
  });

  test('should be able to create and delete test data', async () => {
    // Create test author
    const { data: author, error: authorError } = await supabase
      .from('authors')
      .insert({
        name: 'Test Author',
        role: 'tester'
      })
      .select()
      .single();

    expect(authorError).toBeNull();
    expect(author).toBeDefined();
    expect(author.name).toBe('Test Author');

    // Create test article
    const { data: article, error: articleError } = await supabase
      .from('articles')
      .insert({
        title: 'Test Article',
        content: 'Test Content',
        author_id: author.id,
        status: 'draft'
      })
      .select()
      .single();

    expect(articleError).toBeNull();
    expect(article).toBeDefined();
    expect(article.title).toBe('Test Article');

    // Cleanup
    const { error: deleteArticleError } = await supabase
      .from('articles')
      .delete()
      .eq('id', article.id);
    
    const { error: deleteAuthorError } = await supabase
      .from('authors')
      .delete()
      .eq('id', author.id);

    expect(deleteArticleError).toBeNull();
    expect(deleteAuthorError).toBeNull();
  });
});
