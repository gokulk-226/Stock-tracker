import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import StockSearch from './components/StockSearch';
import Portfolio from './components/Portfolio';
import Login from './components/Login';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="app">
        <header className="header">
          <h1>Stock Portfolio Manager</h1>
          <nav>
            <ul>
              {isLoggedIn && (
                <>
                  <li><Link to="/">Search</Link></li>
                  <li><Link to="/portfolio">Portfolio</Link></li>
                </>
              )}
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
            {!isLoggedIn ? (
              <Route path="*" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            ) : (
              <>
                <Route path="/" element={<StockSearch />} />
                <Route path="/portfolio" element={<Portfolio />} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
