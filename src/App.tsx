import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import ArticlePage from './components/ArticlePage';
import NotFoundPage from './components/NotFoundPage';
import { Language } from './types';

function AppContent() {
  const [language, setLanguage] = useState<Language>('tamil');
  const location = useLocation();
  const navigate = useNavigate();

  // Read language from URL parameter on mount and route changes
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const langParam = urlParams.get('la');
    
    if (langParam === 'english' || langParam === 'tamil') {
      setLanguage(langParam as Language);
    }
  }, [location.search]);

  // Enhanced setLanguage function to update URL
  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    
    // Update URL with language parameter
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('la', newLanguage);
    
    // Navigate to the same path with updated language parameter
    navigate({
      pathname: location.pathname,
      search: urlParams.toString()
    }, { replace: true });
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={<HomePage language={language} setLanguage={handleLanguageChange} />} 
      />
      <Route 
        path="/article/:id" 
        element={<ArticlePage language={language} setLanguage={handleLanguageChange} />} 
      />
      <Route 
        path="*" 
        element={<NotFoundPage language={language} />} 
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;