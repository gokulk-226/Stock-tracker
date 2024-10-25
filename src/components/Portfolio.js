
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Portfolio.css';

const Portfolio = () => {
    const [portfolio, setPortfolio] = useState([]);
    const [symbol, setSymbol] = useState('');
    const [price, setPrice] = useState('');
    const [shares, setShares] = useState('');
    const [currentPrices, setCurrentPrices] = useState({}); // State to hold current prices

    useEffect(() => {
        // Fetch existing portfolio items on component mount
        const fetchPortfolio = async () => {
            try {
                const response = await axios.get('http://localhost:5000/portfolio');
                setPortfolio(response.data);
                await fetchCurrentPrices(response.data); // Fetch current prices for the portfolio
            } catch (error) {
                console.error('Error fetching portfolio', error);
            }
        };
        fetchPortfolio();
    }, []);

    const fetchCurrentPrices = async (portfolio) => {
        const symbols = portfolio.map(stock => stock.symbol);
        const currentPrices = {};
        
        const requests = symbols.map(async (symbol) => {
            try {
                // Fetch the latest daily price from Alpha Vantage//MM8URO0Z2LSYIMXM//HTPT7VBQI6T4PTCL
                const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=6BR63WCGVBAXGP26`);
                const data = await response.json();

                // Get the latest trading day
                const timeSeries = data['Time Series (Daily)'];
                const latestDate = Object.keys(timeSeries)[0]; // Get the latest date
                currentPrices[symbol] = parseFloat(timeSeries[latestDate]['4. close']); // Store the latest closing price
            } catch (error) {
                console.error(`Error fetching current price for ${symbol}`, error);
            }
        });

        await Promise.all(requests); // Wait for all requests to complete
        setCurrentPrices(currentPrices); // Update state with current prices
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const newStock = {
            symbol,
            price: parseFloat(price), // Ensure the correct data type
            shares: parseInt(shares),  // Ensure the correct data type
            purchaseRate: parseFloat(price), // Make sure to include purchaseRate
        };
    
        try {
            const response = await axios.post('http://localhost:5000/portfolio', newStock);
            setPortfolio([...portfolio, response.data]);
            setSymbol('');
            setPrice('');
            setShares('');
            fetchCurrentPrices([...portfolio, response.data]); // Fetch current prices again after adding
        } catch (error) {
            console.error('Error adding stock', error);
        }
    };

    const calculateGainLossPercentage = (purchasePrice, currentPrice) => {
        if (currentPrice === undefined || purchasePrice === 0) return 0; // Handle undefined
        return ((currentPrice - purchasePrice) / purchasePrice) * 100;
    };

    return (
        <div>
            <h2>Your Stocks</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Asset Symbol"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Purchase Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Shares"
                    value={shares}
                    onChange={(e) => setShares(e.target.value)}
                    required
                />
                <button type="submit">Add Asset</button>
            </form>
            <table>
                <thead>
                    <tr>
                        <th>Asset</th>
                        <th>Purchase Price</th>
                        <th>Current Price</th>
                        <th>Value</th>
                        <th>Gain/Loss (%)</th>
                    </tr>
                </thead>
                <tbody>
                    {portfolio.map(stock => {
                        const currentPrice = currentPrices[stock.symbol]; // Get current price from state
                        const gainLossPercentage = calculateGainLossPercentage(stock.price, currentPrice);
                        
                        return (
                            <tr key={stock._id}>
                                <td>{stock.symbol}</td>
                                <td>{stock.price.toFixed(2)}</td>
                                <td>{currentPrice !== undefined ? currentPrice.toFixed(2) : 'N/A'}</td>
                                <td>{(stock.shares * stock.price).toFixed(2)}</td>
                                <td>{currentPrice !== undefined ? gainLossPercentage.toFixed(2) : 'N/A'}%</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default Portfolio;

