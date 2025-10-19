// index.js
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();

// ✅ Replace these with your actual credentials from Google Cloud Console
const GOOGLE_CLIENT_ID = "982597322347-bo3lc910m0abpi724fc31dmg0db1a7tn.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

// 🔐 Session setup
app.use(session({
  secret: 'quizapp-secret-key',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// 🧠 Passport Google OAuth setup
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "https://quizapp-psi-azure.vercel.app/auth/google/callback" // must match in Google Console
},
  (accessToken, refreshToken, profile, done) => {
    console.log("User profile:", profile);
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// ✅ Google Auth Route
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// ✅ Google Callback Route
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login-failure' }),
  (req, res) => {
    // Redirect back to your Android WebView page
    res.redirect('quizapp://dashboard');  // 👈 custom deep link for Android redirect
  }
);

// ✅ Optional: Failure route
app.get('/login-failure', (req, res) => {
  res.send('Login failed, please try again.');
});

// ✅ Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('QuizApp backend running on http://localhost:${PORT}');
});