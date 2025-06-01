const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const SmartLink = require('../models/SmartLink');
const { generateQRCode } = require('../utils/qrGenerator');
const auth = require('../middleware/auth');

// Create a new smart link
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, iosLink, androidLink, webLink } = req.body;
    
    const shortId = shortid.generate();
    const smartLinkUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/api/links/${shortId}`;
    
    const qrCodeUrl = await generateQRCode(smartLinkUrl);
    
    const smartLink = new SmartLink({
    shortId,
    title,
    description,
    iosLink,
    androidLink,
    webLink,
    qrCodeUrl,
    user: req.user.id // associate with user
  });
    
    await smartLink.save();
    res.status(201).json(smartLink);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all smart links for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const links = await SmartLink.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(links);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Smart redirect endpoint
router.get('/:shortId', async (req, res) => {
  try {
    const link = await SmartLink.findOne({ shortId: req.params.shortId });
    
    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }
    
    // Increment click counter
    link.clicks += 1;
    await link.save();
    
    // Device detection logic will be added in Phase 3
    const userAgent = req.headers['user-agent'];
    
    if (/iPhone|iPad|iPod/i.test(userAgent)) {
      return res.redirect(link.iosLink);
    } else if (/Android/i.test(userAgent)) {
      return res.redirect(link.androidLink);
    } else {
      return res.redirect(link.webLink);
    }
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single smart link by shortId
router.get('/data/:shortId', async (req, res) => {
  try {
    const link = await SmartLink.findOne({ shortId: req.params.shortId });
    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }
    res.json(link);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new plain text QR
router.post('/text', auth, async (req, res) => {
  try {
    const { plainText } = req.body;
    if (!plainText) {
      return res.status(400).json({ error: 'plainText is required' });
    }

    const qrCodeUrl = await generateQRCode(plainText);

    const smartLink = new SmartLink({
      title: 'Text QR',
      description: '',
      iosLink: '',
      androidLink: '',
      webLink: '',
      qrCodeUrl,
      plainText,
      clicks: 0,
      user: req.user.id
    });
    await smartLink.save();

    res.status(201).json(smartLink);
  } catch (error) {
    console.error(error); // <--- Add this line to see the real error in your backend console!
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;