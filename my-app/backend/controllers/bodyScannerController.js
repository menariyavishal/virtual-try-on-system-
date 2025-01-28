// const axios = require('axios');

// const scanBody = async (req, res) => {
//   try {
//     // Capture body scan data from the request
//     const bodyScanData = req.body;

//     // Send this data to the Python AI service for processing
//     const response = await axios.post('http://python-service:5000/api/body-scan', bodyScanData);
    
//     // Return the response from the AI model to the frontend
//     res.json(response.data);
//   } catch (error) {
//     res.status(500).json({ error: 'Error in body scan processing' });
//   }
// };

// module.exports = { scanBody };


const axios = require('axios');
const { getRecommendations } = require('../services/recommendationService'); // Assuming this is a function that provides AI recommendations

// Handle body scan request
const scanBody = async (req, res) => {
  try {
    const bodyScanData = req.body; // Data sent from frontend (body scan data)

    // Call the recommendation service to get AI-based outfit suggestions
    const recommendations = await getRecommendations(bodyScanData);

    // Return the processed results, including outfit recommendations
    res.json({
      success: true,
      recommendations: recommendations, // Include AI-generated recommendations
    });
  } catch (error) {
    console.error('Error processing body scan:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process body scan and generate recommendations',
    });
  }
};

module.exports = { scanBody };

