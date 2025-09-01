
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/userModel.js';


const callbackURL = `${process.env['SERVER_URL'] || 'http://localhost:5001'}/api/auth/google/callback`;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env['GOOGLE_CLIENT_ID'] as string,
      clientSecret: process.env['GOOGLE_CLIENT_SECRET'] as string,
      callbackURL: callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
 
        const existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = await new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0]?.value || '',
        }).save();

        done(null, newUser);

      } catch (error) {
        done(error, false);
      }
    }
  )
);