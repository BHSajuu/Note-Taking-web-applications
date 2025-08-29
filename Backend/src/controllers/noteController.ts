import type { Response } from 'express';
import type { AuthRequest } from '../middleware/authMiddleware.js';
import Note from '../models/noteModel.js';


export const getNotes = async (req: AuthRequest, res: Response) => {
  const notes = await Note.find({ user: req.user._id });
  res.json(notes);
};

export const createNote = async (req: AuthRequest, res: Response) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Please add a title and content' });
  }

  const note = new Note({
    title,
    content,
    user: req.user._id, 
  });

  const createdNote = await note.save();
  res.status(201).json(createdNote);
};

export const deleteNote = async (req: AuthRequest, res: Response) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    return res.status(404).json({ message: 'Note not found' });
  }

  if (note.user.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: 'User not authorized' });
  }

  await note.deleteOne();
  res.json({ message: 'Note removed' });
};