import express from 'express';
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from '../controller/todoController.js';
import { validateToken } from '../middleware/validateTokenHandler.js';

const router = express.Router();

// כל הראוטים כאן מוגנים על ידי המידלוור
router.use(validateToken);

// קבלת כל ה-Todos של המשתמש המחובר
router.get('/', getTodos);

// יצירת Todo חדש
router.post('/', createTodo);

// עדכון Todo קיים
router.put('/:id', updateTodo);

// מחיקת Todo
router.delete('/:id', deleteTodo);

export default router;
