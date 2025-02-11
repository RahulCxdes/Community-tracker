const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const multer = require('multer');

// Initialize app
const app = express();

// Middleware
app.use(express.json());

// CORS setup
const corsOptions = {
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Include PATCH method
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};
app.use(cors(corsOptions));



// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if unable to connect
  });

// Multer configuration for file uploads
// const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// const upload = multer({ dest: path.join(__dirname, 'uploads') });

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const issueRoutes = require('./routes/issueRoutes');
app.use('/api/issues', issueRoutes);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Default route
app.get('/', (req, res) => {
  res.send('Server is running.');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
