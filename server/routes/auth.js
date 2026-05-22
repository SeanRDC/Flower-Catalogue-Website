import express from 'express';
import nodemailer from 'nodemailer';
import User from '../models/User.js';

const router = express.Router();
const otpStore = new Map();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,          
  secure: false,      
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  console.log(`\n[AUTH] 1. Initiating OTP request for: ${email}`);

  try {
    // Check 1: MongoDB Connection
    console.log(`[AUTH] 2. Attempting to connect to MongoDB to check for existing user...`);
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      console.log(`[AUTH] ❌ User already exists. Aborting.`);
      return res.status(400).json({ message: 'User already exists. Please log in.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, { otp, expires: Date.now() + 300000 });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h2>Welcome!</h2>
          <p>Your verification code is:</p>
          <h1 style="color: #5a6c3a; letter-spacing: 5px; font-size: 36px;">${otp}</h1>
          <p>This code will expire in 5 minutes.</p>
        </div>
      `
    };

    // Check 2: Google Nodemailer
    console.log(`[AUTH] 3. MongoDB check passed. Attempting to send email via Nodemailer...`);
    await transporter.sendMail(mailOptions);
    
    console.log(`[AUTH] ✅ SUCCESS! Email sent to ${email}`);
    res.status(200).json({ message: 'OTP sent successfully' });
    
  } catch (error) {
    // 👇 THIS IS THE CRITICAL DEBUGGING SECTION 👇
    console.error("\n==========================================");
    console.error("🚨 [AUTH/SEND-OTP] FATAL ERROR DETECTED 🚨");
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    
    // Check if it's a Google Authentication error
    if (error.code === 'EAUTH') {
      console.error("DIAGNOSIS: Google rejected your EMAIL_USER or EMAIL_APP_PASSWORD.");
    } 
    // Check if it's a MongoDB error
    else if (error.name === 'MongoServerSelectionError' || error.name === 'MongooseError') {
      console.error("DIAGNOSIS: The server cannot connect to MongoDB. Check your MONGO_URI in Render.");
    }
    
    console.error("Full Error Object:", error);
    console.error("==========================================\n");
    
    // We are also sending the exact error back to the frontend so you can see it in Chrome!
    res.status(500).json({ 
      message: 'Failed to send OTP', 
      serverDiagnosis: error.message 
    });
  }
});

router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  const storedData = otpStore.get(email);

  if (!storedData) return res.status(400).json({ message: 'No OTP requested for this email' });
  if (Date.now() > storedData.expires) {
    otpStore.delete(email);
    return res.status(400).json({ message: 'OTP has expired' });
  }
  if (storedData.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

  otpStore.delete(email);
  res.status(200).json({ message: 'OTP Verified' });
});

export default router;