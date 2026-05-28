from PIL import Image, ImageDraw, ImageFont

FONT_PATH = "/usr/share/fonts/truetype/fonts-japanese-gothic.ttf"

def font(size): return ImageFont.truetype(FONT_PATH, size)

W = 900
PADDING = 48
CARD_W = W - PADDING * 2
BG = (248, 244, 236)
WHITE = (255, 255, 255)
DARK = (28, 28, 28)
GRAY = (120, 120, 120)
LGRAY = (200, 200, 200)

steps = [
    {
        "num": "1",
        "timing": "今日・30分",
        "title": "得意なことをヒアリングする",
        "body": [
            "奥さんが旦那さんに聞いてメモするだけ",
            "・得意な料理ジャンルは？",
            "・お客さんに喜ばれた料理は？",
            "・任せられる業態は？（居酒屋・旅館など）",
            "・鹿児島食材で得意なものは？",
        ],
        "tip": "これが後のプロフィール文の材料になる",
        "who": "👩 奥さんが聞く",
        "color": (255, 193, 7),
        "light": (255, 249, 220),
    },
    {
        "num": "2",
        "timing": "今週中",
        "title": "お店の料理をスマホで撮影する",
        "body": [
            "5〜10枚、明るい場所で撮るだけでOK",
            "凝った写真でなくていい",
            "「こんな料理が作れる人」が伝わればOK",
        ],
        "tip": "写真があるだけで実績ゼロでも信頼感が全然違う",
        "who": "👨‍🍳 旦那さんが料理 / 👩 奥さんが撮影",
        "color": (231, 76, 60),
        "light": (253, 232, 216),
    },
    {
        "num": "3",
        "timing": "来週",
        "title": "ココナラに登録する（無料）",
        "body": [
            "coconala.com にアカウントを作るだけ",
            "プロフィールに書くこと：",
            "・「和食専門・現役料理人・経験20年」",
            "・STEP①で聞いた得意ジャンル",
            "・STEP②の写真を使う",
        ],
        "tip": "登録するだけでOK。まだ出品しなくていい",
        "who": "👩 奥さんが代わりに全部やってOK",
        "color": (66, 133, 244),
        "light": (232, 240, 254),
    },
    {
        "num": "4",
        "timing": "1ヶ月後",
        "title": "最初のサービスを出品する",
        "body": [
            "奥さんが文章を書いて出品する：",
            "　メニュー相談（30分）：3,000円",
            "　1品レシピ開発：15,000円〜",
            "　5品メニューパック：50,000円〜",
        ],
        "tip": "最初は安めでOK。口コミ・実績を積むのが目的",
        "who": "👩 奥さんが文章を書く",
        "color": (39, 174, 96),
        "light": (232, 253, 240),
    },
    {
        "num": "5",
        "timing": "案件が来たら",
        "title": "初案件をこなして口コミをもらう",
        "body": [
            "やりとりは奥さんが担当",
            "旦那さんは試作・レシピ作りに集中するだけ",
            "納品後「レビューをお願いします」と伝える",
        ],
        "tip": "口コミが1件つくだけで次の依頼が来やすくなる",
        "who": "👩 やりとり  /  👨‍🍳 料理・試作",
        "color": (155, 89, 182),
        "light": (243, 232, 253),
    },
    {
        "num": "6",
        "timing": "口コミ2〜3件後",
        "title": "ランサーズにも登録・案件に応募する",
        "body": [
            "lancers.jp で企業からの案件に応募",
            "単価も少しずつ上げていく：",
            "　1品：3〜5万円 / パック：15〜30万円",
        ],
        "tip": "実績があると「この人に頼みたい」と選ばれやすくなる",
        "who": "👩 奥さんが提案文を送る",
        "color": (230, 126, 34),
        "light": (255, 240, 232),
    },
    {
        "num": "★",
        "timing": "半年〜1年後",
        "title": "旅館・食品会社など高単価案件へ",
        "body": [
            "鹿児島の観光旅館や食品メーカーへの監修",
            "月額顧問契約（3〜5万円/月）なども狙える",
            "月30〜50万円も視野に入ってくる",
        ],
        "tip": "「副収入」から「もうひとつの柱」になる",
        "who": "二人三脚で！",
        "color": (243, 156, 18),
        "light": (26, 26, 46),
        "dark_card": True,
    },
]

# --- calculate height ---
def measure_card_height(d, step):
    line_h = 28
    body_h = len(step["body"]) * line_h
    return 28 + 14 + 10 + 26 + body_h + 10 + 20 + 10 + 24 + 24

HEADER_H = 160
INCOME_H = 220
FOOTER_H = 60
STEP_GAP = 16
card_heights = []
# rough estimate
tmp = Image.new("RGB", (W, 100))
d_tmp = ImageDraw.Draw(tmp)
for s in steps:
    card_heights.append(measure_card_height(d_tmp, s))

total_h = HEADER_H + sum(card_heights) + STEP_GAP * len(steps) + INCOME_H + FOOTER_H + 80
img = Image.new("RGB", (W, total_h), BG)
d = ImageDraw.Draw(img)

def rect(x, y, w, h, fill, radius=12):
    d.rounded_rectangle([x, y, x+w, y+h], radius=radius, fill=fill)

def text(x, y, s, size, color=DARK, anchor="la"):
    try:
        d.text((x, y), s, font=font(size), fill=color, anchor=anchor)
    except Exception:
        d.text((x, y), s, font=font(size), fill=color)

def text_w(s, size):
    bb = font(size).getbbox(s)
    return bb[2] - bb[0]

