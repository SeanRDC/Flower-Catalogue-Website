import express from 'express';
import { Resend } from 'resend';
import User from '../models/User.js';

const router = express.Router();
const otpStore = new Map();

const resend = new Resend(process.env.RESEND_API_KEY);

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
      from: 'Peony <onboarding@resend.dev>', // Resend's default testing address
      to: email,
      subject: 'Your Peony Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h2>Welcome!</h2>
          <p>Your verification code is:</p>
          <h1 style="color: #5a6c3a; letter-spacing: 5px; font-size: 36px;">${otp}</h1>
          <p>This code will expire in 5 minutes.</p>
        </div>
      `
    });

    if (error) {
      console.error("\n [RESEND API ERROR] ", error);
      return res.status(500).json({ message: 'API failed to send OTP', details: error.message });
    }

    console.log(`[AUTH]  SUCCESS! API Email delivered with ID: ${data.id}`);
    res.status(200).json({ message: 'OTP sent successfully' });
    
  } catch (error) {
    console.error("\n[SERVER ERROR]", error);
    res.status(500).json({ message: 'Server error processing request' });
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