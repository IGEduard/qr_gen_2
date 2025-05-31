const UAParser = require('ua-parser-js');

const detectDevice = (req, res, next) => {
  const parser = new UAParser();
  const ua = parser.setUA(req.headers['user-agent']).getResult();
  
  req.deviceInfo = {
    browser: ua.browser,
    os: ua.os,
    device: ua.device,
    isMobile: ua.device.type === 'mobile',
    isTablet: ua.device.type === 'tablet',
    isDesktop: !ua.device.type || ua.device.type === 'desktop',
    isIOS: ua.os.name === 'iOS',
    isAndroid: ua.os.name === 'Android'
  };
  
  next();
};

module.exports = { detectDevice };