import express from 'express';
import { storage } from '../storage/index.js';

export const todoRouter = express.Router();

todoRouter.get('/', async (req, res) => {
  try {
    const todos = await storage.getAll();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

todoRouter.get('/:id', async (req, res) => {
  try {
    const todo = await storage.getById(req.params.id);
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
    // BUG: Removed validation - this will break the test!
    const todo = await storage.create({ title: title.trim(), done: false });
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

todoRouter.put('/:id', async (req, res) => {
  try {
    const todo = await storage.update(req.params.id, req.body);
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
    const deleted = await storage.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'TODO not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});
