from PIL import Image
import os

src = "/home/sezer/.cursor/projects/home-sezer-projects-filizlenio/assets/image-482536de-526e-4ecf-8815-000732d88c0a.png"
out = "/home/sezer/projects/filizlenio/public/brand"
app_icon = "/home/sezer/projects/filizlenio/src/app/icon.png"

img = Image.open(src).convert("RGBA")
w, h = img.size
print("source", w, h)


def key_transparent(im):
    data = list(im.getdata())
    new = []
    for r, g, b, a in data:
        if r > 238 and g > 238 and b > 238:
            new.append((0, 0, 0, 0))
        elif abs(r - g) < 14 and abs(g - b) < 14 and r > 195:
            new.append((0, 0, 0, 0))
        else:
            new.append((r, g, b, a))
    im.putdata(new)
    return im


img = key_transparent(img)
bbox = img.getbbox()
if bbox:
    img = img.crop(bbox)
print("cropped", img.size)

img.save(f"{out}/logo.png", optimize=True)

nav = img.copy()
nav_pixels = []
for r, g, b, a in nav.getdata():
    if a < 10:
        nav_pixels.append((r, g, b, a))
        continue
    lum = 0.299 * r + 0.587 * g + 0.114 * b
    if lum < 88 and g >= r * 0.75 and b <= g * 1.05:
        nav_pixels.append((248, 250, 252, a))
    else:
        nav_pixels.append((r, g, b, a))
nav.putdata(nav_pixels)
nav.save(f"{out}/logo-navbar.png", optimize=True)

iw, ih = img.size
icon_box = img.crop((0, 0, max(int(iw * 0.24), 1), ih))
icon_sq = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
scale = min(128 / icon_box.width, 128 / icon_box.height)
nw, nh = int(icon_box.width * scale), int(icon_box.height * scale)
icon_resized = icon_box.resize((nw, nh), Image.Resampling.LANCZOS)
ox, oy = (128 - nw) // 2, (128 - nh) // 2
icon_sq.paste(icon_resized, (ox, oy), icon_resized)
icon_sq.save(f"{out}/logo-icon.png", optimize=True)
icon_sq.save(app_icon, optimize=True)

print("logo.png", os.path.getsize(f"{out}/logo.png"), "icon", os.path.getsize(app_icon))
