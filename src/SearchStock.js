import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Plot from 'react-plotly.js';
import './SearchStock.css';

const SearchStock = () => {
  const { symbol } = useParams(); // Get the symbol from URL params
  const [stockData, setStockData] = useState(null); // Store data for the searched stock
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStock(symbol);
  }, [symbol]); // Fetch stock data whenever the symbol changes

  const fetchStock = async (symbol) => {
    const API_KEY = 'MM8URO0Z2LSYIMXM'; // Direct API key

    try {
      const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${API_KEY}`);
      const data = await response.json();

      if (data["Time Series (Daily)"]) {
        const xValues = [];
        const openValues = [];
        const highValues = [];
        const lowValues = [];
        const closeValues = [];

        for (const key in data["Time Series (Daily)"]) {
          xValues.push(key);
          openValues.push(parseFloat(data["Time Series (Daily)"][key]["1. open"]));
          highValues.push(parseFloat(data["Time Series (Daily)"][key]["2. high"]));
          lowValues.push(parseFloat(data["Time Series (Daily)"][key]["3. low"]));
          closeValues.push(parseFloat(data["Time Series (Daily)"][key]["4. close"]));
        }

        setStockData({
          xValues,
          openValues,
          highValues,
          lowValues,
          closeValues,
        });
        setError(null);
      } else {
        setError('Stock symbol not found.');
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
      setError('Error fetching stock data. Please try again later.');
    }
  };

  return (
    <div className="search-stock-container">
      <h1>Stock Data for {symbol}</h1>
      {error && <p className="error">{error}</p>}
      {stockData && (
        <Plot
          data={[{
            x: stockData.xValues,
            open: stockData.openValues,
            high: stockData.highValues,
            low: stockData.lowValues,
            close: stockData.closeValues,
            type: 'candlestick',
            increasing: { line: { color: 'green' } }, // Green for upward movement
            decreasing: { line: { color: 'red' } },  // Red for downward movement
          }]}
          layout={{
            width: 720,
            height: 440,
            title: 'Stock Data',
            xaxis: { title: 'Date' },
            yaxis: { title: 'Price' },
            showlegend: false,
          }}
        />
      )}
    </div>
  );
};

export default SearchStock;
