import type { Request, Response } from 'express';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { generateOtpEmailHtml, sendEmail } from '../lib/utils.js';



// Request OTP endpoint -> handles both signup and signin 
export const requestOtp = async (req: Request, res: Response) => {
  const { email, name, dateOfBirth, isSignin } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  let existingUser;
  if (isSignin) {
     existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: 'No account found with this email. Please sign up first.' });
    }
  } else {
    if (!name || !dateOfBirth) {
      return res.status(400).json({ message: 'Name, email, and date of birth are required' });
    }
    
    const dobDate = new Date(dateOfBirth);
    if (isNaN(dobDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date of birth format' });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser && !existingUser.otp) {
      return res.status(400).json({ message: 'User already exists. Please sign in instead.' });
    }
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); 
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); 
  
  const hashedOtp = await bcrypt.hash(otp, 10);

  try {
    if (isSignin) {
      await User.findOneAndUpdate(
        { email },
        { otp: hashedOtp, otpExpiry },
        { new: true }
      );
    } 
    
    const emailSubject = isSignin ? 'Sign In Verification Code' : 'Welcome to NoteTaker - Verification Code';
    const emailText = generateOtpEmailHtml(name || existingUser?.name, otp);

    await sendEmail(email, emailSubject, emailText);
    
    return res.status(200).json({ 
      message: isSignin ? 'Verification code sent to your email.' : 'Account created! Verification code sent to your email.' 
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error processing request', error });
  }
};


// Verify OTP endpoint -> handles both signup and signin verification
export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp,  keepLoggedIn } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !user.otp) {
      return res.status(400).json({ message: 'Invalid request. Please sign up first.' });
    }

    if (new Date() > user.otpExpiry!) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    const isMatch = await bcrypt.compare(otp, user.otp);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }

    user.otp = "";
    user.otpExpiry = null;
    await user.save();

    const tokenExpiry = keepLoggedIn ? '30d' : '7d'; 
    const token = jwt.sign({ id: user._id }, process.env['JWT_SECRET'] as string, {
      expiresIn: tokenExpiry,
    });

    return res.status(201).json({
      message: 'User registered successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};


export const googleAuthCallback = (req: Request, res: Response) => {
      const user = req.user as any; 
    
      const token = jwt.sign({ id: user._id }, process.env['JWT_SECRET'] as string, {
        expiresIn: '7d',
      });
    
      try {
        const redirectUrl = new URL('/login/success', process.env['CLIENT_URL']);
        redirectUrl.searchParams.set('token', token);
        res.redirect(redirectUrl.href);
    } catch (error) {
        console.error("Error creating redirect URL:", error);
        res.status(500).send("Internal Server Error");
    } 
};


export const getMe = async (req: Request, res: Response) => {
  const userData = {
    _id: req.user?._id,
    name: req.user?.name,
    email: req.user?.email,
    dateOfBirth: req.user?.dateOfBirth,
    createdAt: req.user?.createdAt,
    updatedAt: req.user?.updatedAt,
    aiRequestCount: req.user?.aiRequestCount,
    lastAiRequestDate: req.user?.lastAiRequestDate,
  };

  res.status(200).json(userData);
};