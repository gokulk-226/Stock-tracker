const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt'); // For password hashing
const app = express();

app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost/stock-portfolio', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

// Portfolio Schema
const portfolioSchema = new mongoose.Schema({
    symbol: { type: String, required: true },
    shares: { type: Number, required: true },
    price: { type: Number, required: true }
});
const Portfolio = mongoose.model('Portfolio', portfolioSchema);

// User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', userSchema);

// Register a new user
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Server error. Please try again.', error: error.message });
    }
});

// Login user
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Compare the password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error. Please try again.', error: error.message });
    }
});

// Add stock to portfolio
app.post('/portfolio', async (req, res) => {
    try {
        const { symbol, shares, price } = req.body;

        if (!symbol || !shares || !price) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newStock = new Portfolio({ symbol, shares, price });
        await newStock.save();
        res.status(201).json(newStock);
    } catch (error) {
        res.status(500).json({ message: 'Server error. Please try again.', error: error.message });
    }
});

// Get portfolio
app.get('/portfolio', async (req, res) => {
    try {
        const portfolio = await Portfolio.find();
        res.status(200).json(portfolio);
    } catch (error) {
        res.status(500).json({ message: 'Server error. Please try again.', error: error.message });
    }
});

// Start server
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
