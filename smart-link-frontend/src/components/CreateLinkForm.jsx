import { useState } from 'react';
import { linkAPI } from '../services/api';

const CreateLinkForm = ({ onLinkCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    iosLink: '',
    androidLink: '',
    webLink: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await linkAPI.createLink(formData);
      onLinkCreated(response.data);
      setFormData({
        title: '',
        description: '',
        iosLink: '',
        androidLink: '',
        webLink: ''
      });
    } catch (error) {
      console.error('Error creating link:', error);
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

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create Smart Link</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
          rows="3"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">iOS App Store Link</label>
        <input
          type="url"
          name="iosLink"
          value={formData.iosLink}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Android Play Store Link</label>
        <input
          type="url"
          name="androidLink"
          value={formData.androidLink}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Web App Link</label>
        <input
          type="url"
          name="webLink"
          value={formData.webLink}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Smart Link'}
      </button>
    </form>
  );
};

export default CreateLinkForm;