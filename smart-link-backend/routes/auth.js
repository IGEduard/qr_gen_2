const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Mailjet = require('node-mailjet');
const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_API_KEY,
  apiSecret: process.env.MAILJET_API_SECRET,
});

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Register
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already in use' });
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hash });
    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Forgot password route
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'User not found' });

  // Generate reset token
  const token = crypto.randomBytes(32).toString('hex');
  user.resetToken = token;
  user.resetTokenExpires = Date.now() + 3600 * 1000; // 1 hour
  await user.save();

  // Send email using Mailjet
  try {
    const request = mailjet
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: process.env.MAILJET_SENDER,
              Name: "Smart Link App"
            },
            To: [
              {
                Email: email,
                Name: user.email
              }
            ],
            Subject: "Password Reset",
            HTMLPart: `<p>Reset your password: <a href="${process.env.FRONTEND_URL}/reset-password/${token}">Click here</a></p>`
          }
        ]
      });
    await request;
    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error('Mailjet error:', err);
    res.status(500).json({ error: 'Error sending reset email' });
  }
});

// Reset password route
router.post('/reset-password/:token', async (req, res) => {
  const { password } = req.body;
  const user = await User.findOne({
    resetToken: req.params.token,
    resetTokenExpires: { $gt: Date.now() }
  });
  if (!user) return res.status(400).json({ error: 'Invalid or expired token' });

  // Hash the new password before saving!
  const hash = await bcrypt.hash(password, 10);
  user.password = hash;
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;
  await user.save();

  res.json({ message: 'Password reset successful' });
});

module.exports = router;