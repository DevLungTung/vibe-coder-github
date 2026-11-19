import express from 'express';
import { storage } from '../storage/index.js';
import { requireAuth } from '../middleware/auth.js';

export const todoRouter = express.Router();

// Every todo route requires a logged-in user, and only touches that user's todos.
todoRouter.use(requireAuth);

todoRouter.get('/', async (req, res) => {
  try {
    const todos = await storage.getAll(req.user.id);
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

todoRouter.get('/:id', async (req, res) => {
  try {
    const todo = await storage.getById(req.params.id, req.user.id);
    if (!todo) {
      return res.status(404).json({ error: 'TODO not found' });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todo' });
  }
});

todoRouter.post('/', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    const todo = await storage.create({ title: title.trim(), done: false }, req.user.id);
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

todoRouter.put('/:id', async (req, res) => {
  try {
    const todo = await storage.update(req.params.id, req.user.id, req.body);
    if (!todo) {
      return res.status(404).json({ error: 'TODO not found' });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

todoRouter.delete('/:id', async (req, res) => {
  try {
    const deleted = await storage.delete(req.params.id, req.user.id);
    if (!deleted) {
      return res.status(404).json({ error: 'TODO not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});
