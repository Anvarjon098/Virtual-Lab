"""Qurilish Lab — Windows ilovasi (alohida oynada, brauzersiz).

static/ papkasidagi veb-ilovani Edge WebView2 oynasida ochadi.
Jurnal va talaba ismi %APPDATA%\\QurilishLab papkasida saqlanadi.

Ishga tushirish (dasturchi uchun):  pip install pywebview  &&  python desktop/desktop.py
"""
import os
import sys

import webview


def base_dir():
    # PyInstaller bilan yig'ilgan .exe ichida fayllar vaqtinchalik papkaga ochiladi
    if getattr(sys, "frozen", False):
        return sys._MEIPASS
    return os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def main():
    index = os.path.join(base_dir(), "static", "index.html")
    storage = os.path.join(os.environ.get("APPDATA", os.path.expanduser("~")), "QurilishLab")
    os.makedirs(storage, exist_ok=True)

    webview.settings["OPEN_EXTERNAL_LINKS_IN_BROWSER"] = True
    webview.create_window(
        "Qurilish Lab — Qurilish materiallari virtual laboratoriyasi",
        index,
        width=1400,
        height=900,
        min_size=(900, 600),
    )
    webview.start(http_server=True, private_mode=False, storage_path=storage)


if __name__ == "__main__":
    main()
