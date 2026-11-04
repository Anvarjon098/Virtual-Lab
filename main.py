"""Qurilish materiallari virtual laboratoriyasi — lokal veb-server.

Ishga tushirish:  python main.py  [--port 8000] [--no-browser]
So'ng brauzerda http://localhost:8000 manzili ochiladi.
"""
import argparse
import functools
import http.server
import socketserver
import threading
import webbrowser
from pathlib import Path

STATIC_DIR = Path(__file__).resolve().parent / "static"


class Handler(http.server.SimpleHTTPRequestHandler):
    # Windows reyestri .js uchun noto'g'ri MIME tur qaytarishi mumkin
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        ".js": "application/javascript; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".html": "text/html; charset=utf-8",
    }

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, fmt, *args):
        pass


class Server(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True


def main():
    parser = argparse.ArgumentParser(description="Qurilish materiallari virtual laboratoriyasi")
    parser.add_argument("--port", type=int, default=8000)
    parser.add_argument("--no-browser", action="store_true", help="brauzerni avtomatik ochmaslik")
    args = parser.parse_args()

    if not (STATIC_DIR / "index.html").exists():
        print(f"XATO: {STATIC_DIR / 'index.html'} topilmadi. main.py 'static' papkasi bilan bir joyda bo'lishi kerak.")
        input("Chiqish uchun Enter bosing...")
        return

    handler = functools.partial(Handler, directory=str(STATIC_DIR))
    httpd = None
    for port in range(args.port, args.port + 20):   # port band bo'lsa keyingisini sinaymiz
        try:
            httpd = Server(("127.0.0.1", port), handler)
            break
        except OSError:
            print(f"{port}-port band, keyingisi sinab ko'rilmoqda...")
    if httpd is None:
        print("XATO: bo'sh port topilmadi.")
        input("Chiqish uchun Enter bosing...")
        return

    with httpd:
        url = f"http://127.0.0.1:{port}/"
        print("=" * 60)
        print(f"  Virtual laboratoriya ishga tushdi: {url}")
        print("  Brauzerda shu manzilni oching.")
        print("  Bu oynani YOPMANG - yopilsa server to'xtaydi.")
        print("  To'xtatish uchun Ctrl+C bosing.")
        print("=" * 60, flush=True)
        if not args.no_browser:
            threading.Timer(0.8, webbrowser.open, args=(url,)).start()
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer to'xtatildi.")


if __name__ == "__main__":
    main()
