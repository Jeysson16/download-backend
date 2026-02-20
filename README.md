# 🎵 Spotify & YouTube Downloader Backend

![Node.js](https://img.shields.io/badge/Node.js-v14+-green?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express-v4-blue?style=for-the-badge&logo=express)
![Swagger](https://img.shields.io/badge/Swagger-UI-85EA2D?style=for-the-badge&logo=swagger)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

A powerful Node.js backend API designed to handle media downloads from Spotify and YouTube effortlessly. Built with `spotdl` and `yt-dlp` for maximum reliability.

---

## 🚀 Features

*   **Spotify Downloads**: Convert Spotify tracks to high-quality MP3s with metadata.
*   **YouTube Downloads**: Fetch videos (MP4) or extract audio (MP3) from YouTube.
*   **File Management**: List and serve downloaded files directly via API.
*   **Swagger Documentation**: Interactive API documentation available at `/api-docs`.
*   **CORS Enabled**: Ready for frontend integration (React, Flutter, Vue, etc.).

---

## 🛠️ Tech Stack

*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Core Tools**:
    *   `spotdl` (Spotify Downloader)
    *   `yt-dlp` (YouTube Downloader)
    *   `ffmpeg` (Media Processing)
*   **Documentation**: Swagger UI Express

---

## 📚 API Documentation

Once the server is running, visit:
**`http://localhost:5000/api-docs`**

You can test all endpoints directly from the browser!

---

## 🔧 Installation & Setup

### Prerequisites

Ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v14+)
*   [Python](https://www.python.org/) (v3.8+)
*   [FFmpeg](https://ffmpeg.org/) (Added to System PATH)

### 1. Clone the Repository
```bash
git clone https://github.com/Jeysson16/download-backend.git
cd download-backend
```

### 2. Install Dependencies
```bash
# Node.js dependencies
npm install

# Python tools (Required for downloads)
pip install spotdl yt-dlp
```

### 3. Run the Server
```bash
npm start
```
The server will start on port `5000`.

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Check API status and FFmpeg availability |
| `POST` | `/download` | Download a track from Spotify |
| `POST` | `/download/youtube` | Download video/audio from YouTube |
| `GET` | `/songs` | List all downloaded files |
| `GET` | `/files/*` | Serve/Stream a specific file |

---

## ☁️ Deployment

### Deploy on Vercel
> **Note:** Vercel is great for the API logic, but since `spotdl` and `yt-dlp` require Python and FFmpeg binaries, standard Vercel functions might fail during actual downloads. For full functionality, consider deploying to a container-based service like **Railway**, **Render**, or **Fly.io** using a Dockerfile.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FJeysson16%2Fdownload-backend)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
