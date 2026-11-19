import { memoryStorage } from './memory.js';
import { postgresStorage } from './postgres.js';

export const storage = process.env.DATABASE_URL 
  ? postgresStorage 
  : memoryStorage;