# ---- HEADER ----
y = 32
text(W//2, y, "旦那さんへ", 18, GRAY, anchor="mm")
y += 30
text(W//2, y, "メニュー開発の仕事", 36, DARK, anchor="mm")
y += 44
text(W//2, y, "はじめ方ロードマップ", 36, (192, 57, 43), anchor="mm")
y += 36
text(W//2, y, "知り合い不要・現場経験だけで始められる7ステップ", 18, GRAY, anchor="mm")
y += 50

# role badges
for label, bg, fg, ox in [
    ("👩 奥さん：営業・文章・やりとり担当", (253, 232, 216), (192, 57, 43), -10),
    ("👨‍🍳 旦那さん：料理・試作・レシピ担当", (232, 240, 254), (34, 85, 204), 10),
]:
    tw = text_w(label, 17) + 32
    bx = W//2 + ox - tw//2
    if ox > 0:
        bx = W//2 + 10
    else:
        bx = W//2 - 10 - tw
    rect(bx, y-4, tw, 34, bg, radius=17)
    d.rounded_rectangle([bx, y-4, bx+tw, y+30], radius=17, outline=fg, width=2)
    text(bx + tw//2, y + 13, label, 17, fg, anchor="mm")

y += 54

# ---- STEPS ----
CIRCLE_R = 22
LINE_X = PADDING + CIRCLE_R
CARD_X = PADDING + CIRCLE_R * 2 + 16

for i, s in enumerate(steps):
    color = s["color"]
    light = s["light"]
    dark_card = s.get("dark_card", False)
    card_h = card_heights[i]
    cx = LINE_X
    cy_top = y

    # connector line to next
    if i < len(steps) - 1:
        d.line([(cx, cy_top + CIRCLE_R*2), (cx, cy_top + card_h + STEP_GAP)],
               fill=color, width=4)

    # circle
    d.ellipse([cx - CIRCLE_R, cy_top, cx + CIRCLE_R, cy_top + CIRCLE_R*2],
              fill=color)
    text(cx, cy_top + CIRCLE_R, s["num"], 22,
         WHITE if dark_card or True else DARK, anchor="mm")

    # card
    card_fg = WHITE if dark_card else DARK
    card_body_fg = (200, 200, 200) if dark_card else (68, 68, 68)
    rect(CARD_X, cy_top, CARD_W - (CARD_X - PADDING), card_h, light, radius=14)
    if dark_card:
        d.rounded_rectangle([CARD_X, cy_top,
                              CARD_X + CARD_W - (CARD_X - PADDING), cy_top + card_h],
                             radius=14, outline=color, width=3)
    else:
        d.rounded_rectangle([CARD_X, cy_top,
                              CARD_X + CARD_W - (CARD_X - PADDING), cy_top + card_h],
                             radius=14, outline=LGRAY, width=1)
        # left accent bar
        d.rounded_rectangle([CARD_X, cy_top, CARD_X + 6, cy_top + card_h],
                             radius=0, fill=color)

    iy = cy_top + 16
    ix = CARD_X + 18

    # timing badge
    tw = text_w(s["timing"], 15) + 20
    badge_bg = color if dark_card else color
    badge_fg = (26, 26, 46) if not dark_card else (26, 26, 46)
    rect(ix, iy - 2, tw, 24, badge_bg, radius=12)
    text(ix + tw//2, iy + 10, s["timing"], 15, badge_fg, anchor="mm")
    iy += 30

    # title
    text(ix, iy, s["title"], 22, card_fg if dark_card else DARK)
    iy += 32

    # body
    for line in s["body"]:
        text(ix + 4, iy, line, 17, card_body_fg)
        iy += 26
    iy += 4

    # tip
    tip_bg = (255,255,255,20) if dark_card else (240, 240, 240)
    rect(ix, iy, CARD_W - (CARD_X - PADDING) - 36, 26, (230,230,230) if not dark_card else (50,50,80), radius=8)
    text(ix + 10, iy + 13, "💡 " + s["tip"], 15, (100,100,100) if not dark_card else (180,180,180), anchor="lm")
    iy += 32

    # who
    text(ix, iy, s["who"], 15, color)

    y += card_h + STEP_GAP

# ---- INCOME ----
y += 24
rect(PADDING, y, CARD_W, INCOME_H, WHITE, radius=16)
d.rounded_rectangle([PADDING, y, PADDING + CARD_W, y + INCOME_H], radius=16, outline=LGRAY, width=1)
iy = y + 24
text(PADDING + 24, iy, "📈  収益イメージ", 22, DARK)
iy += 44

bars = [
    ("〜3ヶ月", 0.20, (255, 193, 7), "月 3〜5万円"),
    ("〜6ヶ月", 0.50, (39, 174, 96), "月 10〜20万円"),
    ("1年後〜", 0.90, (34, 85, 204), "月 30〜50万円も視野"),
]
bar_area_x = PADDING + 120
bar_area_w = CARD_W - 140
for phase, ratio, bc, label in bars:
    text(PADDING + 24, iy + 16, phase, 17, GRAY, anchor="lm")
    track_x = bar_area_x
    track_w = bar_area_w
    rect(track_x, iy, track_w, 32, (240, 240, 240), radius=16)
    fill_w = int(track_w * ratio)
    rect(track_x, iy, fill_w, 32, bc, radius=16)
    text(track_x + 16, iy + 16, label, 15, WHITE, anchor="lm")
    iy += 44

# ---- FOOTER ----
y += INCOME_H + 24
text(W//2, y + 20, "知り合い不要・登録費無料・旦那さんは料理だけに集中でOK", 17, GRAY, anchor="mm")

out = "/home/user/pachino-menu/public/roadmap.png"
img.save(out, "PNG")
print("saved:", out)
