require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');  
const courseRoutes = require('./routes/course'); 
const materialRoutes = require('./routes/material'); 

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Test Route
app.get('/', (req, res) => {
    res.json({ message: 'Project RPS API: The Pain Score is calculating...' });
});

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log('Error connecting to MongoDB:', err));

// Use authentication routes
app.use('/api/auth', authRoutes);

// Use course routes
app.use('/api/courses', courseRoutes);

// Use material routes
app.use('/api/materials', materialRoutes);

// Define the port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
