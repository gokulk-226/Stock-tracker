// src/components/Watchlist.js

import React, { createContext, useContext, useState } from 'react';
import './Watchlist.css';

// Create the WatchlistContext
const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
    const [watchlist, setWatchlist] = useState([]);

    const addToWatchlist = (stock) => {
        setWatchlist((prev) => [...prev, stock]);
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
    const { watchlist } = useWatchlist(); // Access the watchlist data

    const saveWatchlistToDB = async () => {
        try {
            const response = await fetch('http://localhost:5000/watchlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(watchlist),
            });

            if (!response.ok) {
                throw new Error('Failed to save watchlist');
            }

            const result = await response.json();
            console.log('Watchlist saved:', result);
            alert('Watchlist saved successfully!');
        } catch (error) {
            console.error('Error saving watchlist:', error);
            alert('Error saving watchlist. Please try again.');
        }
    };

    return (
        <div className="watchlist">
            <h2>Your Watchlist</h2>
            {watchlist.length === 0 ? (
                <p>No stocks in your watchlist.</p>
            ) : (
                <>
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
                    <button onClick={saveWatchlistToDB}>Save to MongoDB</button>
                </>
            )}
        </div>
    );
};

export default Watchlist;
