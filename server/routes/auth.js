import express from 'express';
import crypto from 'crypto';
import { Resend } from 'resend';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();
const otpStore = new Map();

const resend = new Resend(process.env.RESEND_API_KEY);

const OTP_TTL_MS = 5 * 60 * 1000;
const OTP_RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;
const MIN_PASSWORD_LENGTH = 6;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeEmail = (email) => (typeof email === 'string' ? email.trim().toLowerCase() : '');
const isValidPassword = (password) => typeof password === 'string' && password.length >= MIN_PASSWORD_LENGTH;
const signToken = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const toPublicUser = (user) => ({
  id: user._id,
  email: user.email,
  favorites: user.favorites || [],
  collections: user.collections || [],
});

// Signup and password-reset codes are stored separately so one can't be
// used for the other.
const otpKey = (purpose, email) => `${purpose}:${email}`;

const issueOtp = (purpose, email) => {
  const existing = otpStore.get(otpKey(purpose, email));
  if (existing && Date.now() - existing.issuedAt < OTP_RESEND_COOLDOWN_MS) {
    return null;
  }
  const otp = crypto.randomInt(100000, 1000000).toString();
  otpStore.set(otpKey(purpose, email), { otp, issuedAt: Date.now(), expires: Date.now() + OTP_TTL_MS, attempts: 0 });
  return otp;
};

// Returns an error message, or null when the code is valid (and consumes it).
const checkOtp = (purpose, email, otp) => {
  const key = otpKey(purpose, email);
  const stored = otpStore.get(key);

  if (!stored) return 'No verification code was requested for this email';
  if (Date.now() > stored.expires) {
    otpStore.delete(key);
    return 'OTP has expired';
  }
  if (stored.otp !== String(otp)) {
    stored.attempts += 1;
    if (stored.attempts >= MAX_OTP_ATTEMPTS) {
      otpStore.delete(key);
      return 'Too many incorrect attempts. Please request a new code.';
    }
    return 'Invalid OTP';
  }

  otpStore.delete(key);
  return null;
};

// Periodically clear out expired codes so the map doesn't grow forever.
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of otpStore) {
    if (now > value.expires) otpStore.delete(key);
  }
}, OTP_TTL_MS).unref();

const renderOtpEmail = ({ heading, intro, label, otp, footnote }) => `
        <!DOCTYPE html>
        <html>
        <body style="background-color: #f4f7f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 40px 0;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">

            <div style="background-color: #5a6c3a; padding: 35px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 26px; letter-spacing: 6px; font-weight: 400; text-transform: uppercase;">PEONY</h1>
            </div>

            <div style="padding: 40px 40px; text-align: center;">
              <h2 style="color: #2c3e50; margin-top: 0; font-size: 22px; font-weight: 600;">${heading}</h2>
              <p style="color: #555555; font-size: 16px; line-height: 1.6; margin-bottom: 35px;">
                ${intro}
              </p>

              <div style="background-color: #f8faf7; border: 2px dashed #5a6c3a; border-radius: 8px; padding: 25px; margin: 0 auto 35px auto; max-width: 280px;">
                <p style="margin: 0; font-size: 11px; color: #5a6c3a; text-transform: uppercase; font-weight: 700; letter-spacing: 1.5px;">${label}</p>
                <h1 style="color: #2c3e50; font-size: 42px; margin: 15px 0 0 0; letter-spacing: 12px; font-weight: 700; padding-left: 12px;">${otp}</h1>
              </div>

              <p style="color: #888888; font-size: 14px; line-height: 1.5;">
                This code will expire in exactly <strong>5 minutes</strong>.<br>${footnote}
              </p>
            </div>

            <div style="background-color: #fcfcfc; border-top: 1px solid #eeeeee; padding: 25px; text-align: center;">
              <p style="color: #aaaaaa; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Peony Flower Catalogue. All rights reserved.</p>
            </div>

          </div>
        </body>
        </html>
      `;

