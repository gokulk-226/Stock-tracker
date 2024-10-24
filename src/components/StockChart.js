import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StockChart = ({ data }) => {
    // Format data to map correctly for the chart with open and close values
    const formatData = () => {
        return Object.entries(data).map(([date, values]) => ({
            date,
            open: parseFloat(values['1. open']),
            close: parseFloat(values['4. close']),
            price: parseFloat(values['4. close']),
            isPositive: parseFloat(values['4. close']) > parseFloat(values['1. open'])
        }));
    };

    const formattedData = formatData();

    return (
        <ResponsiveContainer width="80%" height={400}>
            <LineChart data={formattedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend verticalAlign="top" height={36} />
                <Line
                    dataKey="price"
                    stroke="#3498db" // Light blue color for the line
                    strokeWidth={2}
                    dot={false} // Optional: Disable dots for cleaner appearance
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default StockChart;
