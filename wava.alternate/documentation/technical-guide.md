# WAVA AI Alternative - Technical Guide

This guide provides technical details about the WAVA AI Alternative application, including architecture, setup, API, and deployment.

## Table of Contents

1.  [Architecture Overview](#architecture-overview)
2.  [Technology Stack](#technology-stack)
3.  [Project Structure](#project-structure)
4.  [Setup & Installation](#setup--installation)
    *   [Prerequisites](#prerequisites)
    *   [Installation Steps](#installation-steps)
5.  [Running Locally](#running-locally)
    *   [Running Frontend](#running-frontend)
    *   [Running Backend](#running-backend)
6.  [Backend API](#backend-api)
    *   [TTS Endpoints](#tts-endpoints)
    *   [Video Endpoints](#video-endpoints)
7.  [Netlify Deployment (Fullstack)](#netlify-deployment-fullstack)
    *   [Overview](#overview)
    *   [Configuration (`netlify.toml`)](#configuration-netlifytoml)
    *   [Serverless Functions](#serverless-functions)
    *   [Deployment Steps](#deployment-steps)
8.  [Customization & Extension](#customization--extension)
    *   [Adding TTS Engines](#adding-tts-engines)
    *   [Adding Backgrounds/Music](#adding-backgroundsmusic)
    *   [Improving FFmpeg Integration](#improving-ffmpeg-integration)

## Architecture Overview

The application follows a standard client-server architecture:

*   **Frontend:** A React single-page application (SPA) built using Material UI for the user interface. It handles user input and interacts with the backend API.
*   **Backend:** A Node.js/Express application responsible for handling API requests, interacting with TTS engines, processing video/audio using FFmpeg, and managing file uploads.
*   **Netlify Deployment:** The frontend is deployed as a static site. The backend API is deployed using Netlify Functions, which wrap the Express routes.

## Technology Stack

*   **Frontend:** React, Material UI, Axios, React Router
*   **Backend:** Node.js, Express, Multer (for uploads)
*   **TTS/Video Processing:** (Requires integration with actual libraries like Coqui TTS, Bark, Tortoise TTS, FFmpeg)
*   **Deployment:** Netlify (Static Site + Functions)
*   **Package Management:** npm

## Project Structure

```
wava.alternate/
├── backend/               # Node.js backend code
│   ├── routes/            # API route handlers (tts.js, video.js)
│   ├── uploads/           # Directory for file uploads (audio, video, generated)
│   ├── server.js          # Express server setup
│   └── package.json       # Backend dependencies
├── frontend/              # React frontend code
│   ├── public/            # Static assets (index.html, favicon)
│   ├── src/               # React source code
│   │   ├── components/    # Reusable UI components (Layout, Navigation)
│   │   ├── pages/         # Page components (Home, TextToSpeech, etc.)
│   │   ├── services/      # API service (api.js)
│   │   └── index.js       # Main React entry point
│   └── package.json       # Frontend dependencies
├── netlify/               # Netlify-specific files
│   └── functions/         # Serverless function handlers (tts.js, video.js)
├── documentation/         # User and technical guides
│   ├── user-guide.md
│   └── technical-guide.md
├── netlify.toml           # Netlify deployment configuration
├── package.json           # Root dependencies (for Netlify functions)
└── .gitignore             # Files/folders to ignore in Git
```

## Setup & Installation

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm (usually comes with Node.js)
*   Git
*   *(Optional but Recommended for Full Functionality)* Python, FFmpeg, and specific TTS libraries (Coqui, Bark, Tortoise) installed and configured if running the backend locally with full processing.

### Installation Steps

1.  **Clone/Download:** Get the project code onto your local machine.
2.  **Install Root Dependencies:** Navigate to the root `wava.alternate` directory and run:
    ```bash
    npm install
    ```
3.  **Install Backend Dependencies:** Navigate to the `backend` directory and run:
    ```bash
    cd backend
    npm install
    cd ..
    ```
4.  **Install Frontend Dependencies:** Navigate to the `frontend` directory and run:
    ```bash
    cd frontend
    npm install
    cd ..
    ```

## Running Locally

### Running Frontend

Navigate to the `frontend` directory and run:

```bash
cd frontend
npm start
```

This will start the React development server, usually at `http://localhost:3000`.

### Running Backend

Navigate to the `backend` directory and run:

```bash
cd backend
npm run dev
```

This will start the Node.js backend server using nodemon (for auto-restarts), usually at `http://localhost:5001`.

*Note:* For local development, you might need to update the `API_URL` in `frontend/src/services/api.js` to point to `http://localhost:5001/api` instead of `/api`.

## Backend API

The backend exposes RESTful endpoints under `/api`.

### TTS Endpoints

*   **`GET /api/tts/engines`**: Lists available TTS engines and their voices.
    *   Response: JSON object mapping engine IDs to names and voice lists.
*   **`POST /api/tts/generate`**: Generates audio from text.
    *   Request Body (form-data): `text` (string), `voice` (string ID), `speed` (number, optional), `pitch` (number, optional), `reference_audio` (file, optional for cloning).
    *   Response: `{ success: boolean, file: string (URL/path) }` or `{ success: false, error: string }`.
*   **`POST /api/tts/clone`**: Clones a voice from an audio sample.
    *   Request Body (form-data): `audio` (file), `name` (string, optional).
    *   Response: `{ success: boolean, voiceId: string, message: string }` or `{ success: false, error: string }`.

### Video Endpoints

*   **`GET /api/video/backgrounds`**: Lists available background video options.
    *   Response: Array of background objects `{ id, name, category, url }`.
*   **`GET /api/video/music`**: Lists available background music options.
    *   Response: Array of music objects `{ id, name, category, url }`.
*   **`POST /api/video/generate`**: Generates a video with narration.
    *   Request Body (form-data): `script` (string), `voice` (string ID), `background` (string ID), `music` (string ID, optional), `format` (string, optional), `custom_background` (file, optional).
    *   Response: `{ success: boolean, file: string (URL/path) }` or `{ success: false, error: string }`.
*   **`POST /api/video/split-screen`**: Generates a split-screen video.
    *   Request Body (form-data): `script` (string), `voice` (string ID), `left_video` (file), `right_video` (file), `music` (string ID, optional), `format` (string, optional).
    *   Response: `{ success: boolean, file: string (URL/path) }` or `{ success: false, error: string }`.

## Netlify Deployment (Fullstack)

### Overview

This setup deploys the React frontend as a static site and the Express backend API routes as Netlify Serverless Functions.

### Configuration (`netlify.toml`)

Located in the project root, this file tells Netlify how to build and deploy the site:

*   `[build]`: Specifies the build command (`cd frontend && npm install && npm run build`) and the publish directory (`frontend/build`). It also points to the functions directory.
*   `[functions]`: Defines the directory containing serverless function handlers (`netlify/functions`).
*   `[[redirects]]`: Configures proxy redirects. Requests to `/api/tts/*` are forwarded to the `tts` function, `/api/video/*` to the `video` function, and all other requests serve the `index.html` for the React SPA.

### Serverless Functions

Located in `netlify/functions/`:

*   `tts.js`: Wraps the backend TTS routes (`backend/routes/tts.js`) using `serverless-http`.
*   `video.js`: Wraps the backend video routes (`backend/routes/video.js`) using `serverless-http`.

These wrappers allow the Express routes to run within the Netlify Functions environment.

### Deployment Steps

1.  **Prerequisites:** Netlify account, GitHub account, Git installed.
2.  **Prepare Code:** Ensure all code is present, `netlify.toml` is correct, and **delete all `node_modules` folders**.
3.  **Push to GitHub:** Create a new GitHub repository, add a `.gitignore` (ignoring `node_modules/`, `frontend/build/`), commit, and push all project files (excluding `node_modules`).
4.  **Connect Netlify:** Log in to Netlify, import the project from GitHub, select the repository.
5.  **Configure Build:** Netlify should detect settings from `netlify.toml`. Verify:
    *   Build command: `cd frontend && npm install && npm run build`
    *   Publish directory: `frontend/build`
    *   Functions directory: `netlify/functions`
6.  **Deploy:** Click "Deploy site". Netlify will install dependencies (root, frontend, backend implicitly via functions), build the frontend, and deploy functions.
7.  **Access:** Use the public URL provided by Netlify.

*Important Note:* Netlify's free tier functions have execution time limits (e.g., 10 seconds). Complex TTS/video generation might time out. For heavy processing, consider dedicated backend hosting (Heroku, Render, VPS) or specialized AI/media processing services.

## Customization & Extension

### Adding TTS Engines

1.  Install the necessary library/SDK for the new engine in the `backend` directory.
2.  Update `backend/routes/tts.js`:
    *   Add the engine and its voices to the `mockEngines` (or fetch dynamically).
    *   Modify the `/generate` endpoint logic to call the new engine's API when its voices are selected.

### Adding Backgrounds/Music

1.  Place new video/audio files in an accessible location (e.g., served statically or hosted externally).
2.  Update `mockBackgrounds` or `mockMusic` arrays in `backend/routes/video.js` with the new options and their URLs/paths.

### Improving FFmpeg Integration

The current backend routes simulate FFmpeg processing. To implement real processing:

1.  Ensure FFmpeg is installed in the environment where the backend runs (locally or on the server/function environment).
2.  Install the `@ffmpeg/ffmpeg` library in the `backend`.
3.  Modify the `/generate` and `/split-screen` endpoints in `backend/routes/video.js`:
    *   Use `@ffmpeg/ffmpeg` and `@ffmpeg/util` to load FFmpeg core.
    *   Fetch input files (TTS audio, background video, music) into FFmpeg's virtual filesystem.
    *   Construct and execute FFmpeg commands (e.g., using `ffmpeg.exec([...args])`) for combining, overlaying, and encoding.
    *   Read the output file from FFmpeg's virtual filesystem and save/serve it.
    *   Handle potential errors and long processing times (especially relevant for serverless functions).
