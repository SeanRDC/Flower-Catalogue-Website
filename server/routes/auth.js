import express from 'express';
import { Resend } from 'resend';
import jwt from 'jsonwebtoeken';
import bcrypt from 'bcryptjs';
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
      from: 'Peony <onboarding@resend.dev>', 
      to: email,
      subject: 'Your Peony Verification Code',
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #f9f9f9; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #5a6c3a; margin: 0; font-size: 28px; letter-spacing: 2px;">PEONY</h1>
            <p style="color: #666; font-size: 16px; margin-top: 5px;">Botanical Catalogue</p>
          </div>
          <div style="background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); text-align: center;">
            <h2 style="color: #333; margin-top: 0;">Verify your email</h2>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 30px;">
              Thank you for joining Peony! Please use the verification code below to complete your registration. This code will expire in exactly 5 minutes.
            </p>
            <div style="background-color: #f4f6f1; padding: 20px; border-radius: 6px; display: inline-block; margin-bottom: 30px; border: 1px solid #e0e5d5;">
              <h1 style="color: #5a6c3a; letter-spacing: 12px; font-size: 42px; margin: 0; font-weight: bold; padding-left: 12px;">${otp}</h1>
            </div>
            <p style="color: #999; font-size: 14px; margin-bottom: 0;">
              If you didn't request this code, you can safely ignore this email.
            </p>
          </div>
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

export default router;