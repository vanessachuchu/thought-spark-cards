import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, notionApiToken, notionDatabaseId, todos } = await req.json();
    
    console.log('Notion sync request:', { action });

    if (!notionApiToken || !notionDatabaseId) {
      throw new Error('Notion API token and database ID are required');
    }

    switch (action) {
      case 'sync-todos-to-notion':
        return await syncTodosToNotion(notionApiToken, notionDatabaseId, todos);
      case 'get-todos-from-notion':
        return await getTodosFromNotion(notionApiToken, notionDatabaseId);
      case 'test-connection':
        return await testNotionConnection(notionApiToken, notionDatabaseId);
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    console.error('Error in notion-sync function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function testNotionConnection(notionApiToken: string, notionDatabaseId: string) {
  console.log('Testing Notion connection...');
  
  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${notionDatabaseId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${notionApiToken}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Notion API error:', errorText);
      throw new Error(`Notion API error: ${response.status} - ${errorText}`);
    }

    const database = await response.json();
    console.log('Notion connection successful:', database.title);

    return new Response(JSON.stringify({ 
      success: true, 
      database: {
        id: database.id,
        title: database.title?.[0]?.plain_text || 'Untitled',
        url: database.url
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Notion connection test failed:', error);
    throw error;
  }
}

async function syncTodosToNotion(notionApiToken: string, notionDatabaseId: string, todos: any[]) {
  console.log('Syncing todos to Notion:', todos.length);
  
  const results = [];
  
  for (const todo of todos) {
    try {
      const notionPage = {
        parent: { database_id: notionDatabaseId },
        properties: {
          'Name': {
            title: [
              {
                text: {
                  content: todo.content || 'Untitled'
                }
              }
            ]
          },
          'Status': {
            select: {
              name: todo.done ? 'Done' : 'Not started'
            }
          },
          'Created time': {
            created_time: {}
          }
        }
      };

      // Add scheduled date if available
      if (todo.scheduledDate) {
        notionPage.properties['Date'] = {
          date: {
            start: todo.scheduledDate
          }
        };
      }

      const response = await fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${notionApiToken}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28',
        },
        body: JSON.stringify(notionPage),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to create Notion page for todo:', todo.id, errorText);
        results.push({ id: todo.id, success: false, error: errorText });
      } else {
        const createdPage = await response.json();
        console.log('Created Notion page for todo:', todo.id, createdPage.id);
        results.push({ id: todo.id, success: true, notionPageId: createdPage.id });
      }
    } catch (error) {
      console.error('Error syncing todo to Notion:', todo.id, error);
      results.push({ id: todo.id, success: false, error: error.message });
    }
  }

  return new Response(JSON.stringify({ results }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getTodosFromNotion(notionApiToken: string, notionDatabaseId: string) {
  console.log('Getting todos from Notion...');
  
  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${notionDatabaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionApiToken}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({
        sorts: [
          {
            property: 'Created time',
            direction: 'descending'
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to query Notion database:', errorText);
      throw new Error(`Notion API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Retrieved Notion pages:', data.results.length);

    const todos = data.results.map((page: any) => {
      const properties = page.properties;
      
      return {
        id: `notion-${page.id}`,
        content: properties.Name?.title?.[0]?.plain_text || 'Untitled',
        done: properties.Status?.select?.name === 'Done',
        createdAt: properties['Created time']?.created_time || page.created_time,
        scheduledDate: properties.Date?.date?.start || null,
        notionPageId: page.id,
        notionUrl: page.url
      };
    });

    return new Response(JSON.stringify({ todos }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error getting todos from Notion:', error);
    throw error;
  }
}