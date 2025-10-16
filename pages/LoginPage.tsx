
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../contexts/I18nContext';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { t } = useI18n();

  return (
    <div className="flex items-center justify-center min-h-screen bg-beige-100">
      <div className="text-center p-8 bg-white shadow-xl rounded-lg max-w-sm w-full">
        <h1 className="text-3xl font-bold text-brand-text mb-4">{t('appName')}</h1>
        <p className="text-gray-600 mb-8">{t('loginTitle')}</p>
        <button
          onClick={login}
          className="w-full bg-sage-green-500 hover:bg-sage-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
            <path fill="#FF3D00" d="M6.306 14.691c-1.229 2.583-1.999 5.433-1.999 8.539c0 3.106.77 5.956 1.999 8.539l-6.044 4.733A19.928 19.928 0 0 1 0 24c0-3.562.91-6.885 2.508-9.696l6.21 2.387-2.412 2.000z" />
            <path fill="#4CAF50" d="M24 48c5.166 0 9.86-1.977 13.409-5.192l-6.19-4.848C29.211 40.091 26.715 42 24 42c-4.832 0-8.94-3.138-10.36-7.468l-6.353 4.953C9.602 44.627 16.257 48 24 48z" />
          </svg>
          <span>{t('loginButton')}</span>
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
