from PIL import Image, ImageDraw, ImageFont
import math

FONT_PATH = "/usr/share/fonts/truetype/fonts-japanese-gothic.ttf"
def font(size): return ImageFont.truetype(FONT_PATH, size)

W, H = 1654, 2339
BG = (250, 247, 240)
DARK = (30, 30, 30)
GRAY = (110, 110, 110)
WHITE = (255, 255, 255)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

def text(x, y, s, size, color=DARK, anchor="la"):
    d.text((x, y), s, font=font(size), fill=color, anchor=anchor)

def text_w(s, size):
    bb = font(size).getbbox(s)
    return bb[2] - bb[0]

def rect(x, y, w, h, fill, radius=16, outline=None, width=1):
    d.rounded_rectangle([x, y, x+w, y+h], radius=radius, fill=fill, outline=outline, width=width)

def center_text_block(cx, y, lines, size, color, gap=None, anchor_each="mm"):
    gap = gap or int(size*1.4)
    for i, line in enumerate(lines):
        text(cx, y + i*gap, line, size, color, anchor=anchor_each)

PAD = 70

# ===== タイトル =====
y = 80
text(W//2, y, "SNSが3つの夢をかなえる仕組み", 46, DARK, anchor="mm")
y += 56
text(W//2, y, "主役は「つまみ」。お酒は脇役。", 30, (192, 57, 43), anchor="mm")
y += 70

# ===== 中央の図：つまみ → 3つの夢 =====
center_x = W // 2
center_r = 150
card_w, card_h = 340, 140
dist = 360
top_clear_y = y + 40  # 上のカードがタイトルと重ならないための最小y
center_y = top_clear_y + dist + card_h // 2

# 中心の円（つまみ）
d.ellipse([center_x-center_r, center_y-center_r, center_x+center_r, center_y+center_r],
          fill=(230,126,34), outline=(180,90,20), width=4)
text(center_x, center_y - 20, "つまみ", 46, WHITE, anchor="mm")
text(center_x, center_y + 35, "（料理）", 26, WHITE, anchor="mm")

# 3つの夢（カード）と矢印
goals = [
    {
        "title": "①メニュー開発",
        "sub": "の仕事が来る",
        "color": (66, 133, 244),
        "light": (232, 240, 254),
        "angle": -90,  # 上
    },
    {
        "title": "②ドレッシング",
        "sub": "の宣伝になる",
        "color": (39, 174, 96),
        "light": (232, 253, 240),
        "angle": 30,  # 右下
    },
    {
        "title": "③つまみの本",
        "sub": "を出版できる",
        "color": (155, 89, 182),
        "light": (243, 232, 253),
        "angle": 150,  # 左下
    },
]

for g in goals:
    rad = math.radians(g["angle"])
    gx = center_x + dist * math.cos(rad)
    gy = center_y + dist * math.sin(rad)

    # 矢印（中心から伸びる線）
    edge_x = center_x + (center_r+10) * math.cos(rad)
    edge_y = center_y + (center_r+10) * math.sin(rad)
    target_x = gx - (card_w/2 + 10) * math.cos(rad) * 0
    # simplify: just draw line from circle edge toward card center, stop before card
    line_end_x = gx - 0
    line_end_y = gy - 0
    d.line([(edge_x, edge_y), (gx, gy)], fill=g["color"], width=6)

    rect(gx - card_w//2, gy - card_h//2, card_w, card_h, g["light"], radius=20, outline=g["color"], width=3)
    text(gx, gy - 22, g["title"], 30, DARK, anchor="mm")
    text(gx, gy + 24, g["sub"], 24, g["color"], anchor="mm")

lowest_card_y = center_y + dist * math.sin(math.radians(30)) + card_h // 2
y = int(lowest_card_y) + 70

# ===== なぜつながるか説明 =====
text(PAD, y, "なぜ「つまみ」が3つ全部に繋がるのか", 32, DARK)
y += 56

reasons = [
    ("①", (66,133,244), "居酒屋・飲食店が一番ほしいのは「酒が進む一品」。", "つまみ専門＝その道のプロだと一目で伝わる"),
    ("②", (39,174,96), "カルパッチョ・サラダ＝つまみ。発信で使い続ければ", "発売の時に「あの人のドレッシング」と覚えてもらえる"),
    ("③", (155,89,182), "「つまみ」は出版の人気ジャンル。発信の積み重ねが", "そのまま本の企画書になる"),
]

for num, color, line1, line2 in reasons:
    row_h = 100
    rect(PAD, y, W-PAD*2, row_h, WHITE, radius=16, outline=(225,220,210), width=2)
    cr = 28
    d.ellipse([PAD+24, y+row_h//2-cr, PAD+24+cr*2, y+row_h//2+cr], fill=color)
    text(PAD+24+cr, y+row_h//2, num, 28, WHITE, anchor="mm")
    text(PAD+100, y+34, line1, 22, DARK)
    text(PAD+100, y+66, line2, 22, (90,90,90))
    y += row_h + 16

y += 20

# ===== まとめの一言 =====
rect(PAD, y, W-PAD*2, 110, (30,30,46), radius=20)
text(W//2, y+38, "お酒の話はしない。「お酒に合うつまみ」を見せる。", 26, WHITE, anchor="mm")
text(W//2, y+78, "それだけで、3つの夢が同じアカウントに繋がります。", 22, (200,200,210), anchor="mm")
y += 110 + 40

final_h = y
img = img.crop((0, 0, W, final_h))
out = "/home/user/pachino-menu/public/sns-concept.png"
img.save(out, "PNG")
print("saved:", out, "height:", final_h)
