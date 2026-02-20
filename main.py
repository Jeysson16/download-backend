import os
import subprocess
import sys
import shutil

def check_ffmpeg():
    """Verifica si FFmpeg está instalado y accesible en el sistema o en la carpeta de spotdl."""
    # 1. Verificar en el PATH del sistema
    if shutil.which("ffmpeg"):
        return True
    
    # 2. Verificar en la carpeta por defecto de spotdl
    home = os.path.expanduser("~")
    spotdl_ffmpeg = os.path.join(home, ".spotdl", "ffmpeg.exe")
    if os.path.exists(spotdl_ffmpeg):
        return True
        
    print("❌ Error: FFmpeg no está instalado o no se encuentra en el PATH.")
    print("FFmpeg es necesario para descargar y convertir las canciones.")
    print("\nPara solucionarlo:")
    print("1. Opción A: Ejecuta 'spotdl --download-ffmpeg' en la terminal después de instalar las dependencias.")
    print("2. Opción B: Descarga FFmpeg manualmente desde https://ffmpeg.org/download.html y agrégalo a tu PATH.")
    return False

def download_spotify_content():
    print("\n🎵 Spotify Downloader (basado en spotDL) 🎵")
    print("--------------------------------------------")
    
    url = input("Introduce la URL de Spotify (Canción, Álbum, Playlist o Artista): ").strip()
    
    if not url:
        print("❌ URL no válida.")
        return

    print(f"\n🚀 Iniciando descarga de: {url}")
    print("Esto puede tardar un poco dependiendo de la cantidad de canciones...\n")

    try:
        # Ejecutar spotdl como subproceso
        subprocess.run(["spotdl", url], check=True)
        print("\n✅ ¡Descarga completada!")
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Ocurrió un error durante la descarga. Código de error: {e.returncode}")
    except FileNotFoundError:
        print("\n❌ No se encontró el comando 'spotdl'. Asegúrate de haber instalado las dependencias.")

def download_youtube_content():
    print("\n📺 YouTube Downloader (basado en yt-dlp) 📺")
    print("--------------------------------------------")

    print("¿Qué quieres descargar?")
    print("1. Video (MP4)")
    print("2. Música/Audio (MP3)")
    
    choice = input("Selecciona una opción (1/2): ").strip()
    
    if choice not in ['1', '2']:
        print("❌ Opción no válida.")
        return
        
    url = input("\nIntroduce la URL de YouTube: ").strip()
    
    if not url:
        print("❌ URL no válida.")
        return

    print(f"\n🚀 Iniciando descarga de: {url}")
    
    try:
        command = ["yt-dlp"]
        
        if choice == '2':
            # Audio
            command.extend(["-x", "--audio-format", "mp3"])
        else:
            # Video
            command.extend(["--format", "bestvideo+bestaudio/best", "--merge-output-format", "mp4"])
            
        command.extend(["--output", "%(title)s.%(ext)s", url])
        
        subprocess.run(command, check=True)
        print("\n✅ ¡Descarga completada!")
        
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Ocurrió un error durante la descarga. Código de error: {e.returncode}")
    except FileNotFoundError:
        print("\n❌ No se encontró el comando 'yt-dlp'. Asegúrate de haber instalado las dependencias (pip install yt-dlp).")


def main():
    print("========================================")
    print("      Script de Descargas Universal     ")
    print("========================================")
    
    # Verificar FFmpeg primero
    if not check_ffmpeg():
        # Intentar ofrecer la descarga automática si es posible via comando
        choice = input("\n¿Quieres intentar descargar FFmpeg automáticamente usando spotdl? (s/n): ").lower()
        if choice == 's':
            try:
                subprocess.run(["spotdl", "--download-ffmpeg"], check=True)
                print("✅ FFmpeg descargado. Por favor, intenta ejecutar el script nuevamente.")
                return
            except Exception as e:
                print(f"❌ Error al intentar descargar FFmpeg: {e}")
                return
        else:
            return

    while True:
        print("\nSelecciona el servicio:")
        print("1. Spotify (Música)")
        print("2. YouTube (Video o Música)")
        print("3. Salir")
        
        service = input("Opción: ").strip()
        
        if service == '1':
            download_spotify_content()
        elif service == '2':
            download_youtube_content()
        elif service == '3':
            print("¡Hasta luego! 👋")
            break
        else:
            print("Opción no válida.")

if __name__ == "__main__":
    main()
