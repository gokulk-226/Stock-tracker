// src/components/StockSearch.js

import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend } from 'chart.js';
import { useWatchlist } from './Watchlist'; // Adjust path as necessary
import './StockSearch.css'; // Ensure you have relevant CSS if needed

// Register the necessary components
Chart.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

const stockSymbolsByType = {
    A: ['AAPL', 'AMGN', 'ADBE', 'AMD', 'AMZN', 'AIG', 'AXP', 'ABT', 'ADI', 'ANSS'],
    B: ['BA', 'BAC', 'BBY', 'BAX', 'BMY'],
    C: ['CAT', 'COST', 'CRM', 'CSCO', 'C', 'CME'],
    D: ['DHR', 'DIS', 'DUK', 'DOW', 'DTE'],
    E: ['EBAY', 'ED', 'EL', 'EMN'],
    F: ['FB', 'FDX', 'FIS', 'FISV', 'FTNT'],
    G: ['GE', 'GILD', 'GLW', 'GOOGL', 'GS'],
    H: ['HD', 'HON', 'HPE', 'HPQ'],
    I: ['IBM', 'INTC', 'INTU', 'IP'],
    J: ['JNJ', 'JPM', 'KMB', 'KMI'],
    K: ['KO', 'KHC', 'KEYS', 'KMX'],
    L: ['LMT', 'LOW', 'LRCX', 'LNT'],
    M: ['META', 'MCD', 'MDT', 'MSFT', 'MU'],
    N: ['NKE', 'NFLX', 'NVDA', 'NVS'],
    O: ['ORCL', 'OMC', 'OXY'],
    P: ['PEP', 'PG', 'PYPL', 'PM'],
    Q: ['QCOM', 'QRVO'],
    R: ['ROST', 'RTN', 'RMD'],
    S: ['SBUX', 'SPG', 'SQ', 'SYK'],
    T: ['T', 'TSLA', 'TXN', 'TGT'],
    U: ['UAL', 'UNH', 'UPS', 'USB'],
    V: ['V', 'VZ', 'VLO'],
    W: ['WBA', 'WDC', 'WMT', 'WM'],
    X: ['XOM', 'XRX'],
    Y: ['YUM'],
    Z: ['ZBH', 'ZION', 'ZTS']
};

function StockSearch() {
    const [searchTerm, setSearchTerm] = useState('');
    const [stockData, setStockData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const { addToWatchlist } = useWatchlist(); // Access the addToWatchlist function

    const handleSearch = async (symbol) => {
        setError('');
        setLoading(true);
        setSuggestions([]);//MM8URO0Z2LSYIMXM//HTPT7VBQI6T4PTCL//6BR63WCGVBAXGP26

        try {
            const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=MM8URO0Z2LSYIMXM`);
            if (!response.ok) throw new Error('Failed to fetch stock data');
            const data = await response.json();

            if (data['Time Series (Daily)'] && Object.keys(data['Time Series (Daily)']).length > 0) {
                setStockData(data['Time Series (Daily)']);
                setError('');
            } else {
                setError('No data found for the entered symbol');
                setStockData(null);
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred while fetching stock data');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value.toUpperCase();
        setSearchTerm(value);

        if (value.length === 1) {
            const matchingStocks = stockSymbolsByType[value] || [];
            setSuggestions(matchingStocks);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (symbol) => {
        setSearchTerm(symbol);
        handleSearch(symbol);
    };

    const prepareChartData = () => {
        if (!stockData) return null;

        const dates = Object.keys(stockData).slice(0, 30).reverse();
        const closingPrices = dates.map(date => parseFloat(stockData[date]['4. close']));

        return {
            labels: dates,
            datasets: [
                {
                    label: 'Closing Price',
                    data: closingPrices,
                    fill: false,
                    borderColor: 'rgba(75,192,192,1)',
                    tension: 0.1,
                },
            ],
        };
    };

    const handleAddToWatchlist = () => {
        if (stockData) {
            const latestDate = Object.keys(stockData)[0];
            const latestPrice = parseFloat(stockData[latestDate]['4. close']);
            addToWatchlist({ symbol: searchTerm, price: latestPrice }); // Add stock to watchlist
        }
    };

    return (
        <div className="stock-search">
            <input
                className="search-input"
                type="text"
                placeholder="Enter stock symbol (e.g., AAPL)..."
                value={searchTerm}
                onChange={handleInputChange}
            />
            <button className="search-button" onClick={() => handleSearch(searchTerm)} disabled={loading}>
                {loading ? 'Loading...' : 'Search'}
            </button>
            <button className="add-watchlist-button" onClick={handleAddToWatchlist} disabled={!stockData}>
                Add to Watchlist
            </button>

            {error && <p className="error-message">{error}</p>}

            {suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((symbol) => (
                        <li key={symbol} onClick={() => handleSuggestionClick(symbol)} className="suggestion-item">
                            {symbol}
                        </li>
                    ))}
                </ul>
            )}

            {stockData && (
                <div className="stock-chart">
                    <h2>Stock Price Chart (Last 30 Days)</h2>
                    <Line data={prepareChartData()} />
                </div>
            )}
        </div>
    );
}

export default StockSearch;