// ==========================================
// 1. SIGNUP: SEND OTP
// ==========================================
router.post('/send-otp', async (req, res) => {
  const email = normalizeEmail(req.body.email);
  if (!EMAIL_PATTERN.test(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists. Please log in.' });
    }

    const otp = issueOtp('signup', email);
    if (!otp) {
      return res.status(429).json({ message: 'Please wait a minute before requesting another code.' });
    }

    const { data, error } = await resend.emails.send({
      from: 'Peony <onboarding@resend.dev>',
      to: email,
      subject: 'Your Peony Verification Code',
      html: renderOtpEmail({
        heading: 'Welcome to the Catalogue',
        intro: 'We are thrilled to have you! To complete your registration and unlock full access to save your favorite blooms, please use the verification code below.',
        label: 'Your Verification Code',
        otp,
        footnote: "If you didn't request this, you can safely ignore this email.",
      }),
    });

    if (error) {
      console.error('[RESEND API ERROR]', error);
      otpStore.delete(otpKey('signup', email));
      return res.status(500).json({ message: 'Failed to send verification code. Please try again.' });
    }

    console.log(`[AUTH] Signup OTP email sent, id: ${data.id}`);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('[SERVER ERROR]', error);
    res.status(500).json({ message: 'Server error processing request' });
  }
});

// ==========================================
// 2. SIGNUP: VERIFY OTP & CREATE ACCOUNT
// ==========================================
router.post('/verify-otp', async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const { password, otp } = req.body;

  if (!isValidPassword(password)) {
    return res.status(400).json({ message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` });
  }

  const otpError = checkOtp('signup', email, otp);
  if (otpError) return res.status(400).json({ message: otpError });

  try {
    if (await User.exists({ email })) {
      return res.status(400).json({ message: 'User already exists. Please log in.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword });

    res.status(201).json({
      message: 'Account created successfully',
      token: signToken(newUser),
      user: toPublicUser(newUser)
    });
  } catch (error) {
    console.error('MongoDB Save Error:', error);
    res.status(500).json({ message: 'Server error creating account' });
  }
});

// ==========================================
// 3. LOGIN
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;

    if (!email || typeof password !== 'string') {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    if (!user.password) {
      return res.status(400).json({ message: 'This account uses Google sign-in. Please continue with Google.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({
      message: 'Logged in successfully',
      token: signToken(user),
      user: toPublicUser(user)
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// ==========================================
// 4. GOOGLE SIGN-IN
// ==========================================
// The client sends the Google OAuth access token; we look up the account
// with Google ourselves rather than trusting an email sent by the browser.
router.post('/google', async (req, res) => {
  const { accessToken } = req.body;
  if (typeof accessToken !== 'string' || !accessToken) {
    return res.status(400).json({ message: 'Missing Google access token' });
  }

  try {
    const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!googleRes.ok) {
      return res.status(401).json({ message: 'Google sign-in could not be verified' });
    }

    const profile = await googleRes.json();
    const email = normalizeEmail(profile.email);
    if (!email || !profile.email_verified) {
      return res.status(401).json({ message: 'Your Google email address is not verified' });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, authProvider: 'google' });
    }

    res.status(200).json({
      message: 'Logged in with Google',
      token: signToken(user),
      user: toPublicUser(user)
    });
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    res.status(500).json({ message: 'Server error during Google sign-in' });
  }
});

// ==========================================
// 5. RESET PASSWORD: SEND OTP
// ==========================================
router.post('/forgot-password-otp', async (req, res) => {
  const email = normalizeEmail(req.body.email);
  if (!EMAIL_PATTERN.test(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' });
    }

    const otp = issueOtp('reset', email);
    if (!otp) {
      return res.status(429).json({ message: 'Please wait a minute before requesting another code.' });
    }

    const { data, error } = await resend.emails.send({
      from: 'Peony <onboarding@resend.dev>',
      to: email,
      subject: 'Reset Your Peony Password',
      html: renderOtpEmail({
        heading: 'Secure Password Reset',
        intro: 'We received a request to reset the password for your account. Please use the secure verification code below to proceed.',
        label: 'Your Reset Code',
        otp,
        footnote: "If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.",
      }),
    });

    if (error) {
      console.error('[RESEND API ERROR]', error);
      otpStore.delete(otpKey('reset', email));
      return res.status(500).json({ message: 'Failed to send reset code. Please try again.' });
    }

    console.log(`[AUTH] Reset OTP email sent, id: ${data.id}`);
    res.status(200).json({ message: 'Password reset OTP sent successfully' });
  } catch (error) {
    console.error('[SERVER ERROR]', error);
    res.status(500).json({ message: 'Server error processing request' });
  }
});

// ==========================================
// 6. RESET PASSWORD: VERIFY OTP & SAVE
// ==========================================
router.post('/reset-password', async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const { otp, newPassword } = req.body;

  if (!isValidPassword(newPassword)) {
    return res.status(400).json({ message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` });
  }

  const otpError = checkOtp('reset', email, otp);
  if (otpError) return res.status(400).json({ message: otpError });

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    res.json({ message: 'Password successfully reset' });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ message: 'Server error resetting password' });
  }
});

export default router;
