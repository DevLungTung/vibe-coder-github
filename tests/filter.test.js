import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';

describe('TODO Filtering', () => {
  it('should filter done todos', async () => {
    const response = await request(app)
      .get('/api/todos?status=done')
      .expect(200);
    
    expect(Array.isArray(response.body)).toBe(true);
    response.body.forEach(todo => {
      expect(todo.done).toBe(true);
    });
  });

  it('should filter pending todos', async () => {
    const response = await request(app)
      .get('/api/todos?status=pending')
      .expect(200);
    
    expect(Array.isArray(response.body)).toBe(true);
    response.body.forEach(todo => {
      expect(todo.done).toBe(false);
    });
  });

  it('should return all todos without filter', async () => {
    const response = await request(app)
      .get('/api/todos')
      .expect(200);
    
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
