import  { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import EditorSidebar from './EditorSidebar';
import { PanelRightClose, PanelRightOpen, Save } from 'lucide-react';
import type { EditorViewProps } from '../types';
import AIAssistantDialog from './AIAssistantDialog';


const EditorView = ({ notes, activeNote, onNoteSelect, onEditorChange, handleSaveNote, isSaving, onCloseEditor, onNewNoteClick }: EditorViewProps) => {
  const [sidebarVisible, setSidebarVisible] = useState(window.innerWidth >= 768);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);

   const handleInsertContent = (content: string) => {
    const newContent = (activeNote.content || '') + content;
    onEditorChange('content', newContent);
    setIsAiAssistantOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 relative overflow-hidden">
      {isAiAssistantOpen && (
        <AIAssistantDialog
          onClose={() => setIsAiAssistantOpen(false)}
          onInsert={handleInsertContent}
        />
      )}

      <EditorSidebar
        notes={notes}
        activeNote={activeNote}
        onNoteSelect={(note) => {
          onNoteSelect(note);
          if (window.innerWidth < 768) { 
            setSidebarVisible(false);
          }
        }}
        onNewNoteClick={onNewNoteClick}
        onTitleChange={(title) => onEditorChange('title', title)}
        sidebarVisible={sidebarVisible}
      />

      <main className="flex-1 flex flex-col">
        <div className="p-3 flex items-center justify-between bg-gray-200 border-b border-gray-200">
             <button onClick={() => setSidebarVisible(!sidebarVisible)} className="md:hidden px-2 mb-1.5 text-gray-600 hover:text-gray-900 z-30">
                {sidebarVisible ? <PanelRightOpen size={30} />: <PanelRightClose size={30} /> }
             </button>
             <div className="flex-grow"></div>
             <div className="flex items-center space-x-4">
                
                 <button
                  onClick={() => setIsAiAssistantOpen(true)}
                  className="flex items-center text-xs md:text-normal p-2 md:px-4 md:py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors"
                >
                  AI Assistant
                </button>

                <button
                    onClick={handleSaveNote}
                    disabled={isSaving}
                    className="flex items-center text-xs md:text-normal p-2 md:px-4 md:py-2 bg-blue-600 text-white rounded-xl disabled:bg-blue-300 hover:bg-blue-700 transition-colors"
                >
                    <Save size={16} className="mr-2" />
                    {isSaving ? 'Saving...' : 'Save Note'}
                </button>
                <button onClick={onCloseEditor} className="text-xs md:text-normal p-2 md:px-4 md:py-2 bg-indigo-200 rounded-xl hover:bg-gray-300 transition-colors">
                    Back to Dashboard
                </button>
             </div>
        </div>
        <div className="flex-1 p-4 md:p-2 overflow-y-auto">
            <Editor
              apiKey={import.meta.env.VITE_TINYMCE_API_KEY} 
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