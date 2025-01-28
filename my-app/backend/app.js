// const express = require('express');
// const bodyParser = require('body-parser');
// const bodyScannerRoutes = require('./routes/bodyScannerRoutes');

// const app = express();
// app.use(bodyParser.json());

// app.use('/api/body-scan', bodyScannerRoutes);

// app.listen(5000, () => console.log('Backend running on port 5000'));

// const express = require('express');
// const bodyParser = require('body-parser');
// const bodyScannerRoutes = require('./routes/bodyScannerRoutes'); // Import the routes

// const app = express();

// // Middleware
// app.use(bodyParser.json()); // Parse incoming JSON data

// // Define the route
// app.use('/api/body-scan', bodyScannerRoutes); // All body scan requests will go to bodyScannerRoutes

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));


    const express = require('express');
    const cors = require('cors');

    const app = express();
    app.use(cors());  // Fix CORS issues
    app.use(express.json());

    const scanRoutes = require('./routes/scan');
    app.use('/api', scanRoutes); // Attach scan routes

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log('Server running on port ${PORT}'));

