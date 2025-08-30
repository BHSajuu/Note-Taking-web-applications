import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Note } from '../pages/Dashboard';
import { Trash2 } from 'lucide-react';

interface WelcomeDashboardProps {
  notes: Note[];
  loading: boolean;
  onNewNoteClick: () => void;
  handleDeleteNote: (noteId: string) => void;
  onNoteSelect: (note: Note) => void;
}

const WelcomeDashboard = ({ notes, loading, onNewNoteClick, handleDeleteNote, onNoteSelect }: WelcomeDashboardProps) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    // This will now be handled by the main Dashboard component
    // We can leave this form for quick notes if desired, or remove it.
    // For now, let's just trigger the editor view.
    onNewNoteClick(); 
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:max-w-7xl lg:mx-auto lg:py-8">
        <div className="bg-white lg:rounded-2xl lg:shadow-lg overflow-hidden">
          {/* Header is now a separate component */}
          <div className="max-w-3xl md:ml-60 mb-6 flex flex-col gap-3 items-center justify-center py-10 border-2 border-gray-200 shadow-xl my-12 mx-6 rounded-3xl">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
              Welcome, {user?.name}!
            </h1>
            <p className="text-gray-500 text-sm">
              Email: {user?.email?.replace(/(.{6}).*(@.*)/, '$1****$2')}
            </p>
          </div>

          <div className="px-6 py-6 lg:px-8 lg:py-8">
            <div className='text-center'>
              <button
                onClick={onNewNoteClick}
                className="w-[30vh] py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-2xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-1"
              >
                Create Note
              </button>
            </div>
            {/* The simple create form is removed to favor the new editor view */}
          </div>

          <div className='px-5 py-1'>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Notes</h2>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : notes.length > 0 ? (
              <div className="mb-5 grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-8">
                {notes.map((note) => (
                  <div
                    key={note._id}
                    onClick={() => onNoteSelect(note)}
                    className="flex items-center justify-between px-8 py-4 rounded-2xl border-2 border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1 truncate">
                        {note.title}
                      </h3>
                       <p className="text-sm text-gray-500 line-clamp-2">
                        {new DOMParser().parseFromString(note.content, "text/html").documentElement.textContent}
                      </p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteNote(note._id); }}
                      className="ml-4 text-gray-400 hover:text-red-500 transition-colors duration-200 p-1"
                      title="Delete note"
                    >
                      <Trash2 />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-base font-medium text-gray-900 mb-2">No notes yet</h3>
                <p className="text-gray-500 text-sm">Create your first note to get started!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeDashboard;
