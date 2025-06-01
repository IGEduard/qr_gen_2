const mongoose = require('mongoose');

const SmartLinkSchema = new mongoose.Schema({
  shortId: {
    type: String,
    unique: true,
    sparse: true // allow multiple docs with no shortId
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  iosLink: String,
  androidLink: String,
  webLink: String,
  plainText: String, // <-- add this line
  qrCodeUrl: {
    type: String,
    required: true
  },
  clicks: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
});

module.exports = mongoose.model('SmartLink', SmartLinkSchema);