require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Test Route
app.get('/', (req, res) => {
    res.json({ message: 'Project RPS API: The Pain Score is calculating...' });
});

// Database Connection (Placeholder)
// mongoose.connect(process.env.MONGO_URI)
//    .then(() => console.log('MongoDB Connected'))
//    .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));