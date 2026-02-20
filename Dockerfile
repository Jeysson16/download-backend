FROM node:18-slim

# Install Python 3, pip, and FFmpeg
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Install spotdl and yt-dlp globally via pip
# Break system packages is needed for some environments, or use venv. 
# For simple docker container, --break-system-packages is acceptable on newer debian/ubuntu
RUN pip3 install spotdl yt-dlp --break-system-packages

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
