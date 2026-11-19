import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const UNIQUE_VIOLATION = '23505';
const TODO_COLUMNS = 'id, title, done';

export const postgresStorage = {
  // ----- Users -----
  async createUser({ username, passwordHash }) {
    try {
      const result = await pool.query(
        'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username',
        [username, passwordHash]
      );
      return result.rows[0];
    } catch (error) {
      if (error.code === UNIQUE_VIOLATION) {
        return null;
      }
      throw error;
    }
  },

  async findUserByUsername(username) {
    const result = await pool.query(
      'SELECT id, username, password_hash AS "passwordHash" FROM users WHERE username = $1',
      [username]
    );
    return result.rows[0] || null;
  },

  // ----- Todos (always scoped to a user) -----
  async getAll(userId) {
    const result = await pool.query(
      `SELECT ${TODO_COLUMNS} FROM todos WHERE user_id = $1 ORDER BY id`,
      [userId]
    );
    return result.rows;
  },

  async getById(id, userId) {
    const result = await pool.query(
      `SELECT ${TODO_COLUMNS} FROM todos WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    return result.rows[0];
  },

  async create(todoData, userId) {
    const result = await pool.query(
      `INSERT INTO todos (title, done, user_id) VALUES ($1, $2, $3) RETURNING ${TODO_COLUMNS}`,
      [todoData.title, todoData.done || false, userId]
    );
    return result.rows[0];
  },

  async update(id, userId, todoData) {
    const result = await pool.query(
      `UPDATE todos SET title = COALESCE($1, title), done = COALESCE($2, done)
       WHERE id = $3 AND user_id = $4 RETURNING ${TODO_COLUMNS}`,
      [todoData.title, todoData.done, id, userId]
    );
    return result.rows[0];
  },

  async delete(id, userId) {
    const result = await pool.query(
      'DELETE FROM todos WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return result.rowCount > 0;
  }
};
