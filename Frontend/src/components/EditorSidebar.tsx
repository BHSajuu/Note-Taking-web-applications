
import { Plus } from 'lucide-react';
import type { EditorSidebarProps } from '../types';

const EditorSidebar = ({ notes, activeNote, onNoteSelect, onNewNoteClick, onTitleChange, sidebarVisible }: EditorSidebarProps) => {
  return (
    <aside className={`absolute md:relative z-20 bg-white border-r border-gray-200 flex flex-col h-full transition-transform duration-300 transform ${sidebarVisible ? 'translate-x-0' : '-translate-x-full'} w-full md:w-1/3 lg:w-1/4`}>
      <div className="p-4.5 bg-gray-200 border-b rounded-b-xl flex justify-between items-center">
        <h2 className="ml-12 lg:ml-0 text-xl font-bold">All Notes</h2>
        <button onClick={onNewNoteClick} className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
          <Plus size={18} />
        </button>
      </div>

      <div className="p-4 border-b rounded-b-xl">
         <input
              type="text"
              placeholder="Note Title"
              value={activeNote.title || ''}
              onChange={(e) => onTitleChange(e.target.value)}
              className="w-full text-xl font-bold p-2 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
            />
      </div>

      <ul className="flex-1  overflow-y-auto">
        {notes.map(note => (
          <li key={note._id} onClick={() => onNoteSelect(note)}
            className={`m-3 p-4 rounded-3xl cursor-pointer  ${activeNote._id === note._id ? 'border-l-4 bg-blue-50 border-lime-500' : 'border-2 border-gray-200 hover:bg-blue-300/30'}`}>
            <h4 className="font-semibold text-gray-800 truncate">{note.title || 'Untitled Note'}</h4>
            <p className="text-sm text-gray-500 truncate">
              {new DOMParser().parseFromString(note.content, "text/html").documentElement.textContent || 'No content'}
            </p>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default EditorSidebar;