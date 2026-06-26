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
y = 60
text(W//2, y, "資金計画 整理シート", 46, DARK, anchor="mm")
y += 50
text(W//2, y, "リスケ相談・借入の優先順位 確認用", 24, (192, 57, 43), anchor="mm")
y += 50

# ===== 今の資金繰り =====
box_h = 150
rect(PAD, y, W-PAD*2, box_h, WHITE, radius=20, outline=(220,210,195), width=2)
col_w = (W - PAD*2) // 3
labels = [("月の売上", "約 85万円", DARK), ("損益分岐点", "約 110万円", DARK), ("月間収支", "約 −25万円", (192,57,43))]
for i, (lab, val, col) in enumerate(labels):
    cx = PAD + col_w*i + col_w//2
    text(cx, y+44, lab, 22, GRAY, anchor="mm")
    text(cx, y+95, val, 36, col, anchor="mm")
    if i < 2:
        d.line([(PAD+col_w*(i+1), y+20), (PAD+col_w*(i+1), y+box_h-20)], fill=LGRAY, width=2)
y += box_h + 50

# ===== 借入一覧 =====
text(PAD, y, "借入一覧と返済の優先順位", 32, DARK)
y += 56

loans = [
    {"name": "クレジットカード キャッシング", "amount": "47万円", "note": "利息 9.6%", "tag": "最優先で返済", "color": (192,57,43), "light": (253,232,232)},
    {"name": "南日本銀行（保証協会付）", "amount": "220万円", "note": "保証料返戻の可能性あり", "tag": "2番目：借換を相談（公庫とも比較）", "color": (230,126,34), "light": (255,240,232)},
    {"name": "別の銀行", "amount": "394万円", "note": "保証付きか要確認", "tag": "確認中", "color": (155,89,182), "light": (243,232,253)},
    {"name": "日本政策金融公庫", "amount": "284万円", "note": "融資区分（国民生活/中小企業事業）要確認", "tag": "繰上返済の可否を確認", "color": (66,133,244), "light": (232,240,254)},
]

for loan in loans:
    row_h = 110
    rect(PAD, y, W-PAD*2, row_h, WHITE, radius=16, outline=(225,220,210), width=2)
    rect(PAD, y, 10, row_h, loan["color"], radius=0)
    ix = PAD + 36
    text(ix, y+22, loan["name"], 26, DARK)
    text(ix, y+62, loan["note"], 20, GRAY)
    text(W-PAD-36, y+22, loan["amount"], 30, DARK, anchor="ra")
    tagw = text_w(loan["tag"], 19) + 28
    rect(W-PAD-36-tagw, y+58, tagw, 34, loan["light"], radius=17, outline=loan["color"], width=2)
    text(W-PAD-36-tagw//2, y+75, loan["tag"], 19, loan["color"], anchor="mm")
    y += row_h + 16

y += 24

# ===== 相談先は2つ：同じ内容で比較 =====
text(PAD, y, "相談先は2つ：同じ内容で比較する", 32, DARK)
y += 46
text(PAD, y, "「南日本銀行220万円の借換」＋「設備250万円の新規」を、両方に同じ内容で相談する", 21, GRAY)
y += 44

box_h = 170
gap = 30
box_w = (W - PAD*2 - gap) // 2
candidates = [
    {"name": "鹿児島相互信用金庫", "point": "地域密着・今後も継続的に相談しやすい", "color": (39,174,96), "light": (232,253,240)},
    {"name": "日本政策金融公庫", "point": "既存取引あり（284万円）／政府系で低金利・無担保が多い", "color": (66,133,244), "light": (232,240,254)},
]
for i, c in enumerate(candidates):
    bx = PAD + i*(box_w+gap)
    rect(bx, y, box_w, box_h, c["light"], radius=20, outline=c["color"], width=3)
    rect(bx, y, 10, box_h, c["color"], radius=0)
    text(bx+36, y+30, c["name"], 27, DARK)
    text(bx+36, y+76, "南日本銀行220万 借換　＋　設備250万 新規", 19, c["color"])
    text(bx+36, y+118, c["point"], 18, GRAY)
y += box_h + 50

# ===== 新規設備投資メモ =====
text(PAD, y, "新規設備投資（ドレッシング製造）メモ", 32, DARK)
y += 50
box_h = 200
rect(PAD, y, W-PAD*2, box_h, (255,250,240), radius=20, outline=(230,126,34), width=3)
rect(PAD, y, 10, box_h, (230,126,34), radius=0)
ix = PAD + 40
iy = y + 26
lines = [
    "総事業費 200万円（機械・工事費のみ）／補助金 2/3＝約133万円（後払い・精算払い）",
    "瓶・ラベル・成分表示・初回仕入れ等の「隠れ初期費用」 約50万円が別途必要",
    "推奨借入額：250万円（7年返済・月5万円） ※名指しできない上乗せはしない",
    "★最重要：補助金133万円が入金されたら、即・借入の繰上返済に回す",
]
for line in lines:
    text(ix, iy, line, 23, DARK)
    iy += 42
y += box_h + 50

# ===== 今すぐやることリスト =====
text(PAD, y, "今すぐやること（優先順位）", 32, DARK)
y += 50

steps = [
    "南日本銀行220万の借換＋設備250万の新規を、信用金庫と公庫の両方に同じ内容で相談し、条件を比較する",
    "日本政策金融公庫の既存融資284万円の区分（国民生活事業／中小企業事業）を確認する",
    "リスケ（返済条件の見直し）の相談を始める ← 毎月の出血を止める最優先事項",
    "クレジットカードのキャッシング47万円を優先的に返済する",
    "新規設備融資は250万円で確定し、補助金到着後に即・繰上返済する",
]

circle_r = 24
for i, s in enumerate(steps):
    cy = y
    d.ellipse([PAD, cy, PAD+circle_r*2, cy+circle_r*2], fill=(66,133,244))
    text(PAD+circle_r, cy+circle_r, str(i+1), 24, WHITE, anchor="mm")
    text(PAD+circle_r*2+24, cy+circle_r, s, 23, DARK, anchor="lm")
    y += circle_r*2 + 22

y += 20

# ===== 銀行・公庫に聞くことチェックリスト =====
box_h = 268
rect(PAD, y, W-PAD*2, box_h, WHITE, radius=20, outline=(39,174,96), width=3)
rect(PAD, y, 10, box_h, (39,174,96), radius=0)
ix = PAD + 40
iy = y + 26
text(ix, iy, "相談時に聞くこと チェックリスト", 26, (39,174,96))
iy += 44
questions = [
    "□ 今の金利と保証料率は何%ですか？",
    "□ 繰上完済した場合、保証料の返戻金はいくらになりますか？",
    "□ 他行の借入をまとめて借換できる制度（伴走支援型特別保証など）はありますか？",
    "□ 返済条件の見直し（リスケ）は可能ですか？",
    "□ この融資は国民生活事業・中小企業事業のどちらですか？（公庫のみ）",
]
for q in questions:
    text(ix, iy, q, 22, DARK)
    iy += 38
y += box_h + 40

final_h = y
img = img.crop((0, 0, W, final_h))
out = "/home/user/pachino-menu/public/debt-priority.png"
img.save(out, "PNG")
print("saved:", out, "height:", final_h)
