import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend } from 'chart.js';
import './StockSearch.css'; // Ensure you have relevant CSS if needed

// Register the necessary components
Chart.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend);

function StockSearch() {
    const [searchTerm, setSearchTerm] = useState('');
    const [stockData, setStockData] = useState(null);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        try {
            console.log('Searching for:', searchTerm);

            // Replace YOUR_API_KEY with your actual API key
            const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${searchTerm}&apikey=MM8URO0Z2LSYIMXM`);
            
            if (!response.ok) throw new Error('Failed to fetch stock data');
            const data = await response.json();

            if (data['Time Series (Daily)'] && Object.keys(data['Time Series (Daily)']).length > 0) {
                setStockData(data['Time Series (Daily)']);
                setError(''); // Clear any previous error
            } else {
                setError('No data found for the entered symbol');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred while fetching stock data');
        }
    };

    // Prepare data for the chart
    const prepareChartData = () => {
        if (!stockData) return null;

        const dates = Object.keys(stockData).slice(0, 30).reverse(); // Get last 30 dates
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

    return (
        <div className="stock-search">
            <input
                className="search-input"
                type="text"
                placeholder="Search for a stock..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button" onClick={handleSearch}>
                Search
            </button>

            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}

            {/* Display the line chart if stock data is available */}
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
