import express from 'express';
import { Resend } from 'resend';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();
const otpStore = new Map();

const resend = new Resend(process.env.RESEND_API_KEY);

// ==========================================
// 1. SIGNUP: SEND OTP
// ==========================================
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  console.log(`\n[AUTH] 1. Initiating API OTP request for: ${email}`);

  try {
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      console.log(`[AUTH] User already exists. Aborting.`);
      return res.status(400).json({ message: 'User already exists. Please log in.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, { otp, expires: Date.now() + 300000 });

    console.log(`[AUTH] 2. Bypassing SMTP. Sending via Resend API...`);

    const { data, error } = await resend.emails.send({
      from: 'Peony <onboarding@resend.dev>', 
      to: email,
      subject: 'Your Peony Verification Code',
      html: `
        <!DOCTYPE html>
        <html>
        <body style="background-color: #f4f7f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 40px 0;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
            
            <div style="background-color: #5a6c3a; padding: 35px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 26px; letter-spacing: 6px; font-weight: 400; text-transform: uppercase;">PEONY</h1>
            </div>
            
            <div style="padding: 40px 40px; text-align: center;">
              <h2 style="color: #2c3e50; margin-top: 0; font-size: 22px; font-weight: 600;">Welcome to the Catalogue</h2>
              <p style="color: #555555; font-size: 16px; line-height: 1.6; margin-bottom: 35px;">
                We are thrilled to have you! To complete your registration and unlock full access to save your favorite blooms, please use the verification code below.
              </p>
              
              <div style="background-color: #f8faf7; border: 2px dashed #5a6c3a; border-radius: 8px; padding: 25px; margin: 0 auto 35px auto; max-width: 280px;">
                <p style="margin: 0; font-size: 11px; color: #5a6c3a; text-transform: uppercase; font-weight: 700; letter-spacing: 1.5px;">Your Verification Code</p>
                <h1 style="color: #2c3e50; font-size: 42px; margin: 15px 0 0 0; letter-spacing: 12px; font-weight: 700; padding-left: 12px;">${otp}</h1>
              </div>
              
              <p style="color: #888888; font-size: 14px; line-height: 1.5;">
                This code will expire in exactly <strong>5 minutes</strong>.<br>If you didn't request this, you can safely ignore this email.
              </p>
            </div>
            
            <div style="background-color: #fcfcfc; border-top: 1px solid #eeeeee; padding: 25px; text-align: center;">
              <p style="color: #aaaaaa; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Peony Flower Catalogue. All rights reserved.</p>
            </div>
            
          </div>
        </body>
        </html>
      `
    });

    if (error) {
      console.error("\n [RESEND API ERROR] ", error);
      return res.status(500).json({ message: 'API failed to send OTP', details: error.message });
    }

    console.log(`[AUTH] SUCCESS! API Email delivered with ID: ${data.id}`);
    res.status(200).json({ message: 'OTP sent successfully' });
    
  } catch (error) {
    console.error("\n[SERVER ERROR]", error);
    res.status(500).json({ message: 'Server error processing request' });
  }
});

// ==========================================
// 2. SIGNUP: VERIFY OTP & CREATE ACCOUNT
// ==========================================
router.post('/verify-otp', async (req, res) => {
  const { email, password, otp } = req.body; 
  const storedData = otpStore.get(email);

  if (!storedData) return res.status(400).json({ message: 'No OTP requested for this email' });
  if (Date.now() > storedData.expires) {
    otpStore.delete(email);
    return res.status(400).json({ message: 'OTP has expired' });
  }
  if (storedData.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

  try {
    otpStore.delete(email);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword
    });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ 
      message: 'Account created successfully',
      token,
      user: { id: newUser._id, email: newUser.email, favorites: [], collections: [] }
    });
  } catch (error) {
    console.error("MongoDB Save Error:", error);
    res.status(500).json({ message: 'Server error creating account' });
  }
});

// ==========================================
// 3. LOGIN
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      message: 'Logged in successfully',
      token,
      user: { 
        id: user._id, 
        email: user.email, 
        favorites: user.favorites, 
        collections: user.collections 
      }
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// ==========================================
// 4. RESET PASSWORD: SEND OTP
// ==========================================
router.post('/forgot-password-otp', async (req, res) => {
  const { email } = req.body;
  console.log(`\n[AUTH] Initiating Password Reset OTP for: ${email}`);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, { otp, expires: Date.now() + 300000 });

    const { data, error } = await resend.emails.send({
      from: 'Peony <onboarding@resend.dev>', 
      to: email,
      subject: 'Reset Your Peony Password',
      html: `
        <!DOCTYPE html>
        <html>
        <body style="background-color: #f4f7f6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 40px 0;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
            
            <div style="background-color: #5a6c3a; padding: 35px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 26px; letter-spacing: 6px; font-weight: 400; text-transform: uppercase;">PEONY</h1>
            </div>
            
            <div style="padding: 40px 40px; text-align: center;">
              <h2 style="color: #2c3e50; margin-top: 0; font-size: 22px; font-weight: 600;">Secure Password Reset</h2>
              <p style="color: #555555; font-size: 16px; line-height: 1.6; margin-bottom: 35px;">
                We received a request to reset the password for your account. Please use the secure verification code below to proceed.
              </p>
              
              <div style="background-color: #f8faf7; border: 2px dashed #5a6c3a; border-radius: 8px; padding: 25px; margin: 0 auto 35px auto; max-width: 280px;">
                <p style="margin: 0; font-size: 11px; color: #5a6c3a; text-transform: uppercase; font-weight: 700; letter-spacing: 1.5px;">Your Reset Code</p>
                <h1 style="color: #2c3e50; font-size: 42px; margin: 15px 0 0 0; letter-spacing: 12px; font-weight: 700; padding-left: 12px;">${otp}</h1>
              </div>
              
              <p style="color: #888888; font-size: 14px; line-height: 1.5;">
                This code will expire in exactly <strong>5 minutes</strong>.<br>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
              </p>
            </div>
            
            <div style="background-color: #fcfcfc; border-top: 1px solid #eeeeee; padding: 25px; text-align: center;">
              <p style="color: #aaaaaa; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Peony Flower Catalogue. All rights reserved.</p>
            </div>
            
          </div>
        </body>
        </html>
      `
    });

    if (error) {
      console.error("\n [RESEND API ERROR] ", error);
      return res.status(500).json({ message: 'API failed to send OTP', details: error.message });
    }

    console.log(`[AUTH] SUCCESS! Reset Email delivered with ID: ${data.id}`);
    res.status(200).json({ message: 'Password reset OTP sent successfully' });
    
  } catch (error) {
    console.error("\n[SERVER ERROR]", error);
    res.status(500).json({ message: 'Server error processing request' });
  }
});

// ==========================================
// 5. RESET PASSWORD: VERIFY OTP & SAVE
// ==========================================
router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const storedData = otpStore.get(email);

  if (!storedData) return res.status(400).json({ message: 'No password reset requested for this email' });
  if (Date.now() > storedData.expires) {
    otpStore.delete(email);
    return res.status(400).json({ message: 'OTP has expired' });
  }
  if (storedData.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

  try {
    otpStore.delete(email); 

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    res.json({ message: 'Password successfully reset' });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: 'Server error resetting password' });
  }
});

export default router;