import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Trash2 } from 'lucide-react';

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data } = await api.get('/notes');
        setNotes(data);
      } catch (error) {
        console.error('Failed to fetch notes', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsCreating(true);
    try {
      const { data: newNote } = await api.post('/notes', { title, content });
      setNotes([newNote, ...notes]);
      setTitle('');
      setContent('');
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create note', error);
    } finally {
      setIsCreating(false);
    }
  };


  const handleDeleteNote = async (noteId: string) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      await api.delete(`/notes/${noteId}`);
      setNotes(notes.filter((note) => note._id !== noteId));
    } catch (error) {
      console.error('Failed to delete note', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:max-w-7xl lg:mx-auto lg:py-8">
        <div className="bg-white lg:rounded-2xl lg:shadow-lg overflow-hidden">

          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center">
              <img src="/logo.png" alt="logo" className='w-14 h-10' />
              <span className="text-2xl font-semibold text-gray-900">Dashboard</span>
            </div>
            <button
              onClick={logout}
              className="bg-red-400 rounded-3xl px-3 py-2   hover:bg-red-500  hover:scale-110 hover:shadow-3xl hover:shadow-black  transition-all duration-300"
            >
              Sign Out
            </button>
          </div>

          <div className=" mb-6 flex flex-col gap-3 items-center  py-10 border-2 border-gray-200  shadow-xl my-12 mx-6 rounded-3xl">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">
              Welcome, {user?.name}!
            </h1>
            <p className="text-gray-500 text-sm">
              Email: {user?.email?.replace(/(.{6}).*(@.*)/, '$1****$2')}
            </p>
          </div>

          <div className=" px-6 py-6 lg:px-8 lg:py-8">

            <div className='text-center'>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="w-[30vh] py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-2xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-1"
              >
                Create Note
              </button>
            </div>

            {showCreateForm && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <form onSubmit={handleCreateNote} className="space-y-4">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Note title..."
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your note content here..."
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                  />
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      disabled={isCreating || !title.trim() || !content.trim()}
                      className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium rounded-lg transition-colors duration-200 text-sm"
                    >
                      {isCreating ? 'Creating...' : 'Save Note'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateForm(false);
                        setTitle('');
                        setContent('');
                      }}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors duration-200 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}


          </div>

          <div className='px-5 py-1'>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Notes</h2>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : notes.length > 0 ? (
              <div className="space-y-3 mb-5">
                {notes.map((note) => (
                  <div
                    key={note._id}
                    className="flex items-center justify-between px-4 py-2.5  rounded-2xl border-2 border-gray-200 hover:bg-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {note.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => handleDeleteNote(note._id)}
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

export default Dashboard;