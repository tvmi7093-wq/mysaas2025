
import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { I18nProvider } from './contexts/I18nContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

const App: React.FC = () => {
  return (
    <I18nProvider>
      <AuthProvider>
        <Main />
      </AuthProvider>
    </I18nProvider>
  );
};

const Main: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {user ? <HomePage /> : <LoginPage />}
    </div>
  );
};

export default App;
