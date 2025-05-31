const mongoose = require('mongoose');

const SmartLinkSchema = new mongoose.Schema({
  shortId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  iosLink: {
    type: String,
    required: true
  },
  androidLink: {
    type: String,
    required: true
  },
  webLink: {
    type: String,
    required: true
  },
  qrCodeUrl: String,
  clicks: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SmartLink', SmartLinkSchema);