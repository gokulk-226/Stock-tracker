import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Portfolio.css';

const Portfolio = () => {
    const [portfolio, setPortfolio] = useState([]);
    const [symbol, setSymbol] = useState('');
    const [price, setPrice] = useState('');
    const [shares, setShares] = useState('');

    useEffect(() => {
        // Fetch existing portfolio items on component mount
        axios.get('http://localhost:5000/portfolio')
            .then(response => setPortfolio(response.data))
            .catch(error => console.error('Error fetching portfolio', error));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newStock = {
            symbol,
            price: parseFloat(price),
            shares: parseInt(shares),
        };

        // Post new stock data to the backend
        axios.post('http://localhost:5000/portfolio', newStock)
            .then(response => {
                setPortfolio([...portfolio, response.data]); // Add new stock to portfolio
                setSymbol('');
                setPrice('');
                setShares('');
            })
            .catch(error => console.error('Error adding stock', error));
    };

    return (
        <div>
            <h2>Your Portfolio</h2>
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
                    placeholder="Price"
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
                        <th>Price</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    {portfolio.map(stock => (
                        <tr key={stock._id}>
                            <td>{stock.symbol}</td>
                            <td>{stock.price}</td>
                            <td>{(stock.shares * stock.price).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Portfolio;
