
import  { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      // Step 1: Persist the token to localStorage.
      localStorage.setItem('authToken', token);
      
      // Step 2: Force a full page reload by navigating to the dashboard.
      // This ensures that when the app re-initializes, our AuthProvider
      // will read the new token from localStorage from the very beginning.
      window.location.replace('/dashboard');
    } else {
      // Handle the failure case.
      console.error("Google login failed, no token received.");
      window.location.replace('/');
    }
  }, [searchParams]); // We no longer need navigate or login as dependencies.

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Finalizing login, please wait...</p>
    </div>
  );
};

export default AuthCallback;