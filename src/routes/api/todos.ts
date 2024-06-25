import type { RequestHandler } from '@sveltejs/kit';
import { query } from '$lib/db';
import { json } from '@sveltejs/kit';

// Get all todos
export const get: RequestHandler = async () => {
    const res = await query('SELECT * FROM todos ORDER BY id ASC');
    const body = JSON.stringify({ todos: res.rows });
    return new Response(body, {
      status: 200,
    });
  };

// Create a new todo
export const post: RequestHandler = async ({ request }) => {
    const { title } = await request.json();
    const res = await query('INSERT INTO todos (title) VALUES ($1) RETURNING *', [title]);
    const body = JSON.stringify({  todo: res.rows[0]  });
    return new Response(body, {
      status: 201,
    });
};

// Update a todo
export const put: RequestHandler = async ({ request }) => {
    const { id, title, completed } = await request.json();
    const res = await query('UPDATE todos SET title = $1, completed = $2 WHERE id = $3 RETURNING *', [title, completed, id]);
    const body = JSON.stringify({  todo: res.rows[0]  });
    return new Response(body, {
      status: 200,
    });
};

// Delete a todo
export const del: RequestHandler = async ({ request }) => {
    const { id } = await request.json();
    await query('DELETE FROM todos WHERE id = $1', [id]);
    return json(204);
};
