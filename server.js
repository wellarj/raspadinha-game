// server.js - Node.js Backend using Express

const express = require('express');
const app = express();
const path = require('path');

// Sample data for challenges
const challenges = [
  { id: 1, image: '/images/bananeira.png', text: 'Plantar bananeira' },
  { id: 2, image: '/images/correr.png', text: 'Correr 100 metros' },
  // Add more challenges as needed
];

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to get a random challenge
app.get('/api/challenge', (req, res) => {
  const randomIndex = Math.floor(Math.random() * challenges.length);
  res.json(challenges[randomIndex]);
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
