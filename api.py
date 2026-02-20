import os
import subprocess
import shutil
from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
import urllib.parse

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def check_ffmpeg():
    """Verifica si FFmpeg está instalado y accesible."""
    if shutil.which("ffmpeg"):
        return True
    
    home = os.path.expanduser("~")
    spotdl_ffmpeg = os.path.join(home, ".spotdl", "ffmpeg.exe")
    if os.path.exists(spotdl_ffmpeg):
        return True
    return False

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "ffmpeg": check_ffmpeg()})

@app.route('/download', methods=['POST'])
def download():
    data = request.json
    url = data.get('url')
    
    if not url:
        return jsonify({"error": "URL is required"}), 400

    if not check_ffmpeg():
        return jsonify({"error": "FFmpeg not found. Please install it."}), 500

    try:
        # Run spotdl
        # Using subprocess to run the command
        process = subprocess.Popen(
            ["spotdl", url],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            cwd=os.getcwd() # Download to current directory
        )
        stdout, stderr = process.communicate()
        
        if process.returncode == 0:
            return jsonify({
                "message": "Download completed successfully",
                "output": stdout
            })
        else:
            return jsonify({
                "error": "Download failed",
                "details": stderr or stdout
            }), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/download/youtube', methods=['POST'])
def download_youtube():
    data = request.json
    url = data.get('url')
    format_type = data.get('format', 'video') # 'video' or 'audio'
    
    if not url:
        return jsonify({"error": "URL is required"}), 400

    if not check_ffmpeg():
        return jsonify({"error": "FFmpeg not found. Please install it."}), 500

    try:
        command = ["yt-dlp"]
        
        if format_type == 'audio':
            # Download audio only and convert to mp3
            command.extend(["-x", "--audio-format", "mp3"])
        else:
            # Download best video+audio and merge to mp4
            command.extend(["--format", "bestvideo+bestaudio/best", "--merge-output-format", "mp4"])
            
        # Output template to current directory
        command.extend(["--output", "%(title)s.%(ext)s", url])

        process = subprocess.Popen(
            command,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            cwd=os.getcwd()
        )
        stdout, stderr = process.communicate()
        
        if process.returncode == 0:
            return jsonify({
                "message": "Download completed successfully",
                "output": stdout
            })
        else:
            return jsonify({
                "error": "Download failed",
                "details": stderr or stdout
            }), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/songs', methods=['GET'])
def list_songs():
    """List all mp3 files in the current directory and subdirectories."""
    songs = []
    root_dir = os.getcwd()
    
    for dirpath, dirnames, filenames in os.walk(root_dir):
        # Skip hidden directories and mtouch_music
        if ".git" in dirpath or "mtouch_music" in dirpath or ".trae" in dirpath:
            continue
            
        for filename in filenames:
            if filename.lower().endswith(('.mp3', '.mp4')):
                full_path = os.path.join(dirpath, filename)
                rel_path = os.path.relpath(full_path, root_dir)
                songs.append({
                    "name": filename,
                    "path": rel_path,
                    "folder": os.path.basename(dirpath)
                })
    
    return jsonify({"songs": songs})

@app.route('/files/<path:filepath>', methods=['GET'])
def serve_file(filepath):
    """Serve the audio file."""
    try:
        # Decode the filepath just in case
        decoded_path = urllib.parse.unquote(filepath)
        # Verify it exists
        if os.path.exists(decoded_path):
            return send_file(decoded_path, as_attachment=True)
        else:
            return jsonify({"error": "File not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting server on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=False)
