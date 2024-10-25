// src/components/Watchlist.js

import React, { createContext, useContext, useState } from 'react';
import './Watchlist.css';

// Create the WatchlistContext
const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
    const [watchlist, setWatchlist] = useState([]);

    const addToWatchlist = async (stock) => {
        setWatchlist((prev) => [...prev, stock]);
        
        // Save the stock to MongoDB
        try {
            const response = await fetch('http://localhost:5000/watchlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([{ symbol: stock.symbol, rate: stock.price }]), // Expecting an array
            });

            if (response.ok) {
                alert(`Successfully added ${stock.symbol} to the watchlist!`);
            } else {
                alert('Failed to save to MongoDB. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while adding to the watchlist.');
        }
    };

    return (
        <WatchlistContext.Provider value={{ watchlist, addToWatchlist }}>
            {children}
        </WatchlistContext.Provider>
    );
};

export const useWatchlist = () => {
    return useContext(WatchlistContext);
};

const Watchlist = () => {
    const { watchlist } = useWatchlist();

    return (
        <div className="watchlist">
            <h2>Your Watchlist</h2>
            {watchlist.length === 0 ? (
                <p>No stocks in your watchlist.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Stock Symbol</th>
                            <th>Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {watchlist.map((item) => (
                            <tr key={item.symbol}>
                                <td>{item.symbol}</td>
                                <td>${item.price.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Watchlist;
