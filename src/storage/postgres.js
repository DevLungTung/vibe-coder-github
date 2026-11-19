import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export const postgresStorage = {
  async getAll() {
    const result = await pool.query('SELECT * FROM todos ORDER BY id');
    return result.rows;
  },

  async getById(id) {
    const result = await pool.query('SELECT * FROM todos WHERE id = $1', [id]);
    return result.rows[0];
  },

  async create(todoData) {
    const result = await pool.query(
      'INSERT INTO todos (title, done) VALUES ($1, $2) RETURNING *',
      [todoData.title, todoData.done || false]
    );
    return result.rows[0];
  },

  async update(id, todoData) {
    const result = await pool.query(
      'UPDATE todos SET title = COALESCE($1, title), done = COALESCE($2, done) WHERE id = $3 RETURNING *',
      [todoData.title, todoData.done, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query('DELETE FROM todos WHERE id = $1', [id]);
    return result.rowCount > 0;
  }
};
