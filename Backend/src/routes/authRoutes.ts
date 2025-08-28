import express from 'express';
import passport from 'passport';
import { requestOtp, verifyOtp, googleAuthCallback } from '../controllers/authController.js';

const router = express.Router();


router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { 
    session: false, 
    failureRedirect: `${process.env['CLIENT_URL']}/login/failed`,
  }),
  googleAuthCallback 
);

export default router;