import React, { useState } from 'react';
import { Plus, ExternalLink, Smartphone, Monitor, QrCode, Copy, Eye, Zap, ArrowRight, CheckCircle } from 'lucide-react';

const App = () => {
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

  const mockAPI = {
    createLink: async (data) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newLink = {
        _id: Date.now().toString(),
        shortId: Math.random().toString(36).substring(2, 8),
        ...data,
        qrCodeUrl: `data:image/svg+xml;base64,${btoa('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="white" rx="8"/><rect x="10" y="10" width="15" height="15" fill="black"/><rect x="75" y="10" width="15" height="15" fill="black"/><rect x="10" y="75" width="15" height="15" fill="black"/><rect x="35" y="35" width="30" height="30" fill="black" rx="4"/></svg>')}`,
        clicks: Math.floor(Math.random() * 1000),
        createdAt: new Date().toISOString()
      };
      return { data: newLink };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await mockAPI.createLink(formData);
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

  const getSmartLinkUrl = (shortId) => `${window.location.origin}/link/${shortId}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex flex-col">
      {/* Header */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 text-center max-w-4xl mx-auto">
        <div className="mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-3xl backdrop-blur-sm mb-6">
            <Zap className="text-white w-10 h-10" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Smart Links</h1>
          <p className="text-xl text-white text-opacity-90 max-w-2xl mx-auto leading-relaxed">
            Create intelligent links that redirect users to the perfect destination based on their device type
          </p>
        </div>

        {/* Main Action Button */}
        <button
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group mb-16"
        >
          <Plus size={24} />
          Create Smart Link
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Links Display */}
        {links.length === 0 ? (
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl p-12 border border-white border-opacity-20 max-w-md mx-auto">
            <QrCode size={48} className="text-white mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-2">No smart links yet</h3>
            <p className="text-white text-opacity-80">Create your first smart link to get started</p>
          </div>
        ) : (
          <div className="grid gap-6 max-w-4xl mx-auto w-full">
            {links.map((link) => (
              <div key={link._id} className="bg-white rounded-2xl shadow-xl p-6 text-left">
                <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{link.title}</h3>
                    {link.description && (
                      <p className="text-gray-600 mb-4">{link.description}</p>
                    )}

                    {/* Smart Link URL */}
                    <div className="bg-gray-50 rounded-xl p-3 mb-4 flex items-center gap-3">
                      <ExternalLink size={16} className="text-gray-400" />
                      <code className="flex-1 text-sm text-gray-700 break-all">
                        {getSmartLinkUrl(link.shortId)}
                      </code>
                      <button
                        onClick={() => copyToClipboard(getSmartLinkUrl(link.shortId))}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        {copySuccess ? <CheckCircle size={16} className="text-green-600" /> : <Copy size={16} />}
                      </button>
                    </div>

                    {/* Device Links */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                      {[
                        { label: 'iOS', icon: <Smartphone size={16} className="text-blue-500" />, url: link.iosLink, store: 'App Store' },
                        { label: 'Android', icon: <Smartphone size={16} className="text-green-500" />, url: link.androidLink, store: 'Play Store' },
                        { label: 'Web', icon: <Monitor size={16} className="text-purple-500" />, url: link.webLink, store: 'Web App' }
                      ].map((device, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          {device.icon}
                          <span className="text-gray-600">{device.label}:</span>
                          <a href={device.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                            {device.store}
                          </a>
                        </div>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Eye size={16} />
                        <span>{link.clicks.toLocaleString()} clicks</span>
                      </div>
                      <div>Created {new Date(link.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="text-center md:text-right">
                    <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center mb-2">
                      <img src={link.qrCodeUrl} alt="QR Code" className="w-20 h-20" />
                    </div>
                    <p className="text-xs text-gray-500">QR Code</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Link Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create Smart Link</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {['title', 'description', 'iosLink', 'androidLink', 'webLink'].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field.replace('Link', ' Link')}</label>
                    {field === 'description' ? (
                      <textarea
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        placeholder="Brief description of your app"
                        rows="3"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <input
                        type={field.includes('Link') ? 'url' : 'text'}
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        required={field !== 'description'}
                        placeholder={
                          field.includes('ios') ? 'https://apps.apple.com/app/...' :
                          field.includes('android') ? 'https://play.google.com/store/apps/details?id=...' :
                          field.includes('web') ? 'https://your-web-app.com' : 'My Awesome App'
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    )}
                  </div>
                ))}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Creating...' : 'Create Link'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
