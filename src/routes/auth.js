import express from 'express';
import { storage } from '../storage/index.js';
import { hashPassword, verifyPassword, fakeVerify } from '../auth/password.js';
import { createToken } from '../auth/token.js';
import { requireAuth } from '../middleware/auth.js';

export const authRouter = express.Router();

const USERNAME_PATTERN = /^[a-z0-9_.-]{3,32}$/;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

function readCredentials(body) {
  const username = typeof body?.username === 'string' ? body.username.trim().toLowerCase() : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  return { username, password };
}

authRouter.post('/register', async (req, res) => {
  try {
    const { username, password } = readCredentials(req.body);

    if (!USERNAME_PATTERN.test(username)) {
      return res.status(400).json({
        error: 'Username must be 3-32 characters: letters, numbers, ".", "_" or "-"'
      });
    }
    if (password.length < MIN_PASSWORD_LENGTH || password.length > MAX_PASSWORD_LENGTH) {
      return res.status(400).json({
        error: `Password must be ${MIN_PASSWORD_LENGTH}-${MAX_PASSWORD_LENGTH} characters`
      });
    }

    const user = await storage.createUser({
      username,
      passwordHash: await hashPassword(password)
    });
    if (!user) {
      return res.status(409).json({ error: 'Username is already taken' });
    }

    res.status(201).json({ token: createToken(user), user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register' });
  }
});

authRouter.post('/login', async (req, res) => {
  try {
    const { username, password } = readCredentials(req.body);
    if (!username || !password || password.length > MAX_PASSWORD_LENGTH) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const found = await storage.findUserByUsername(username);
    const valid = found
      ? await verifyPassword(password, found.passwordHash)
      : await fakeVerify(password);

    if (!valid) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = { id: found.id, username: found.username };
    res.json({ token: createToken(user), user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log in' });
  }
});

authRouter.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});
