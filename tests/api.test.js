import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';

describe('TODO API', () => {
  describe('GET /api/todos', () => {
    it('should return all todos', async () => {
      const response = await request(app)
        .get('/api/todos')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/todos', () => {
    it('should create a new todo', async () => {
      const newTodo = { title: 'Test todo' };
      
      const response = await request(app)
        .post('/api/todos')
        .send(newTodo)
        .expect(201);
      
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Test todo');
      expect(response.body.done).toBe(false);
    });

    it('should reject empty title', async () => {
      await request(app)
        .post('/api/todos')
        .send({ title: '' })
        .expect(400);
    });

    it('should reject missing title', async () => {
      await request(app)
        .post('/api/todos')
        .send({})
        .expect(400);
    });
  });

  describe('PUT /api/todos/:id', () => {
    it('should update a todo', async () => {
      const response = await request(app)
        .put('/api/todos/1')
        .send({ done: true })
        .expect(200);
      
      expect(response.body.done).toBe(true);
    });

    it('should return 404 for non-existent todo', async () => {
      await request(app)
        .put('/api/todos/99999')
        .send({ done: true })
        .expect(404);
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('should delete a todo', async () => {
      await request(app)
        .delete('/api/todos/2')
        .expect(204);
    });

    it('should return 404 for non-existent todo', async () => {
      await request(app)
        .delete('/api/todos/99999')
        .expect(404);
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
