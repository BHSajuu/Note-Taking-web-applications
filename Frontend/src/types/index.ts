export interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string; 
  name: string;
  email: string;
  dateOfBirth?: string | Date;
  aiRequestCount: number;
  lastAiRequestDate: Date;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void; 
  logout: () => void;
}

export interface WelcomeDashboardProps {
  notes: Note[];
  loading: boolean;
  onNewNoteClick: () => void;
  handleDeleteNote: (noteId: string) => void;
  onNoteSelect: (note: Note) => void;
}

export interface EditorViewProps {
  notes: Note[];
  activeNote: Partial<Note>;
  onNoteSelect: (note: Note) => void;
  onEditorChange: (field: 'title' | 'content', value: string) => void;
  handleSaveNote: () => void;
  isSaving: boolean;
  onCloseEditor: () => void;
  onNewNoteClick: () => void;
}

export interface EditorSidebarProps {
  notes: Note[];
  activeNote: Partial<Note>;
  onNoteSelect: (note: Note) => void;
  onNewNoteClick: () => void;
  onTitleChange: (title: string) => void;
  sidebarVisible: boolean;
}

export type OTPInputProps = {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  autoFocus?: boolean;
};

export interface AIAssistantDialogProps {
  onClose: () => void;
  onInsert: (text: string) => void;
  count: number;
}

export interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}
