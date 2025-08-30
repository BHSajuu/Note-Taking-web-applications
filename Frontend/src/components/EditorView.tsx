import  { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import type { Note } from '../pages/Dashboard';
import EditorSidebar from './EditorSidebar';
import { Menu, Save, X } from 'lucide-react';

interface EditorViewProps {
  notes: Note[];
  activeNote: Partial<Note>;
  onNoteSelect: (note: Note) => void;
  onEditorChange: (field: 'title' | 'content', value: string) => void;
  handleSaveNote: () => void;
  isSaving: boolean;
  onCloseEditor: () => void;
  onNewNoteClick: () => void;
}

const EditorView = ({ notes, activeNote, onNoteSelect, onEditorChange, handleSaveNote, isSaving, onCloseEditor, onNewNoteClick }: EditorViewProps) => {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50 relative">
      <EditorSidebar
        notes={notes}
        activeNote={activeNote}
        onNoteSelect={onNoteSelect}
        onNewNoteClick={onNewNoteClick}
        onTitleChange={(title) => onEditorChange('title', title)}
        sidebarVisible={sidebarVisible}
      />

      {/* Main Editor */}
      <main className="flex-1 flex flex-col">
        <div className="p-4 flex items-center justify-between bg-white border-b border-gray-200">
            {/* Mobile Menu Toggle */}
             <button onClick={() => setSidebarVisible(!sidebarVisible)} className="md:hidden p-2 text-gray-600 hover:text-gray-900">
                {sidebarVisible ? <X size={20} /> : <Menu size={20} />}
             </button>
             <div className="flex-grow"></div> {/* Spacer */}
             <div className="flex items-center space-x-4">
                <button
                    onClick={handleSaveNote}
                    disabled={isSaving}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-blue-300 hover:bg-blue-700 transition-colors"
                >
                    <Save size={16} className="mr-2" />
                    {isSaving ? 'Saving...' : 'Save Note'}
                </button>
                <button onClick={onCloseEditor} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors hidden md:block">
                    Back to Dashboard
                </button>
             </div>
        </div>
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
            <Editor
              apiKey="YOUR_TINYMCE_API_KEY" // ** IMPORTANT: Replace this with your actual API key **
              value={activeNote.content || ''}
              onEditorChange={(newContent) => onEditorChange('content', newContent)}
              init={{
                height: '100%',
                menubar: true,
                plugins: 'autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount',
                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media | removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'
              }}
            />
        </div>
      </main>
    </div>
  );
};

export default EditorView;

