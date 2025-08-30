
import type { Note } from '../pages/Dashboard'; 

interface NoteListProps {
  notes: Note[];
  onNoteSelect: (note: Note) => void;
  onNewNoteClick: () => void;
  handleDeleteNote: (noteId: string) => void;
}

const NoteList = ({ notes, onNoteSelect, onNewNoteClick, handleDeleteNote }: NoteListProps) => {
  return (
    <main className="container p-4 mx-auto mt-6">
      <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-xl font-semibold">Welcome to your Dashboard</h2>
        <p className="mb-4">You can create a new note below or edit an existing one.</p>
        <button 
          onClick={onNewNoteClick}
          className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-md"
        >
          Create a New Note
        </button>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">Your Notes</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {notes.length > 0 ? notes.map(note => (
            <div key={note._id} className="p-4 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg" onClick={() => onNoteSelect(note)}>
              <h3 className="text-lg font-bold">{note.title}</h3>
              <p className="mt-2 text-gray-700 break-words">{
                // A simple way to show plain text from HTML content
                new DOMParser().parseFromString(note.content, "text/html").documentElement.textContent?.substring(0, 100) + '...'
              }</p>
              <div className="mt-4 flex justify-end">
                <button onClick={(e) => { e.stopPropagation(); handleDeleteNote(note._id); }} className="text-sm text-red-500">
                  Delete
                </button>
              </div>
            </div>
          )) : <p>You have no notes yet. Create one above!</p>}
        </div>
      </div>
    </main>
  );
};

export default NoteList;