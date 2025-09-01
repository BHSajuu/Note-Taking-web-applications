
import  { useEffect } from 'react';
import toast from 'react-hot-toast';

import { useSearchParams } from 'react-router-dom';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      localStorage.setItem('authToken', token);
      toast.success("Google login successful!");
      window.location.replace('/dashboard');
    } else {
      console.error("Google login failed, no token received.");
      toast.error("Google login failed, no token received.");
      window.location.replace('/');
    }
  }, [searchParams]); 

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Finalizing login, please wait...</p>
      </div>
    </div>
  );
};

export default AuthCallback;