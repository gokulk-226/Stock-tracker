import React, { useState } from 'react';
import axios from 'axios';
import StockChart from './StockChart'; // Assume you create this component

const API_KEY = 'MM8URO0Z2LSYIMXM';

const StockSearch = () => {
    const [symbol, setSymbol] = useState('');
    const [stockData, setStockData] = useState(null);

    const handleSearch = async () => {
        try {
            const response = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`);
            const data = response.data['Time Series (Daily)'];
            setStockData(data);
        } catch (error) {
            console.error("Error fetching stock data", error);
        }
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Enter a symbol"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
            {stockData && <StockChart data={stockData} />}
        </div>
    );
};

export default StockSearch;
