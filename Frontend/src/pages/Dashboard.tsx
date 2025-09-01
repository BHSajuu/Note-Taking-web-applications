import { useState, useEffect } from 'react';
import api from '../services/api';
import Header from '../components/Header';
import WelcomeDashboard from '../components/WelcomeDashboard';
import EditorView from '../components/EditorView';
import toast from 'react-hot-toast'; 
import type { Note } from '../types';


const Dashboard = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Partial<Note> | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/notes');
      setNotes(data.sort((a: Note, b: Note) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
    } catch (error) {
      console.error('Failed to fetch notes', error);
       toast.error('Failed to fetch your notes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleNewNoteClick = () => {
    setActiveNote({ title: 'Untitled Note', content: '' }); 
    setIsEditorOpen(true); 
  };

  const handleNoteSelect = (note: Note) => {
    setActiveNote(note);
    setIsEditorOpen(true);
  };
  
  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setActiveNote(null);
  };

  const onEditorChange = (field: 'title' | 'content', value: string) => {
    if (activeNote) {
      setActiveNote(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSaveNote = async () => {
    if (!activeNote) return;
    setIsSaving(true);
    const toastId = toast.loading('Saving note...');
    try {
      if (activeNote._id) {
        const { data: updatedNote } = await api.put(`/notes/${activeNote._id}`, {
          title: activeNote.title,
          content: activeNote.content,
        });
        setNotes(notes.map(note => note._id === updatedNote._id ? updatedNote : note));
      } else {
        const { data: newNote } = await api.post('/notes', {
          title: activeNote.title,
          content: activeNote.content,
        });
        setNotes([newNote, ...notes]);
        setActiveNote(newNote);
      }
      toast.success('Note saved successfully!', { id: toastId });
    } catch (error) {
      console.error('Failed to save note:', error);
      toast.error('Failed to save note.', { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await api.delete(`/notes/${noteId}`);
      await fetchNotes(); 
    } catch (error) {
      console.error('Failed to delete note:', error);
      toast.error('Failed to delete note.');
    }
  };

  if (isEditorOpen && activeNote) {
    return (
      <EditorView
        notes={notes}
        activeNote={activeNote}
        onNoteSelect={handleNoteSelect}
        onEditorChange={onEditorChange}
        handleSaveNote={handleSaveNote}
        isSaving={isSaving}
        onCloseEditor={handleCloseEditor}
        onNewNoteClick={handleNewNoteClick}
      />
    );
  }

  return (
    <div>
      <Header />
      <WelcomeDashboard
        notes={notes}
        loading={loading}
        onNoteSelect={handleNoteSelect}
        onNewNoteClick={handleNewNoteClick}
        handleDeleteNote={handleDeleteNote}
      />
    </div>
  );
};

export default Dashboard;
