require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

// Import routes
const ttsRoutes = require("./routes/tts");
const videoRoutes = require("./routes/video");

const app = express();
const PORT = process.env.PORT || 5001; // Use a different port if needed

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for uploads (if needed locally)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/tts", ttsRoutes);
app.use("/api/video", videoRoutes);

// Basic route for testing
app.get("/api", (req, res) => {
  res.json({ message: "WAVA Alternative Backend is running!" });
});

// Serve frontend build in production (optional, if not using Netlify for frontend)
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/build")));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"));
//   });
// }

// Start server (only if not running as a serverless function)
// When deployed to Netlify, serverless.js handles this.
if (process.env.NODE_ENV !== "netlify") {
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}

// Export the app for potential use in serverless wrappers (like Netlify functions)
module.exports = app;

