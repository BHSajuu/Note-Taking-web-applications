import  { useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import EditorSidebar from './EditorSidebar';
import { PanelRightClose, PanelRightOpen, Save } from 'lucide-react';
import type { EditorViewProps } from '../types';
import AIAssistantDialog from './AIAssistantDialog';
import { useAuth } from '../context/AuthContext';
import { convertMarkdownToHtml } from '../lib/util';


const EditorView = ({ notes, activeNote, onNoteSelect, onEditorChange, handleSaveNote, isSaving, onCloseEditor, onNewNoteClick }: EditorViewProps) => {
  const {user} = useAuth();
  const [sidebarVisible, setSidebarVisible] = useState(window.innerWidth >= 768);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [requestCount, setRequestCount] = useState(user?.aiRequestCount || 0);

   const handleInsertContent = (content: string) => {
    // Structure the content properly before inserting
    const improvedContent = convertMarkdownToHtml(content);
    
    const newContent = (activeNote.content || '') + improvedContent;
    onEditorChange('content', newContent);
    setIsAiAssistantOpen(false);
  };

  useEffect(() => {
    setRequestCount(user?.aiRequestCount || 0);
  }, [user]);

  return (
    <div className="flex h-screen bg-gray-50 relative overflow-hidden">
      {isAiAssistantOpen && (
        <AIAssistantDialog
          onClose={() => setIsAiAssistantOpen(false)}
          onInsert={handleInsertContent}
          count={requestCount}
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
        <div className=" h-16 flex items-center justify-between bg-gray-200 border-b border-gray-200">
             <button onClick={() => setSidebarVisible(!sidebarVisible)} className="md:hidden px-2 mb-1.5 text-gray-600 hover:text-gray-900 z-30">
                {sidebarVisible ? <PanelRightOpen size={30} />: <PanelRightClose size={30} /> }
             </button>
             <div className="flex-grow"></div>
             <div className="flex items-center space-x-10 mr-10">
                
                 <button
                  onClick={() => setIsAiAssistantOpen(true)}
                  className='animated-border-button'
               >
                  
                  <style>{`
                @property --angle {
                  syntax: "<angle>";
                  initial-value: 0deg;
                  inherits: false;
                }

                @keyframes fadeInUp {
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }

                @keyframes spin {
                  from { --angle: 0deg; }
                  to   { --angle: 360deg; }
                }

                .animated-border-button:hover {
                  position: relative;
                  padding: 3px;
                  border-radius: 1rem;
                  opacity: 0;
                  animation: fadeInUp 0.6s ease-out forwards;
                  isolation: isolate;
                }

                .animated-border-button::before,
                .animated-border-button::after {
                  content: "";
                  position: absolute;
                  inset: 0;
                  padding: 3px;
                  border-radius: 1rem;
                  background-image: conic-gradient(from var(--angle), #ff4545, #00ff99, #006aff, #ff0095, #ff4545);
                  animation: spin 2.5s linear infinite;
                  z-index: -1;
                }

                .animated-border-button::before {
                  filter: blur(1.5rem);
                  opacity: 0.5;
                }

                .button-content {
                  position: relative;
                  z-index: 1;
                  background: #799EFF; 
                  text: #fff;
                  height: 100%;
                  padding: 0.4rem 1rem;
                  display: flex;
                  border-radius: 1rem;
                  align-items: center;
                  justify-content: space-between;
                  gap: 1rem;
                }
                .loader{
                  width: 1em;
                  height: 1em;
                  margin-right: 0.5em;
                  border-radius: 50%;
                  border-width: 0.2em;
                  border-style: solid;
                  border-color: transparent rgba(255, 255, 255, 0.3);
                  animation-name: loader-animation;
                  animation-duration: 1s;
                  animation-timing-function: cubic-bezier(.4,.0,.6,1);
                  animation-fill-mode: both;
                }
              `}</style>


                  <p className='button-content'>AI Assistant</p>
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