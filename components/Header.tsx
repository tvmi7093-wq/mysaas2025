
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../contexts/I18nContext';
import { Language, LANGUAGES } from '../types';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { t, language, setLanguage } = useI18n();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  const generationsLeft = user ? 3 - user.generations : 0;

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-sage-green-700">{t('appName')}</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
             <select
                value={language}
                onChange={handleLanguageChange}
                className="appearance-none bg-transparent border border-gray-300 rounded-md py-1 ps-2 pe-8 text-sm focus:outline-none focus:ring-2 focus:ring-soft-orange-500"
                aria-label="Select language"
              >
                {LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
            {user?.isPaid ? (
              <span className="bg-soft-orange-300 text-soft-orange-700 font-semibold px-2 py-1 rounded-full text-xs">{t('premiumUser')}</span>
            ) : (
              <span>{t('generationsLeft')}: {generationsLeft > 0 ? generationsLeft : 0}</span>
            )}
          </div>
          
          <button
            onClick={logout}
            className="bg-soft-orange-500 text-white text-sm font-semibold py-1 px-3 rounded-md hover:bg-soft-orange-700 transition duration-300"
          >
            {t('logoutButton')}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
