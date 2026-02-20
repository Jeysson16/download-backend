# Spotify & YouTube Downloader Backend

Backend en Node.js para descargar música y vídeos de Spotify y YouTube.

## Requisitos

*   Node.js (v14 o superior)
*   Python (3.8 o superior)
*   `ffmpeg` instalado y en el PATH del sistema.
*   Herramientas de Python: `spotdl` y `yt-dlp`.

## Instalación

1.  Clona el repositorio:
    ```bash
    git clone https://github.com/TU_USUARIO/spotify-downloader-backend.git
    cd spotify-downloader-backend
    ```

2.  Instala las dependencias de Node.js:
    ```bash
    npm install
    ```

3.  Instala las herramientas de Python necesarias:
    ```bash
    pip install spotdl yt-dlp
    ```

## Uso

Inicia el servidor:

```bash
npm start
```

El servidor correrá en `http://localhost:5000`.

## API Endpoints

### 1. Descargar de Spotify

*   **Endpoint:** `POST /download`
*   **Body:**
    ```json
    {
      "url": "https://open.spotify.com/track/..."
    }
    ```
*   **Respuesta Exitosa:**
    ```json
    {
      "success": true,
      "message": "Download completed successfully",
      "data": {
        "url": "https://open.spotify.com/track/...",
        "output": "..."
      }
    }
    ```

### 2. Descargar de YouTube

*   **Endpoint:** `POST /download/youtube`
*   **Body:**
    ```json
    {
      "url": "https://www.youtube.com/watch?v=...",
      "format": "audio" // o "video"
    }
    ```
*   **Respuesta Exitosa:**
    ```json
    {
      "success": true,
      "message": "Download completed successfully",
      "data": {
        "url": "https://www.youtube.com/watch?v=...",
        "format": "audio",
        "output": "..."
      }
    }
    ```

### 3. Listar Canciones Descargadas

*   **Endpoint:** `GET /songs`
*   **Respuesta:** Lista de objetos con `name`, `path` y `folder`.

### 4. Servir Archivos

*   **Endpoint:** `GET /files/<path_del_archivo>`
*   Permite descargar o reproducir el archivo.

## Estructura de Carpetas

*   `api.js`: Lógica principal del servidor.
*   `downloads/`: Carpeta donde se guardan los archivos descargados (ignorada por Git).
