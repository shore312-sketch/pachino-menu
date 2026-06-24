from PIL import Image, ImageDraw, ImageFont

FONT_PATH = "/usr/share/fonts/truetype/fonts-japanese-gothic.ttf"
def font(size): return ImageFont.truetype(FONT_PATH, size)

W, H = 1654, 2339
BG = (250, 247, 240)
DARK = (30, 30, 30)
GRAY = (110, 110, 110)
WHITE = (255, 255, 255)
LGRAY = (210, 205, 195)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

def text(x, y, s, size, color=DARK, anchor="la"):
    d.text((x, y), s, font=font(size), fill=color, anchor=anchor)

def text_w(s, size):
    bb = font(size).getbbox(s)
    return bb[2] - bb[0]

def rect(x, y, w, h, fill, radius=16, outline=None, width=1):
    d.rounded_rectangle([x, y, x+w, y+h], radius=radius, fill=fill, outline=outline, width=width)

PAD = 70

# ===== タイトル =====
y = 70
text(W//2, y, "進める順番", 52, DARK, anchor="mm")
y += 50
text(W//2, y, "むずかしく考えなくていい。この順番でやるだけ", 24, GRAY, anchor="mm")
y += 70

# ===== ステップ（縦の矢印つき） =====
steps = [
    {
        "label": "STEP 1",
        "title": "ココナラに登録する",
        "sub": "まず自分の看板を出してみる",
        "color": (39, 174, 96),
        "light": (232, 253, 240),
    },
    {
        "label": "STEP 2",
        "title": "料理家ネットに登録する",
        "sub": "会社から声がかかる準備をする",
        "color": (66, 133, 244),
        "light": (232, 240, 254),
    },
    {
        "label": "STEP 3",
        "title": "ランサーズで応募してみる",
        "sub": "慣れてきたら自分から動いてみる",
        "color": (230, 126, 34),
        "light": (255, 240, 232),
    },
]

circle_r = 36
line_x = PAD + circle_r
card_x = PAD + circle_r*2 + 30
card_w = W - card_x - PAD

for i, s in enumerate(steps):
    card_h = 160
    cy = y

    if i < len(steps) - 1:
        d.line([(line_x, cy + circle_r*2), (line_x, cy + card_h + 40)], fill=LGRAY, width=6)

    d.ellipse([line_x - circle_r, cy, line_x + circle_r, cy + circle_r*2], fill=s["color"])
    text(line_x, cy + circle_r, str(i+1), 36, WHITE, anchor="mm")

    rect(card_x, cy, card_w, card_h, s["light"], radius=18, outline=s["color"], width=2)
    text(card_x + 30, cy + 28, s["label"], 18, s["color"])
    text(card_x + 30, cy + 56, s["title"], 32, DARK)
    text(card_x + 30, cy + 104, s["sub"], 21, (90,90,90))

    y += card_h + 40

y += 20

# ===== 比較表 =====
text(PAD, y, "ひと目でわかる比較", 32, DARK)
y += 56

headers = ["", "料理家ネット", "ココナラ", "ランサーズ"]
rows = [
    ["しくみ", "紹介してもらう", "お店を出す", "貼り紙に応募"],
    ["動き方", "待つ", "待つ", "自分から動く"],
    ["価格", "会社が決める", "自分で決める", "相談して決める"],
]

table_x = PAD
table_w = W - PAD*2
col0_w = 220
col_w = (table_w - col0_w) // 3
row_h = 76
header_h = 64

colors = [(66,133,244), (39,174,96), (230,126,34)]
lights = [(232,240,254), (232,253,240), (255,240,232)]

# header row
rect(table_x, y, table_w, header_h, (40,40,50), radius=14)
for ci, h_text in enumerate(headers):
    if ci == 0:
        continue
    cx = table_x + col0_w + col_w*(ci-1)
    text(cx + col_w//2, y + header_h//2, h_text, 24, WHITE, anchor="mm")
y += header_h + 8

for r in rows:
    rect(table_x, y, col0_w - 8, row_h, (235,230,220), radius=12)
    text(table_x + (col0_w-8)//2, y + row_h//2, r[0], 23, DARK, anchor="mm")
    for ci in range(3):
        cx = table_x + col0_w + col_w*ci
        rect(cx + 4, y, col_w - 8, row_h, lights[ci], radius=12)
        text(cx + col_w//2, y + row_h//2, r[ci+1], 21, colors[ci], anchor="mm")
    y += row_h + 8

# ===== フッター =====
y += 30
rect(PAD, y, W - PAD*2, 90, (255,255,255), radius=16, outline=LGRAY, width=2)
text(W//2, y + 45, "どれも登録は無料。失敗しても大丈夫。まずは1つずつ。", 24, (192,57,43), anchor="mm")

final_h = y + 70
img = img.crop((0, 0, W, final_h))

out = "/home/user/pachino-menu/public/explain-page2.png"
img.save(out, "PNG")
print("saved page2:", out, "height used:", final_h)
