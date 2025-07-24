const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;
  console.log('Hiiii');
  console.log('API Key:', process.env.GEMINI_API_KEY); // Debug: print API key (remove after testing)
  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + process.env.GEMINI_API_KEY,
      {
        contents: [{ parts: [{ text: userMessage }] }]
      }
    );
    res.json({ reply: response.data.candidates[0].content.parts[0].text });
  } catch (err) {
    console.error('Gemini API error:', err.response ? err.response.data : err.message); // Debug
    res.status(500).json({ error: 'Error contacting Gemini API' });
  }
});
app.get('/api/chat', (req, res) => {
  res.json({ message: 'GET endpoint is working!' });
}); 
app.listen(3000, () => console.log('Server running on port 3000')); 