// const express = require("express");
// const cors = require("cors");

// const app = express();
// const PORT = 5000;

// // Middleware
// app.use(express.json()); // Parses incoming JSON requests
// app.use(cors()); // Allows frontend to communicate with backend

// // Sample API Route
// app.get("/", (req, res) => {
//     res.send("Backend is running...");
// });

// // API for Image Processing (Modify as needed)
// app.post("/api/body-scan", (req, res) => {
//     const { image } = req.body;
    
//     if (!image) {
//         return res.status(400).json({ error: "No image provided" });
//     }

//     // Process the image (Placeholder logic)
//     console.log("Received Image Data:", image.substring(0, 50)); // Trimming output for logs

//     // Simulate Success Response
//     res.status(200).json({ message: "Scan successful", scanResult: "Body scan completed" });
// });

// // Start Server
// app.listen(PORT, () => {
//     console.log('Server running on http://localhost:${PORT}');
// });


const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Test Route
app.get("/", (req, res) => {
    res.send("Backend is running...");
});

// API Route
app.post("/api/body-scan", (req, res) => {
    console.log("📸 Received Image Data:", req.body);
    res.status(200).json({ message: "Scan successful" });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
