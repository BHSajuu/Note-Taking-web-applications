import mongoose from 'mongoose';
import type { IUser } from '../types/index.js';

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    dateOfBirth: {
      type: Date,
    },
    googleId: { 
      type: String,
    },
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
    aiRequestCount: {
      type: Number,
      default: 0,
    },
    lastAiRequestDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, 
  }
);

const User = mongoose.model<IUser>('User', userSchema);

export default User;