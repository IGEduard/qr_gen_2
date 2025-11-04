// smart-link-frontend/src/components/ResetPassword.jsx

import { useState } from 'react';
import { authAPI } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

const ResetPassword = ({ token }) => {
  const { t } = useLanguage();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const goToLogin = () => {
    window.location.href = '/';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authAPI.resetPassword(token, { password });
      setMessage(t('resetPasswordSuccess'));
    } catch (err) {
      setMessage(t('resetPasswordError'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md w-full border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-white">{t('resetPasswordTitle')}</h2>
        <input
          type="password"
          placeholder={t('newPassword')}
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg cursor-pointer transition-colors font-semibold"
        >
          {t('resetPasswordButton')}
        </button>
        {message && (
          <div className="mt-4 text-green-400 bg-green-900/20 border border-green-700 rounded-lg p-4">
            {message}
            <button
              type="button"
              onClick={goToLogin}
              className="block mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg cursor-pointer transition-colors"
            >
              {t('backToLogin')}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ResetPassword;