from PIL import Image, ImageDraw, ImageFont

FONT_PATH = "/usr/share/fonts/truetype/fonts-japanese-gothic.ttf"
def font(size): return ImageFont.truetype(FONT_PATH, size)

# A4 at ~200dpi
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

def wrap_text(s, size, max_w):
    lines = []
    cur = ""
    for ch in s:
        test = cur + ch
        if text_w(test, size) > max_w and cur:
            lines.append(cur)
            cur = ch
        else:
            cur = test
    if cur:
        lines.append(cur)
    return lines

PAD = 70

# ===== タイトル =====
y = 70
text(W//2, y, "お仕事がやってくる", 52, DARK, anchor="mm")
y += 64
text(W//2, y, "3つのしくみ", 52, (192, 57, 43), anchor="mm")
y += 50
text(W//2, y, "お店に来てくれる人だけじゃなく、", 24, GRAY, anchor="mm")
y += 32
text(W//2, y, "遠くの会社や人からも「お願いします」と言われる方法", 24, GRAY, anchor="mm")
y += 50

# ===== 今とこれから =====
box_h = 200
rect(PAD, y, W - PAD*2, box_h, WHITE, radius=20, outline=(220,210,195), width=2)
half = (W - PAD*2) // 2
text(PAD + half//2, y + 36, "今", 30, (150,150,150), anchor="mm")
text(PAD + half//2, y + 100, "お店に来た人にだけ", 22, DARK, anchor="mm")
text(PAD + half//2, y + 136, "料理を出している", 22, DARK, anchor="mm")

text(PAD + half + half//2, y + 36, "これから", 30, (192, 57, 43), anchor="mm")
text(PAD + half + half//2, y + 100, "知らない会社や人からも", 22, DARK, anchor="mm")
text(PAD + half + half//2, y + 136, "「作ってほしい」と頼まれる", 22, DARK, anchor="mm")

# arrow
text(PAD + half, y + box_h//2, "→", 40, (192,57,43), anchor="mm")

y += box_h + 50

# ===== 3つのカード =====
cards = [
    {
        "num": "1",
        "name": "料理家ネット",
        "tagline": "紹介してもらう",
        "color": (66, 133, 244),
        "light": (232, 240, 254),
        "desc": [
            "「料理が得意な人」として登録しておくと、",
            "困っている会社が選んでくれる場所。",
            "",
            "たとえるなら…",
            "料理人版の「人材紹介所」です。",
            "会社の方から声をかけてもらえます。",
        ],
        "you_do": "登録して、待つ",
    },
    {
        "num": "2",
        "name": "ココナラ",
        "tagline": "自分のお店を出す",
        "color": (39, 174, 96),
        "light": (232, 253, 240),
        "desc": [
            "「これができます、いくらです」という",
            "看板を自分で出せるネット上の屋台。",
            "",
            "たとえるなら…",
            "フリーマーケットのお店番です。",
            "見た人が気に入ったら注文してくれます。",
        ],
        "you_do": "看板を出して、待つ",
    },
    {
        "num": "3",
        "name": "ランサーズ",
        "tagline": "貼り紙に応募する",
        "color": (230, 126, 34),
        "light": (255, 240, 232),
        "desc": [
            "「こんな仕事をしてくれる人を",
            "探しています」という貼り紙がたくさんある場所。",
            "",
            "たとえるなら…",
            "アルバイトの貼り紙を見て、",
            "「私やります」と手を挙げるイメージです。",
        ],
        "you_do": "見つけて、自分から手を挙げる",
    },
]

card_w = W - PAD*2
for c in cards:
    card_h = 360
    rect(PAD, y, card_w, card_h, c["light"], radius=20)
    d.rounded_rectangle([PAD, y, PAD+card_w, y+card_h], radius=20, outline=c["color"], width=3)

    # left accent
    rect(PAD, y, 10, card_h, c["color"], radius=0)

    ix = PAD + 40
    iy = y + 30

    # number circle + name
    cr = 28
    d.ellipse([ix, iy, ix + cr*2, iy + cr*2], fill=c["color"])
    text(ix + cr, iy + cr, c["num"], 30, WHITE, anchor="mm")
    text(ix + 80, iy + 4, c["name"], 38, DARK)
    tagw = text_w(c["tagline"], 22) + 24
    rect(ix + 80, iy + 56, tagw, 38, c["color"], radius=19)
    text(ix + 80 + tagw//2, iy + 75, c["tagline"], 22, WHITE, anchor="mm")

    iy += 120
    for line in c["desc"]:
        text(ix, iy, line, 23, (70,70,70))
        iy += 33

    # you do badge
    by = y + card_h - 56
    badge_text = "▶ あなたがすること： " + c["you_do"]
    bw = text_w(badge_text, 22) + 30
    rect(ix, by, bw, 42, WHITE, radius=21, outline=c["color"], width=2)
    text(ix + 15, by + 21, badge_text, 22, c["color"], anchor="lm")

    y += card_h + 36

final_h = y + 50
img = img.crop((0, 0, W, final_h))

out = "/home/user/pachino-menu/public/explain-page1.png"
img.save(out, "PNG")
print("saved page1:", out, "height used:", final_h)
