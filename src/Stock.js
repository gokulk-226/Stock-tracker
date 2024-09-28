import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Plot from 'react-plotly.js';
import './Stock.css';

const Stock = () => {
  const { symbols } = useParams();
  
  // Predefined stock symbols; you can add more as needed
  const predefinedSymbols = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN', 'FB', 'NFLX', 'NVDA', 'BABA', 'TSM'];
  const stockSymbols = symbols ? symbols.split(',').slice(0, 10) : predefinedSymbols; // Limit to first 10 symbols
  
  const [stockData, setStockData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStockData = async (symbol) => {
    const API_KEY = 'MM8URO0Z2LSYIMXM'; // Replace with your actual API key
    try {
      const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=compact&apikey=${API_KEY}`);

      if (!response.ok) {
        throw new Error(`Error fetching data for ${symbol}: ${response.statusText}`);
      }

      const data = await response.json();
      if (data["Time Series (Daily)"]) {
        const dates = [];
        const closePrices = [];

        for (const [date, values] of Object.entries(data["Time Series (Daily)"])) {
          dates.push(date);
          closePrices.push(parseFloat(values["4. close"])); // Close price for the chart
        }

        return { dates, closePrices }; // Return formatted data
      } else {
        throw new Error(`No data available for ${symbol}`);
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const dataPromises = stockSymbols.map(symbol => fetchStockData(symbol));
      const results = await Promise.all(dataPromises);
      const formattedData = {};
      
      results.forEach((data, index) => {
        if (data) {
          formattedData[stockSymbols[index]] = data;
        } else {
          console.warn(`No data for ${stockSymbols[index]}`);
          setError(`Could not fetch data for ${stockSymbols[index]}`);
        }
      });
      
      setStockData(formattedData);
      setLoading(false);
    };
    
    fetchData();
  }, [stockSymbols]);

  return (
    <div>
      <h2>Stock Information</h2>
      {loading ? (
        <p>Loading stock data...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        stockSymbols.map(symbol => (
          <div key={symbol}>
            <h3>{symbol} Chart</h3>
            {stockData[symbol] && stockData[symbol].dates.length > 0 ? (
              <Plot
                data={[{
                  x: stockData[symbol].dates,
                  y: stockData[symbol].closePrices,
                  type: 'scatter',
                  mode: 'lines+markers',
                  marker: { color: 'blue' },
                  name: symbol,
                }]}
                layout={{
                  title: `${symbol} Stock Price`,
                  xaxis: { title: 'Date' },
                  yaxis: { title: 'Price' },
                }}
                config={{ responsive: true }} // Make plot responsive
              />
            ) : (
              <p>No data available for {symbol}.</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Stock;
