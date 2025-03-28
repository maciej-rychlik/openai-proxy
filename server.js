const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();


console.log('Loaded API Key:', process.env.OPENAI_API_KEY);


const app = express();
const port = process.env.PORT || 3000;

// Allow any origin for CORS (so Godot HTML5 can call it)
app.use(cors({
  origin: '*',
  methods: ['POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.post('/openai', async (req, res) => {
  try {
    const response = await axios.post(
      'https://ai-gateway.zende.sk/v1/chat/completions', // replace with your actual company gateway
      req.body,
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Proxy request failed' });
  }
});

// Root route to confirm server is running
app.get('/', (req, res) => {
  res.send('Proxy is alive!');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Local proxy running at http://localhost:${port}`);
});
