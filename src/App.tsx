import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import HomePage from './components/HomePage';
import DynamicComponentArticlePage from './components/DynamicComponentArticlePage';
import NotFoundPage from './components/NotFoundPage';
import GlobalClickTracker from './components/GlobalClickTracker';
import { Language } from './types';
import { useGoogleAnalytics } from './hooks/useGoogleAnalytics';

function AppContent() {
  const [language, setLanguage] = useState<Language>('tamil');
  const location = useLocation();
  const navigate = useNavigate();
  const { trackLanguageChange } = useGoogleAnalytics();

  // Read language from URL parameter on mount and route changes
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const langParam = urlParams.get('la');
    
    if (langParam === 'english' || langParam === 'tamil') {
      setLanguage(langParam as Language);
    }
  }, [location.search]);

  // Enhanced setLanguage function to update URL and track language changes
  const handleLanguageChange = (newLanguage: Language) => {
    const previousLanguage = language;
    setLanguage(newLanguage);
    
    // Track language change
    trackLanguageChange(previousLanguage, newLanguage);
    
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
        element={<DynamicComponentArticlePage language={language} setLanguage={handleLanguageChange} />} 
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
      <GlobalClickTracker />
      <AppContent />
    </Router>
  );
}

export default App;