const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle OPTIONS request (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    const { city, country, units = 'metric' } = req.query;
    
    if (!city) {
      return res.status(400).json({ error: 'City parameter is required' });
    }
    
    // Your OpenWeather API key (stored as an environment variable in Vercel)
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }
    
    // Construct the API URL
    let url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${units}`;
    
    // Add country if provided
    if (country) {
      url += `&country=${encodeURIComponent(country)}`;
    }
    
    console.log('Fetching forecast from:', url);
    
    // Fetch forecast data
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Forecast API error:', errorText);
      return res.status(response.status).json({ error: 'Forecast data not found' });
    }
    
    const data = await response.json();
    console.log('Forecast data received:', data);
    
    // Return the forecast data
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};