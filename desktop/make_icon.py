"""Android ikonkasi bilan bir xil Windows .ico faylini yaratadi: python make_icon.py <chiqish.ico>"""
import sys

from PIL import Image, ImageDraw

S = 256
k = S / 108  # Android vektor ikonkasi 108x108 o'lchamda chizilgan


def r(d, x, y, w, h, c):
    d.rectangle([x * k, y * k, (x + w) * k - 1, (y + h) * k - 1], fill=c)


img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
d.rounded_rectangle([0, 0, S - 1, S - 1], radius=48, fill="#1F4E79")
BLUE, WHITE, GOLD = "#1F4E79", "#FFFFFF", "#F0A500"
# kattaroq ko'rinishi uchun markazdagi 54x54 qismni kattalashtiramiz
k = S / 60
ox, oy = -24, -26
def R(x, y, w, h, c): r(d, x + ox, y + oy, w, h, c)
R(34, 46, 24, 30, WHITE)
for x, y in [(38, 51), (48, 51), (38, 61), (48, 61), (43, 70)]:
    R(x, y, 6, 6, BLUE)
R(64, 32, 4, 44, GOLD)
R(44, 32, 34, 4, GOLD)
R(74, 36, 2, 10, GOLD)
R(72, 46, 6, 5, WHITE)
R(30, 76, 48, 3, WHITE)

img.save(sys.argv[1], sizes=[(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
