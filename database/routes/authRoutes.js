const express = require('express');
const User = require('../models/User'); // Assuming this is your User model
const router = express.Router();



router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Login attempt:', { email, password }); // Log the request

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.password !== password) {
      console.log('Invalid credentials');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Login successful:', email);
    return res.status(200).json({ message: 'Login successful', user: email });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST route to register a new user
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user with the provided email and password (no hashing)
    const newUser = new User({ email, password });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     console.log('Request received:', req.body); // Log incoming data

//     const user = await User.findOne({ email });
//     if (!user) {
//       console.log('User not found');
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       console.log('Invalid password');
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     console.log('Login successful for:', email);
//     return res.status(200).json({ message: 'Login successful', user: email });
//   } catch (error) {
//     console.error('Error in /login route:', error);
//     return res.status(500).json({ message: 'Server error' });
//   }
// });
