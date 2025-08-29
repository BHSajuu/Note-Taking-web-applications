
import  { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      // We will save the token and user data in the next step
      console.log("Received token:", token);
      localStorage.setItem('authToken', token);
      navigate('/dashboard');
    } else {
      // Handle login failure
      navigate('/');
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Loading, please wait...</p>
    </div>
  );
};

export default AuthCallback;