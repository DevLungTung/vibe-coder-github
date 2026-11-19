import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/server.js';

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('should create a user and return a token', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ username: 'Alice', password: 'password123' })
        .expect(201);

      expect(response.body.token).toEqual(expect.any(String));
      expect(response.body.user).toEqual({ id: expect.any(Number), username: 'alice' });
      expect(response.body.user).not.toHaveProperty('passwordHash');
    });

    it('should reject a duplicate username (case-insensitive)', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ username: 'bob', password: 'password123' })
        .expect(201);

      await request(app)
        .post('/api/auth/register')
        .send({ username: 'BOB', password: 'password456' })
        .expect(409);
    });

    it('should reject an invalid username', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ username: 'a', password: 'password123' })
        .expect(400);

      await request(app)
        .post('/api/auth/register')
        .send({ username: 'has spaces', password: 'password123' })
        .expect(400);
    });

    it('should reject a short password', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ username: 'shortpass', password: 'short' })
        .expect(400);
    });

    it('should reject a missing body', async () => {
      await request(app).post('/api/auth/register').expect(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should log in with the right password', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ username: 'carol', password: 'correct-horse' })
        .expect(201);

      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'carol', password: 'correct-horse' })
        .expect(200);

      expect(response.body.token).toEqual(expect.any(String));
      expect(response.body.user.username).toBe('carol');
    });

    it('should reject a wrong password', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({ username: 'dave', password: 'correct-horse' })
        .expect(201);

      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'dave', password: 'wrong-password' })
        .expect(401);

      expect(response.body.error).toBe('Invalid username or password');
    });

    it('should give the same error for an unknown user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: 'nobody', password: 'whatever123' })
        .expect(401);

      expect(response.body.error).toBe('Invalid username or password');
    });

    it('should reject missing credentials', async () => {
      await request(app).post('/api/auth/login').send({}).expect(400);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return the current user for a valid token', async () => {
      const { body } = await request(app)
        .post('/api/auth/register')
        .send({ username: 'erin', password: 'password123' })
        .expect(201);

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${body.token}`)
        .expect(200);

      expect(response.body.user).toEqual({ id: body.user.id, username: 'erin' });
    });

    it('should reject a tampered token', async () => {
      const { body } = await request(app)
        .post('/api/auth/register')
        .send({ username: 'frank', password: 'password123' })
        .expect(201);

      const [header, , signature] = body.token.split('.');
      const forgedPayload = Buffer.from(JSON.stringify({
        sub: 1, username: 'alice', exp: 9999999999
      })).toString('base64url');

      await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${header}.${forgedPayload}.${signature}`)
        .expect(401);
    });

    it('should reject a missing token', async () => {
      await request(app).get('/api/auth/me').expect(401);
    });
  });
});
