import React, { useState, useEffect } from 'react';
import { Plus, ExternalLink, Smartphone, Monitor, QrCode, Copy, Eye } from 'lucide-react';

const App = () => {
  const [links, setLinks] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    iosLink: '',
    androidLink: '',
    webLink: ''
  });

  // Mock API functions (replace with real API calls later)
  const mockAPI = {
    createLink: async (data) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newLink = {
        _id: Date.now().toString(),
        shortId: Math.random().toString(36).substring(2, 8),
        ...data,
        qrCodeUrl: `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="white"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="black" font-size="12">QR Code</text></svg>`)}`,
        clicks: 0,
        createdAt: new Date().toISOString()
      };
      
      return { data: newLink };
    },
    
    getAllLinks: async () => {
      // Return mock data or existing links
      return { data: links };
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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Link copied to clipboard!');
  };

  const getSmartLinkUrl = (shortId) => {
    return `${window.location.origin}/link/${shortId}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Smart Links</h1>
              <p className="text-gray-600">Create intelligent links that redirect based on device type</p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Create Link
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Create Link Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Create Smart Link</h2>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      placeholder="My Awesome App"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Brief description of your app"
                      rows="3"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      iOS App Store Link *
                    </label>
                    <input
                      type="url"
                      name="iosLink"
                      value={formData.iosLink}
                      onChange={handleChange}
                      required
                      placeholder="https://apps.apple.com/app/..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Android Play Store Link *
                    </label>
                    <input
                      type="url"
                      name="androidLink"
                      value={formData.androidLink}
                      onChange={handleChange}
                      required
                      placeholder="https://play.google.com/store/apps/details?id=..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Web App Link *
                    </label>
                    <input
                      type="url"
                      name="webLink"
                      value={formData.webLink}
                      onChange={handleChange}
                      required
                      placeholder="https://your-web-app.com"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {loading ? 'Creating...' : 'Create Link'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Links List */}
        {links.length === 0 ? (
          <div className="text-center py-12">
            <QrCode size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No smart links yet</h3>
            <p className="text-gray-600 mb-6">Create your first smart link to get started</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Link
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {links.map((link) => (
              <div key={link._id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {link.title}
                    </h3>
                    {link.description && (
                      <p className="text-gray-600 mb-3">{link.description}</p>
                    )}
                    
                    {/* Smart Link URL */}
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3 mb-4">
                      <ExternalLink size={16} className="text-gray-400" />
                      <code className="flex-1 text-sm text-gray-700">
                        {getSmartLinkUrl(link.shortId)}
                      </code>
                      <button
                        onClick={() => copyToClipboard(getSmartLinkUrl(link.shortId))}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Copy link"
                      >
                        <Copy size={16} />
                      </button>
                    </div>

                    {/* Device Links */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Smartphone size={16} className="text-blue-500" />
                        <span className="text-gray-600">iOS:</span>
                        <a 
                          href={link.iosLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate"
                        >
                          App Store
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Smartphone size={16} className="text-green-500" />
                        <span className="text-gray-600">Android:</span>
                        <a 
                          href={link.androidLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate"
                        >
                          Play Store
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Monitor size={16} className="text-purple-500" />
                        <span className="text-gray-600">Web:</span>
                        <a 
                          href={link.webLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate"
                        >
                          Web App
                        </a>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Eye size={16} />
                        <span>{link.clicks} clicks</span>
                      </div>
                      <div>
                        Created {new Date(link.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="ml-6 text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                      <img 
                        src={link.qrCodeUrl} 
                        alt="QR Code" 
                        className="w-20 h-20"
                      />
                    </div>
                    <p className="text-xs text-gray-500">QR Code</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;