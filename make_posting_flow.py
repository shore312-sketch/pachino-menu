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
text(W//2, y, "投稿の進め方", 52, DARK, anchor="mm")
y += 60
text(W//2, y, "缶詰つまみ → ドレッシング", 38, (192, 57, 43), anchor="mm")
y += 46
text(W//2, y, "このままの順番で発信すればOK", 24, GRAY, anchor="mm")
y += 60

# ===== 3つのステップ（タイムライン） =====
steps = [
    {
        "label": "投稿 ①〜⑤",
        "title": "缶詰つまみ（＋プロの一手間）",
        "sub": "まずはフォロワーを集める・キャラを作る",
        "color": (66, 133, 244),
        "light": (232, 240, 254),
    },
    {
        "label": "投稿 ⑥",
        "title": "缶詰 × お店のドレッシング",
        "sub": "「これ何ですか？」を自然に発生させる",
        "color": (39, 174, 96),
        "light": (232, 253, 240),
    },
    {
        "label": "投稿 ⑦以降",
        "title": "缶詰・カルパッチョなどを混ぜながら",
        "sub": "時々ドレッシングを「いつものやつ」として見せる",
        "color": (155, 89, 182),
        "light": (243, 232, 253),
    },
]

circle_r = 36
line_x = PAD + circle_r
card_x = PAD + circle_r*2 + 30
card_w = W - card_x - PAD

for i, s in enumerate(steps):
    card_h = 150
    cy = y

    if i < len(steps) - 1:
        d.line([(line_x, cy + circle_r*2), (line_x, cy + card_h + 30)], fill=LGRAY, width=6)

    d.ellipse([line_x - circle_r, cy, line_x + circle_r, cy + circle_r*2], fill=s["color"])
    text(line_x, cy + circle_r, str(i+1), 36, WHITE, anchor="mm")

    rect(card_x, cy, card_w, card_h, s["light"], radius=18, outline=s["color"], width=2)
    text(card_x + 30, cy + 26, s["label"], 20, s["color"])
    text(card_x + 30, cy + 56, s["title"], 30, DARK)
    text(card_x + 30, cy + 100, s["sub"], 21, (90,90,90))

    y += card_h + 30

y += 30

# ===== プロの一手間 ＝ ここだけは外さない =====
text(PAD, y, "「プロの一手間」を必ず1つ入れる", 32, DARK)
y += 46
text(PAD, y, "これがないと「節約アカウント」に見えてしまう。これがあると「プロが教える裏ワザ」に変わる。", 21, GRAY)
y += 50

box_h = 180
rect(PAD, y, W-PAD*2, box_h, WHITE, radius=20, outline=(230,126,34), width=3)
rect(PAD, y, 10, box_h, (230,126,34), radius=0)
ix = PAD + 40
iy = y + 28
text(ix, iy, "セリフの例", 22, (230,126,34))
iy += 40
text(ix, iy, "「サバ缶に、●●を足すだけでお店の味になります」", 25, DARK)
iy += 44
text(ix, iy, "「料理人が缶詰を使うなら、ここだけは押さえます」", 25, DARK)
y += box_h + 50

# ===== なぜこの順番がいいか =====
text(PAD, y, "なぜこの順番がいいのか", 32, DARK)
y += 56

reasons = [
    ("①", (66,133,244), "缶詰は「真似できそう」と思われる＝保存・シェアされやすい。", "ハードルが低いから旦那さんも続けやすい"),
    ("②", (39,174,96), "急に「ドレッシング紹介！」にしない。", "あくまで「缶詰つまみがこれで旨くなる」見せ方にする"),
    ("③", (155,89,182), "毎回じゃなく、混ぜながら時々出す。", "発売前から「あのドレッシング欲しい」という空気を作る"),
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
rect(PAD, y, W-PAD*2, 130, (30,30,46), radius=20)
text(W//2, y+38, "缶詰でOK。ただしプロの一手間を欠かさない。", 26, WHITE, anchor="mm")
text(W//2, y+78, "ドレッシングは「紹介」じゃなく「使ってる風景」で見せる。", 22, (200,200,210), anchor="mm")
y += 130 + 40

final_h = y
img = img.crop((0, 0, W, final_h))
out = "/home/user/pachino-menu/public/posting-flow.png"
img.save(out, "PNG")
print("saved:", out, "height:", final_h)
