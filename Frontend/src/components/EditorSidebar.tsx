
import type { Note } from '../pages/Dashboard';
import { Plus } from 'lucide-react';

interface EditorSidebarProps {
  notes: Note[];
  activeNote: Partial<Note>;
  onNoteSelect: (note: Note) => void;
  onNewNoteClick: () => void;
  onTitleChange: (title: string) => void;
  sidebarVisible: boolean;
}

const EditorSidebar = ({ notes, activeNote, onNoteSelect, onNewNoteClick, onTitleChange, sidebarVisible }: EditorSidebarProps) => {
  return (
    <aside className={`absolute md:relative z-10 bg-white border-r border-gray-200 flex flex-col h-full transition-all duration-300 ${sidebarVisible ? 'w-full md:w-1/3 lg:w-1/4' : 'w-0'} overflow-hidden`}>
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold">All Notes</h2>
        <button onClick={onNewNoteClick} className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
          <Plus size={18} />
        </button>
      </div>

      {/* Title input is now inside the sidebar */}
      <div className="p-4 border-b">
         <input
              type="text"
              placeholder="Note Title"
              value={activeNote.title || ''}
              onChange={(e) => onTitleChange(e.target.value)}
              className="w-full text-xl font-bold p-2 bg-gray-50 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            />
      </div>

      <ul className="flex-1 overflow-y-auto">
        {notes.map(note => (
          <li key={note._id} onClick={() => onNoteSelect(note)}
            className={`p-4 cursor-pointer border-l-4 ${activeNote._id === note._id ? 'bg-blue-50 border-blue-500' : 'border-transparent hover:bg-gray-100'}`}>
            <h4 className="font-semibold text-gray-800 truncate">{note.title || 'Untitled Note'}</h4>
            <p className="text-sm text-gray-500 truncate">
              {new DOMParser().parseFromString(note.content, "text/html").documentElement.textContent}
            </p>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default EditorSidebar;
