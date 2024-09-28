import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStocks, setFilteredStocks] = useState([]);

  // Sample stock symbols for filtering
  const currentStocks = ['GOOGL', 'MSFT', 'TSLA', 'AMZN', 'FB'];
  const interestedStocks = ['IBM', 'AAPL', 'NFLX', 'NVDA', 'BABA'];

  const stockSymbols = [...currentStocks, ...interestedStocks];

  const goToStocks = (type) => {
    const stocks = type === 'current' ? currentStocks : interestedStocks;
    navigate(`/stock/${stocks.join(',')}`); // Pass multiple symbols to the Stock.js page
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value) {
      const filtered = stockSymbols.filter(symbol =>
        symbol.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredStocks(filtered);
    } else {
      setFilteredStocks([]);
    }
  };

  const handleSearchButtonClick = () => {
    const upperCaseSearchTerm = searchTerm.toUpperCase();
    if (upperCaseSearchTerm && stockSymbols.includes(upperCaseSearchTerm)) {
      navigate(`/search-stock/${upperCaseSearchTerm}`); // Navigate to the SearchStock.js page
    } else {
      alert('Stock symbol not found!'); // Show alert if stock symbol is not found
    }
  };

  return (
    <div className="profile-page">
      <header className="navbar">
        <h1 className="navbar-title">Stock Market Tracker</h1>
        <nav className="navbar-links">
          <button onClick={() => goToStocks('current')}>Current Stocks</button>
          <button onClick={() => goToStocks('interested')}>Interested Stocks</button>
        </nav>
      </header>
      <div className="profile-content">
        <h2>Welcome back, user!</h2>
        <p>Keep track of your current stocks and interested stocks below.</p>

        {/* Search bar with a button inside the bar */}
        <div className="search-container">
          <div className="search-bar-wrapper">
            <input
              type="text"
              placeholder="Search for a stock symbol..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-bar"
            />
            <button onClick={handleSearchButtonClick} className="search-button">
              🔍
            </button>
          </div>
        </div>

        {/* Display the filtered stock results */}
        <div className="search-results">
          {filteredStocks.length > 0 ? (
            <select className="stock-select">
              {filteredStocks.map(symbol => (
                <option key={symbol} value={symbol}>
                  {symbol}
                </option>
              ))}
            </select>
          ) : (
            <p>No matching stocks found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
