import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StockSearch from './components/StockSearch';
import Portfolio from './components/Portfolio';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="header">
          <h1>Stock Portfolio Manager</h1>
          <nav>
            <ul>
              <li><a href="/">Search</a></li>
              <li><a href="/portfolio">Portfolio</a></li>
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<StockSearch />} />
            <Route path="/portfolio" element={<Portfolio />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
