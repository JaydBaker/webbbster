// netlify/functions/tts.js
// This file wraps the TTS backend routes for Netlify Functions

const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const path = require("path");

// Adjust the path to point to the original backend routes file
// We need to go up two levels from netlify/functions to the root, then into backend/routes
const ttsRoutes = require(path.join(__dirname, "../../backend/routes/tts"));

const app = express();

// Enable CORS for all origins (adjust if needed for security)
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount the TTS routes under the Netlify function path
// The base path here should match the "to" path in netlify.toml for /api/tts/*
app.use("/.netlify/functions/tts", ttsRoutes);

// Export the handler for Netlify
module.exports.handler = serverless(app);

