import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Header from '../components/Header';
import WelcomeDashboard from '../components/WelcomeDashboard';
import EditorView from '../components/EditorView';

// Export the Note type so other components can use it
export interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleNewNoteClick = () => {
    setActiveNote({ title: 'Untitled Note', content: '' }); // Prepare a new note
    setIsEditorOpen(true); // Open the editor view
  };

  const handleNoteSelect = (note: Note) => {
    setActiveNote(note); // Set the selected note as active
    setIsEditorOpen(true); // Open the editor view
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
    try {
      if (activeNote._id) {
        // Update existing note
        const { data: updatedNote } = await api.put(`/notes/${activeNote._id}`, {
          title: activeNote.title,
          content: activeNote.content,
        });
        setNotes(notes.map(note => note._id === updatedNote._id ? updatedNote : note));
      } else {
        // Create new note
        const { data: newNote } = await api.post('/notes', {
          title: activeNote.title,
          content: activeNote.content,
        });
        setNotes([newNote, ...notes]);
        setActiveNote(newNote); // Set the new note as active
      }
      // Don't close editor after saving, allow continuous editing
    } catch (error) {
      console.error('Failed to save note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await api.delete(`/notes/${noteId}`);
      await fetchNotes(); // Re-fetch notes to update the list
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };
  
  const handleEditorDelete = async () => {
    if (activeNote && activeNote._id) {
      await handleDeleteNote(activeNote._id);
      handleCloseEditor();
    }
  };

  // Backend logic for updating notes is required
  const handleUpdateNote = async () => {
    if (!activeNote || !activeNote._id) return;
    await handleSaveNote();
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
