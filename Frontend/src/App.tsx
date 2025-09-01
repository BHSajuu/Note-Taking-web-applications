import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import AuthCallback from './pages/AuthCallback';
import ProtectedRoute from './components/ProtectedRoute';
import SigninPage from './pages/SigninPage';

function App() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<SignupPage />} />
        <Route path="/signin" element={<SigninPage />} />
        <Route path="/login/success" element={<AuthCallback />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
export default App;