import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching projects:', error);
      return Response.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }

    return Response.json(data || []);
  } catch (error) {
    console.error('Error in GET /api/projects:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (token !== process.env.ADMIN_TOKEN) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, image, category } = body;

    if (!name || !image) {
      return Response.json({ error: 'Name and image are required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('projects')
      .insert({ name, description, image, category })
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
      return Response.json({ error: 'Failed to create project' }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    console.error('Error in POST /api/projects:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
