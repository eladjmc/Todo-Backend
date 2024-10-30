import asyncHandler from 'express-async-handler';
import Todo from '../models/todoModel.js';

// @desc    Get all todos for the current user
// @route   GET /api/v1/todos
// @access  Private
export const getTodos = asyncHandler(async (req, res) => {
  const todos = await Todo.find({ owner: req.user._id });
  res.status(200).json(todos);
});

// @desc    Create a new todo
// @route   POST /api/v1/todos
// @access  Private
export const createTodo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    res.status(400);
    throw new Error('Title is required');
  }

  const todo = await Todo.create({
    title,
    description,
    owner: req.user._id,
  });

  res.status(201).json(todo);
});

// @desc    Update an existing todo
// @route   PUT /api/v1/todos/:id
// @access  Private
export const updateTodo = asyncHandler(async (req, res) => {
  const { title, description, completed } = req.body;

  const todo = await Todo.findById(req.params.id);

  if (!todo) {
    res.status(404);
    throw new Error('Todo not found');
  }

  // וודא שהמשתמש המחובר הוא הבעלים של ה-Todo
  if (todo.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('User not authorized');
  }

  todo.title = title || todo.title;
  todo.description = description || todo.description;
  if (completed !== undefined) todo.completed = completed;

  const updatedTodo = await todo.save();

  res.status(200).json(updatedTodo);
});

// @desc    Delete a todo
// @route   DELETE /api/v1/todos/:id
// @access  Private
export const deleteTodo = asyncHandler(async (req, res) => {
    const todo = await Todo.findById(req.params.id);
  
    if (!todo) {
      res.status(404);
      throw new Error('Todo not found');
    }
  
    // וודא שהמשתמש מורשה למחוק את ה-Todo
    if (todo.owner.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }
  
    // השתמש ב-deleteOne או מחק את המסמך באמצעות האובייקט
    await todo.deleteOne();
  
    res.status(200).json({ message: 'Todo deleted' });
  });
  
