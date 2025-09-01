import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { AxiosError } from 'axios';
import OTPInput from '../components/OTPInput';
import toast from 'react-hot-toast';

const SignupPage = () => {
  const { login } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Sending OTP...');
    try {
      await api.post('/auth/request-otp', {
        name,
        email,
        dateOfBirth,
        isSignin: false
      });
      toast.success('Verification code sent to your email!', { id: toastId });
      setIsOtpSent(true);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data?.message || 'Failed to send verification code.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Verifying OTP...');
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp });
      toast.success('Signup successful! Redirecting...', { id: toastId });
      login(data.token);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data?.message || 'Failed to verify code.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/google`;
  };

  return (
    <div className="pt-10 md:pt-0 flex flex-row  items-center justify-center bg-white">
      {/* Left side  Form section  */}
      <div className="min-h-screen pb-16  w-full lg:w-1/2 flex flex-col justify-start px-6 lg:pl-44 ">
        <div className="mb-8 md:pt-10  md:-ml-28">
          <div className="flex justify-center lg:justify-start mr-10 lg:mr-0 items-center mb-2">
            <img src="/logo.png" alt="logo" className="w-14 h-10" />
            <span className="text-3xl font-bold text-gray-900">HD</span>
          </div>
        </div>

        <div className="max-w-md mx-auto lg:mx-0 w-full ">
          <div className="mb-8 text-center mr-5 lg:mr-0 ">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Sign up
            </h1>
            <p className="text-gray-500 text-base">
              Sign up to enjoy the feature of HD
            </p>
          </div>
          <form onSubmit={isOtpSent ? handleVerifyOtp : handleRequestOtp} className="space-y-4">

            <div>
              <label className="block text-sm text-gray-500 mb-2">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tony Stark"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-2">Date of Birth</label>
              <div className="relative">
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tony_stark@gmail.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 transition-all duration-200"
              />
            </div>

            {isOtpSent &&
               <OTPInput
                  length={6}
                  value={otp}
                  onChange={(val) => setOtp(val)}
                />
            }

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {isOtpSent ? 'Verifying...' : 'Sending...'}
                </div>
              ) : (
                isOtpSent ? 'Sign up' : 'Get OTP'
              )}
            </button>
          </form>

          <div className="mt-6">
            <button
              onClick={handleGoogleSignup}
              className="mt-4 w-full flex gap-4 items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
              <img src="/google.png" alt="google logo" className='w-7 h-7' />
              <p>Continue with Google</p>
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Already have an account?{' '}
              <Link
                to="/signin"
                className="text-blue-500 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side  Image section*/}
      <div className="hidden  lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="/loginImage.png"
          alt="image"
          className="w-full h-[99vh]  object-fill opacity-80 p-3 rounded-b-2xl"
        />
      </div>
    </div>
  );
};

export default SignupPage;