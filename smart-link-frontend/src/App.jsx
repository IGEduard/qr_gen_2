import React, { useState, useEffect } from 'react';
import { Plus, ExternalLink, Smartphone, Monitor, QrCode, Copy, Eye, Zap, ArrowRight, CheckCircle, Moon } from 'lucide-react';
import { linkAPI } from './services/api'; // Add this import

// Simple router hook
const useRouter = () => {
  const [pathname, setPathname] = useState(window.location.pathname);
  
  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname);
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  
  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setPathname(path);
  };
  
  return { pathname, navigate };
};

// Device detection function
const detectDevice = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return 'ios';
  }
  
  if (/android/i.test(userAgent)) {
    return 'android';
  }
  
  return 'web';
};

// Smart Link Redirect Component
const SmartLinkRedirect = ({ shortId }) => {
  const [redirecting, setRedirecting] = useState(true);
  const [link, setLink] = useState(null);
  const [device, setDevice] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLink = async () => {
      try {
        const response = await linkAPI.getLink(shortId);
        setLink(response.data);
      } catch (err) {
        setLink(null);
      } finally {
        setLoading(false);
      }
    };
    fetchLink();
    setDevice(detectDevice());
  }, [shortId]);

  useEffect(() => {
    if (!loading && link) {
      console.log('Redirecting to:', link, 'Device:', device); // Add this line
      setTimeout(() => {
        let redirectUrl;
        switch (device) {
          case 'ios':
            redirectUrl = link.iosLink;
            break;
          case 'android':
            redirectUrl = link.androidLink;
            break;
          default:
            redirectUrl = link.webLink;
        }
        if (redirectUrl) {
          window.location.href = redirectUrl;
        } else {
          setRedirecting(false);
        }
      }, 2000);
    } else if (!loading && !link) {
      setRedirecting(false);
    }
  }, [loading, link, device]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!redirecting && !link) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExternalLink size={32} />
          </div>
          <h1 className="text-2xl font-bold mb-2">Link Not Found</h1>
          <p className="text-gray-400 mb-6">The smart link you're looking for doesn't exist.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <Zap size={32} />
        </div>
        <h1 className="text-3xl font-bold mb-4">Redirecting...</h1>
        <p className="text-gray-400 mb-2">Detected device: <span className="text-blue-400 capitalize">{device}</span></p>
        {link && (
          <p className="text-gray-400">Taking you to <span className="text-white font-semibold">{link.title}</span></p>
        )}
        
        {!redirecting && (
          <div className="mt-8 p-6 bg-gray-800 rounded-lg max-w-md mx-auto">
            <p className="text-gray-400 mb-4">Automatic redirect failed. Choose your destination:</p>
            <div className="space-y-3">
              {link?.iosLink && (
                <a
                  href={link.iosLink}
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  Open on iOS
                </a>
              )}
              {link?.androidLink && (
                <a
                  href={link.androidLink}
                  className="block w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  Open on Android
                </a>
              )}
              {link?.webLink && (
                <a
                  href={link.webLink}
                  className="block w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  Open Web App
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const { pathname, navigate } = useRouter();
  const [links, setLinks] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    iosLink: '',
    androidLink: '',
    webLink: ''
  });

  // Generate QR code using an online service (for demo purposes)
  const generateQRCodeUrl = (text) => {
    const encodedText = encodeURIComponent(text);
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedText}&bgcolor=ffffff&color=000000&format=png`;
  };

  const mockAPI = {
    createLink: async (data) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const shortId = Math.random().toString(36).substring(2, 8);
      const smartLinkUrl = `${window.location.origin}/link/${shortId}`;
      
      const newLink = {
        _id: Date.now().toString(),
        shortId,
        ...data,
        qrCodeUrl: generateQRCodeUrl(smartLinkUrl),
        clicks: Math.floor(Math.random() * 1000),
        createdAt: new Date().toISOString()
      };
      return { data: newLink };
    }
  };

  // Check if current path is a smart link
  const linkMatch = pathname.match(/^\/link\/(.+)$/);
  if (linkMatch) {
    const shortId = linkMatch[1];
    return <SmartLinkRedirect shortId={shortId} links={links} />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use the real backend API instead of mockAPI
      const response = await linkAPI.createLink(formData);
      setLinks([response.data, ...links]);
      setFormData({
        title: '',
        description: '',
        iosLink: '',
        androidLink: '',
        webLink: ''
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating link:', error);
      alert('Error creating link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getSmartLinkUrl = (shortId) => {
    const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
    return `${baseUrl}/api/links/${shortId}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header with device-like styling */}
      <div className="bg-black border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Zap className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Smart Links</h1>
              <p className="text-xs text-gray-400">Device-intelligent routing</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Moon size={14} />
            <span>Dark Mode</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center px-4 py-8 max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 rounded-3xl mb-6 shadow-2xl">
            <Zap className="text-white w-10 h-10" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Intelligent Link Management
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Create smart links that automatically redirect users to the perfect app store or web destination based on their device
          </p>
        </div>

        {/* Main Action Button */}
        <button
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group mb-12"
        >
          <Plus size={24} />
          Create Smart Link
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Links Display */}
        {links.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 rounded-3xl p-12 max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <QrCode size={32} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No smart links yet</h3>
            <p className="text-gray-400">Create your first smart link to get started</p>
          </div>
        ) : (
          <div className="grid gap-6 w-full">
            {links.map((link) => (
              <div key={link._id} className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl p-6 hover:bg-gray-750 transition-colors">
                <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{link.title}</h3>
                    {link.description && (
                      <p className="text-gray-400 mb-4">{link.description}</p>
                    )}

                    {/* Smart Link URL */}
                    <div className="bg-gray-900 border border-gray-600 rounded-xl p-3 mb-4 flex items-center gap-3">
                      <ExternalLink size={16} className="text-gray-400" />
                      <code className="flex-1 text-sm text-blue-400 break-all font-mono">
                        {getSmartLinkUrl(link.shortId)}
                      </code>
                      <button
                        onClick={() => copyToClipboard(getSmartLinkUrl(link.shortId))}
                        className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
                      >
                        {copySuccess ? <CheckCircle size={16} className="text-green-400" /> : <Copy size={16} />}
                      </button>
                    </div>

                    {/* Device Links */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                      {[
                        { label: 'iOS', icon: <Smartphone size={16} className="text-blue-400" />, url: link.iosLink, store: 'App Store' },
                        { label: 'Android', icon: <Smartphone size={16} className="text-green-400" />, url: link.androidLink, store: 'Play Store' },
                        { label: 'Web', icon: <Monitor size={16} className="text-purple-400" />, url: link.webLink, store: 'Web App' }
                      ].map((device, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm bg-gray-900 rounded-lg p-2">
                          {device.icon}
                          <span className="text-gray-300">{device.label}:</span>
                          <a href={device.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline truncate">
                            {device.store}
                          </a>
                        </div>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Eye size={16} />
                        <span>{link.clicks.toLocaleString()} clicks</span>
                      </div>
                      <div>Created {new Date(link.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="text-center md:text-right">
                    <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center mb-2 shadow-lg">
                      <img src={link.qrCodeUrl} alt="QR Code" className="w-20 h-20" />
                    </div>
                    <p className="text-xs text-gray-400">QR Code</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Link Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Create Smart Link</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-gray-200 text-2xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-700"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {[
                  { field: 'title', label: 'Title', type: 'text', placeholder: 'My Awesome App' },
                  { field: 'description', label: 'Description', type: 'textarea', placeholder: 'Brief description of your app' },
                  { field: 'iosLink', label: 'iOS Link', type: 'url', placeholder: 'https://apps.apple.com/app/...' },
                  { field: 'androidLink', label: 'Android Link', type: 'url', placeholder: 'https://play.google.com/store/apps/details?id=...' },
                  { field: 'webLink', label: 'Web Link', type: 'url', placeholder: 'https://your-web-app.com' }
                ].map(({ field, label, type, placeholder }) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
                    {type === 'textarea' ? (
                      <textarea
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        placeholder={placeholder}
                        rows="3"
                        className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      />
                    ) : (
                      <input
                        type={type}
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        required={field !== 'description'}
                        placeholder={placeholder}
                        className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      />
                    )}
                  </div>
                ))}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Creating...' : 'Create Link'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;