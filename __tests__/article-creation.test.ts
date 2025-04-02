import { createClient } from '@supabase/supabase-js';
import { describe, expect, test, beforeAll, afterAll } from '@jest/globals';
import fetch from 'node-fetch';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test data
let testAuthorId: string;

describe('Article Creation Tests', () => {
  // Setup - create a test author before running tests
  beforeAll(async () => {
    const { data: author, error } = await supabase
      .from('authors')
      .insert({
        first_name: 'Test',
        last_name: 'Author',
        email: 'test@example.com'
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create test author: ${error.message}`);
    }

    testAuthorId = author.id;
  });

  // Cleanup - delete the test author after tests
  afterAll(async () => {
    // First delete any articles created by the test author
    const { data: articles } = await supabase
      .from('articles')
      .select('id')
      .eq('author_id', testAuthorId);
    
    if (articles && articles.length > 0) {
      for (const article of articles) {
        // Delete article_tags relationships
        await supabase
          .from('article_tags')
          .delete()
          .eq('article_id', article.id);
        
        // Delete the article
        await supabase
          .from('articles')
          .delete()
          .eq('id', article.id);
      }
    }

    // Delete the test author
    await supabase
      .from('authors')
      .delete()
      .eq('id', testAuthorId);
  });

  test('should create an article with required fields only', async () => {
    const articleData = {
      title: 'Test Article - Required Fields Only',
      content: 'This is a test article content.',
      author_id: testAuthorId,
      is_visible: false
    };

    // Test direct Supabase insertion
    const { data: article, error } = await supabase
      .from('articles')
      .insert({
        title: articleData.title,
        content: articleData.content,
        author_id: articleData.author_id,
        is_visible: articleData.is_visible
      })
      .select()
      .single();

    expect(error).toBeNull();
    expect(article).toBeDefined();
    expect(article.title).toBe(articleData.title);
    expect(article.content).toBe(articleData.content);
    expect(article.author_id).toBe(testAuthorId);
    expect(article.is_visible).toBe(false);
  });

  test('should create an article with all fields', async () => {
    const articleData = {
      title: 'Test Article - All Fields',
      content: 'This is a test article with all fields filled.',
      cover_image_url: 'https://example.com/image.jpg',
      author_id: testAuthorId,
      is_visible: true,
      tags: ['test', 'article', 'all-fields']
    };

    // Test direct Supabase insertion
    const { data: article, error } = await supabase
      .from('articles')
      .insert({
        title: articleData.title,
        content: articleData.content,
        cover_image_url: articleData.cover_image_url,
        author_id: articleData.author_id,
        is_visible: articleData.is_visible,
        tags: articleData.tags,
        published_at: articleData.is_visible ? new Date().toISOString() : null
      })
      .select()
      .single();

    expect(error).toBeNull();
    expect(article).toBeDefined();
    expect(article.title).toBe(articleData.title);
    expect(article.content).toBe(articleData.content);
    expect(article.cover_image_url).toBe(articleData.cover_image_url);
    expect(article.author_id).toBe(testAuthorId);
    expect(article.is_visible).toBe(true);
    expect(article.published_at).not.toBeNull();
    
    // Check if tags were stored correctly
    expect(Array.isArray(article.tags)).toBe(true);
    expect(article.tags).toEqual(expect.arrayContaining(articleData.tags));
  });

  test('should reject article creation without required fields', async () => {
    // Missing title
    const { data: article1, error: error1 } = await supabase
      .from('articles')
      .insert({
        content: 'Test content',
        author_id: testAuthorId
      })
      .select()
      .single();

    expect(error1).not.toBeNull();
    
    // Missing content
    const { data: article2, error: error2 } = await supabase
      .from('articles')
      .insert({
        title: 'Test title',
        author_id: testAuthorId
      })
      .select()
      .single();

    expect(error2).not.toBeNull();
    
    // Missing author_id
    const { data: article3, error: error3 } = await supabase
      .from('articles')
      .insert({
        title: 'Test title',
        content: 'Test content'
      })
      .select()
      .single();

    expect(error3).not.toBeNull();
  });
});
