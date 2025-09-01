import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { AxiosError } from 'axios';
import OTPInput from '../components/OTPInput';
import toast from 'react-hot-toast'; 

const SigninPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
     const toastId = toast.loading('Sending OTP...');
    try {
      await api.post('/auth/request-otp', { email, isSignin: true });
      toast.success('OTP sent to your email!', { id: toastId });
      setIsOtpSent(true);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data?.message || 'Failed to send OTP.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Verifying OTP...');
    try {
      const { data } = await api.post('/auth/verify-otp', { email, otp, keepLoggedIn });
      toast.success('Signin successful! Redirecting...', { id: toastId });
      login(data.token);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data?.message || 'Failed to verify OTP.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    const toastId = toast.loading('Resending OTP...');
    try {
      await api.post('/auth/request-otp', { email, isSignin: true });
      toast.success('OTP resent to your email!', { id: toastId });
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      toast.error(axiosError.response?.data?.message || 'Failed to resend OTP.', { id: toastId });
    }
  };

  const handleGoogleSignin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/auth/google`;
  };

  return (
    <div className=" pt-10 md:pt-0 flex flex-row items-center justify-center bg-white">
      {/* Left side Form section  */}
      <div className="min-h-screen pb-16 w-full lg:w-1/2  flex flex-col justify-center  px-6 lg:pl-56 ">
        <div className="mb-8  md:-ml-28">
          <div className="flex justify-center lg:justify-start mr-10 lg:mr-0 items-center mb-2">
            <img src="/logo.png" alt="logo" className="w-14 h-10" />
            <span className="text-3xl font-bold text-gray-900">HD</span>
          </div>
        </div>

        <div className="max-w-md mx-auto lg:mx-0 w-full ">
          <div className="mb-8 text-center mr-5 lg:mr-0 ">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Sign In
            </h1>
            <p className="text-gray-500 text-base">
              Please login to continue to your account.
            </p>
          </div>

          <form onSubmit={isOtpSent ? handleVerifyOtp : handleRequestOtp} className="space-y-6">

            <label className="block text-sm text-gray-500 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tony_stark@gmail.com"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 transition-all duration-200"
            />


            {isOtpSent &&

              <>
                <OTPInput
                  length={6}
                  value={otp}
                  onChange={(val) => setOtp(val)}
                />

                <div className="text-left">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-blue-500 hover:text-blue-600 text-sm font-medium transition-colors duration-200"
                  >
                    Resend OTP
                  </button>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="keepLoggedIn"
                    checked={keepLoggedIn}
                    onChange={(e) => setKeepLoggedIn(e.target.checked)}
                    className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="keepLoggedIn" className="ml-2 text-sm text-gray-700">
                    Keep me logged in
                  </label>
                </div>
              </>

            }



            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {isOtpSent ? 'Signing in...' : 'Sending...'}
                </div>
              ) : (
                isOtpSent ? 'Sign in' : 'Get OTP'
              )}
            </button>
          </form>

          {!isOtpSent && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              <button
                onClick={handleGoogleSignin}
                className="mt-4 w-full flex gap-4 items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                <img src="/google.png" alt="google logo" className='w-7 h-7' />
                <p>Continue with Google</p>
              </button>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Need an account?{' '}
              <Link
                to="/"
                className="text-blue-500 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side  Image section */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img
          src="/loginImage.png"
          alt="image"
          className="w-full h-[100vh] object-fill opacity-80 p-3 rounded-b-2xl"
        />
      </div>
    </div>
  );
};

export default SigninPage;