// client/src/App.tsx
import { Routes, Route } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import AuthCallback from './pages/AuthCallback';


function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Routes>
        <Route path="/" element={<SignupPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login/success" element={<AuthCallback />} /> 
      </Routes>
    </div>
  );
}

export default App;