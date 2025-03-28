const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Allow CORS from any origin (for Godot HTML5)
app.use(cors({
  origin: '*',
  methods: ['POST', 'GET'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.post('/openai', async (req, res) => {
  try {
    const response = await axios.post(
      'https://ai-gateway.mycompany.com/v1/chat/completions', // <-- your real internal endpoint here
      req.body,
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // your custom company key
          'Content-Type': 'application/json',
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('OpenAI error:', error.response?.data || error.message);
    res.status(500).json({ error: 'OpenAI request failed' });
  }
});

// Optional: health check route
app.get('/', (req, res) => {
  res.send('Proxy is alive!');
});

app.listen(port, () => {
  console.log(`Proxy running on port ${port}`);
});
