import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import ProfilePage from './ProfilePage';
import Stock from './Stock';
import SearchStock from './SearchStock';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  return (
    <Router>
      <Routes>
        {/* If authenticated, redirect to profile, otherwise show login */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/profile" /> : <LoginPage setIsAuthenticated={setIsAuthenticated} />} 
        />

        {/* Protected Profile page */}
        <Route 
          path="/profile" 
          element={isAuthenticated ? <ProfilePage /> : <Navigate to="/" />} 
        />

        {/* Protected Stock page with a route for multiple symbols */}
        <Route 
          path="/stock/:symbols" 
          element={isAuthenticated ? <Stock /> : <Navigate to="/" />} 
        />

        {/* Search Stock page */}
        <Route 
          path="/search-stock/:symbol" 
          element={isAuthenticated ? <SearchStock /> : <Navigate to="/" />} 
        />

        {/* Fallback for unmatched routes (optional) */}
        <Route 
          path="*" 
          element={<Navigate to="/" />} 
        />
      </Routes>
    </Router>
  );
};

export default App;
