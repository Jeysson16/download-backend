# Usar una imagen base de Python oficial
FROM python:3.11-slim

# Instalar FFmpeg (necesario para spotdl) y otras dependencias del sistema
RUN apt-get update && \
    apt-get install -y ffmpeg git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de requerimientos e instalarlos
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto del código
COPY . .

# Crear directorios necesarios para spotdl cache y descargas si no existen
RUN mkdir -p .spotdl
RUN mkdir -p downloads

# Exponer el puerto (Render usa la variable PORT, pero documentamos 5000)
EXPOSE 5000

# Comando para iniciar la aplicación usando Gunicorn
# Se usa la variable de entorno PORT proporcionada por Render/Heroku
CMD gunicorn --bind 0.0.0.0:$PORT api:app
