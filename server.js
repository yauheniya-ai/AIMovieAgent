require('dotenv').config({ path: '.env.local' });
console.log('Environment variables check:', {
    hasApiKey: !!process.env.OPENAI_API_KEY,
    hasApiBase: !!process.env.OPENAI_API_BASE
});

const express = require('express');
const cors = require('cors');

const app = express(); // Initialize app first

// Middleware for CORS, moved after app initialization
app.use(cors({
  origin: 'http://localhost:3000',  // Allow requests from the frontend
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

const suggestRouter = require('./api/suggest');

// Middleware to parse JSON
app.use(express.json());

// API Routes
app.use('/api/suggest', suggestRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Movie API Server</title>
        <link rel="icon" href="data:,">
      </head>
      <body>
        <h1>Movie API Server is running</h1>
        <p>Available endpoints:</p>
        <ul>
          <li>POST /api/suggest - Get movie suggestions</li>
        </ul>
      </body>
    </html>
  `);
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
