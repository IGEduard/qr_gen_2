import { useState } from 'react';
import { authAPI } from '../services/api';

const ResetPassword = ({ token }) => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const goToLogin = () => {
    window.location.href = '/'; // or use navigate('/') if you have a router
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authAPI.resetPassword(token, { password });
      setMessage('Password reset successful! You can now log in.');
    } catch (err) {
      setMessage('Error resetting password.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-blue-700"
      >
        Reset Password
      </button>
      {message && (
        <div className="mt-4 text-green-600">
          {message}
          <button
            type="button"
            onClick={goToLogin}
            className="block mt-4 w-full bg-gray-700 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-gray-800"
          >
            Back to Login
          </button>
        </div>
      )}
    </form>
  );
};

export default ResetPassword;