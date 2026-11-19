import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';

async function registerUser(username) {
  const response = await request(app)
    .post('/api/auth/register')
    .send({ username, password: 'password123' })
    .expect(201);
  return response.body.token;
}

describe('TODO API', () => {
  let token;
  let todoId;
  const auth = () => ({ Authorization: `Bearer ${token}` });

  beforeAll(async () => {
    token = await registerUser('todo-tester');
    const response = await request(app)
      .post('/api/todos')
      .set(auth())
      .send({ title: 'First todo' })
      .expect(201);
    todoId = response.body.id;
  });

  describe('authentication', () => {
    it('should reject requests without a token', async () => {
      await request(app).get('/api/todos').expect(401);
      await request(app).post('/api/todos').send({ title: 'x' }).expect(401);
      await request(app).put(`/api/todos/${todoId}`).send({ done: true }).expect(401);
      await request(app).delete(`/api/todos/${todoId}`).expect(401);
    });

    it('should reject an invalid token', async () => {
      await request(app)
        .get('/api/todos')
        .set('Authorization', 'Bearer not-a-real-token')
        .expect(401);
    });
  });

  describe('GET /api/todos', () => {
    it('should return the user\'s todos', async () => {
      const response = await request(app)
        .get('/api/todos')
        .set(auth())
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/todos', () => {
    it('should create a new todo', async () => {
      const response = await request(app)
        .post('/api/todos')
        .set(auth())
        .send({ title: 'Test todo' })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Test todo');
      expect(response.body.done).toBe(false);
    });

    it('should reject empty title', async () => {
      await request(app)
        .post('/api/todos')
        .set(auth())
        .send({ title: '' })
        .expect(400);
    });

    it('should reject missing title', async () => {
      await request(app)
        .post('/api/todos')
        .set(auth())
        .send({})
        .expect(400);
    });
  });

  describe('PUT /api/todos/:id', () => {
    it('should update a todo', async () => {
      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .set(auth())
        .send({ done: true })
        .expect(200);

      expect(response.body.done).toBe(true);
    });

    it('should return 404 for non-existent todo', async () => {
      await request(app)
        .put('/api/todos/99999')
        .set(auth())
        .send({ done: true })
        .expect(404);
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('should delete a todo', async () => {
      const created = await request(app)
        .post('/api/todos')
        .set(auth())
        .send({ title: 'To be deleted' })
        .expect(201);

      await request(app)
        .delete(`/api/todos/${created.body.id}`)
        .set(auth())
        .expect(204);
    });

    it('should return 404 for non-existent todo', async () => {
      await request(app)
        .delete('/api/todos/99999')
        .set(auth())
        .expect(404);
    });
  });

  describe('per-user isolation', () => {
    it('should not let another user see or change this user\'s todos', async () => {
      const otherToken = await registerUser('other-user');
      const other = { Authorization: `Bearer ${otherToken}` };

      const list = await request(app).get('/api/todos').set(other).expect(200);
      expect(list.body).toEqual([]);

      await request(app).get(`/api/todos/${todoId}`).set(other).expect(404);
      await request(app).put(`/api/todos/${todoId}`).set(other).send({ title: 'hacked' }).expect(404);
      await request(app).delete(`/api/todos/${todoId}`).set(other).expect(404);

      const own = await request(app).get(`/api/todos/${todoId}`).set(auth()).expect(200);
      expect(own.body.title).toBe('First todo');
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});
