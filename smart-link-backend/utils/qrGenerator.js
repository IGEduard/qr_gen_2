const QRCode = require('qrcode');

const generateQRCode = async (url) => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(url, {
      width: 256,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    return qrCodeDataURL;
  } catch (error) {
    throw new Error('QR code generation failed');
  }
};

module.exports = { generateQRCode };