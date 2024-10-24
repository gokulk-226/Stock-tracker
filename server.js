const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost/stock-portfolio', { useNewUrlParser: true, useUnifiedTopology: true });

const portfolioSchema = new mongoose.Schema({
    symbol: String,
    shares: Number,
    price: Number
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

app.post('/portfolio', async (req, res) => {
    const { symbol, shares, price } = req.body;
    const newStock = new Portfolio({ symbol, shares, price });
    await newStock.save();
    res.json(newStock);
});

app.get('/portfolio', async (req, res) => {
    const portfolio = await Portfolio.find();
    res.json(portfolio);
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
