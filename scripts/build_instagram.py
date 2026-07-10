#!/usr/bin/env python3
"""Professional Instagram assets for filizlen.io — brand guide aligned."""

from __future__ import annotations

import math
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
BRAND = ROOT / "apps/marketing/public/brand"
VIDEOS = ROOT / "apps/marketing/public/videos"
FONTS = ROOT / "apps/marketing/public/fonts"
OUT = ROOT / "apps/marketing/public/instagram"
FEED = OUT / "feed"
REELS = OUT / "reels"
WORK = OUT / ".build"

# Brand tokens (marka kılavuzu)
PRIMARY = (34, 197, 94)
PRIMARY_DARK = (20, 83, 45)
ACCENT = (56, 189, 248)
SURFACE = (248, 250, 252)
MUTED = (100, 116, 139)
BG = (10, 18, 14)
BG_ELEVATED = (15, 26, 20)


def font(name: str, size: int) -> ImageFont.FreeTypeFont:
    path = FONTS / name
    return ImageFont.truetype(str(path), size)


def radial_bg(w: int, h: int, base=BG, glow=PRIMARY_DARK, strength=0.55) -> Image.Image:
    img = Image.new("RGB", (w, h), base)
    px = img.load()
    cx, cy = w // 2, int(h * 0.38)
    max_r = math.hypot(w, h) * 0.55
    for y in range(h):
        for x in range(w):
            d = math.hypot(x - cx, y - cy) / max_r
            t = max(0.0, 1.0 - d)
            t = t**1.8 * strength
            r = int(base[0] * (1 - t) + glow[0] * t)
            g = int(base[1] * (1 - t) + glow[1] * t)
            b = int(base[2] * (1 - t) + glow[2] * t)
            px[x, y] = (r, g, b)
    return img


def glass_card(
    draw: ImageDraw.ImageDraw,
    box: tuple[int, int, int, int],
    radius: int = 28,
) -> None:
    draw.rounded_rectangle(box, radius=radius, fill=(18, 48, 32))
    draw.rounded_rectangle(box, radius=radius, outline=(*PRIMARY, 180), width=2)


def center_text(
    draw: ImageDraw.ImageDraw,
    text: str,
    y: int,
    fnt: ImageFont.FreeTypeFont,
    fill: tuple[int, ...],
    w: int,
) -> int:
    bbox = draw.textbbox((0, 0), text, font=fnt)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    x = (w - tw) // 2
    draw.text((x, y), text, font=fnt, fill=fill)
    return y + th


def paste_logo(canvas: Image.Image, logo_path: Path, y: int, max_w: int = 680) -> None:
    logo = Image.open(logo_path).convert("RGBA")
    ratio = max_w / logo.width
    logo = logo.resize((max_w, int(logo.height * ratio)), Image.Resampling.LANCZOS)
    x = (canvas.width - logo.width) // 2
    canvas.paste(logo, (x, y), logo)


def extract_frame(video: Path, ss: float, size: tuple[int, int]) -> Image.Image:
    tmp = WORK / f"frame-{video.stem}-{ss}.jpg"
    WORK.mkdir(parents=True, exist_ok=True)
    subprocess.run(
        [
            "ffmpeg", "-y", "-loglevel", "error",
            "-ss", str(ss), "-i", str(video),
            "-vf", f"scale={size[0]}:{size[1]}:force_original_aspect_ratio=increase,crop={size[0]}:{size[1]}",
            "-vframes", "1", "-q:v", "2", str(tmp),
        ],
        check=True,
    )
    return Image.open(tmp).convert("RGB")


def bottom_gradient(img: Image.Image, height_frac: float = 0.55, alpha: float = 0.82) -> Image.Image:
    w, h = img.size
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    gh = int(h * height_frac)
    for i in range(gh):
        t = i / gh
        a = int(255 * alpha * t)
        draw.line([(0, h - gh + i), (w, h - gh + i)], fill=(8, 15, 12, a))
    base = img.convert("RGBA")
    return Image.alpha_composite(base, overlay).convert("RGB")


def top_glow_bar(img: Image.Image) -> Image.Image:
    w, h = img.size
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    for i in range(int(h * 0.22)):
        a = int(120 * (1 - i / (h * 0.22)))
        draw.line([(0, i), (w, i)], fill=(8, 15, 12, a))
    base = img.convert("RGBA")
    return Image.alpha_composite(base, overlay).convert("RGB")


def eyebrow(draw: ImageDraw.ImageDraw, text: str, y: int, w: int) -> int:
    fnt = font("Inter-SemiBold.ttf", 22)
    bbox = draw.textbbox((0, 0), text, font=fnt)
    tw = bbox[2] - bbox[0]
    x = (w - tw) // 2
    pad_x, pad_y = 18, 8
    box = (x - pad_x, y - pad_y, x + tw + pad_x, y + (bbox[3] - bbox[1]) + pad_y)
    draw.rounded_rectangle(box, radius=20, fill=(20, 55, 35), outline=PRIMARY, width=1)
    draw.text((x, y), text, font=fnt, fill=PRIMARY)
    return y + (bbox[3] - bbox[1]) + 28


def build_feed_marka() -> None:
    w, h = 1080, 1080
    img = radial_bg(w, h)
    draw = ImageDraw.Draw(img)

    # subtle vignette dots removed — cleaner look
    paste_logo(img, BRAND / "logo-navbar.png", y=100, max_w=420)
    draw.text((w // 2, 200), "Akıllı tarım. Güçlü yarınlar.", font=font("Inter-Medium.ttf", 26), fill=MUTED, anchor="mm")

    y = 280
    y = eyebrow(draw, "TARIM 5.0", y, w)
    y = center_text(draw, "Veriyi toprağa,", y, font("Inter-Bold.ttf", 52), SURFACE, w)
    y = center_text(draw, "değeri hasada dönüştürüyoruz.", y + 4, font("Inter-Bold.ttf", 52), SURFACE, w)

    # feature pills
    pills = ["Sensör", "Bulut", "Kontrol"]
    pill_w = 200
    gap = 24
    total = len(pills) * pill_w + (len(pills) - 1) * gap
    sx = (w - total) // 2
    py = y + 48
    for i, label in enumerate(pills):
        x0 = sx + i * (pill_w + gap)
        glass_card(draw, (x0, py, x0 + pill_w, py + 56), radius=16)
        fnt = font("Inter-SemiBold.ttf", 24)
        bbox = draw.textbbox((0, 0), label, font=fnt)
        tx = x0 + (pill_w - (bbox[2] - bbox[0])) // 2
        ty = py + (56 - (bbox[3] - bbox[1])) // 2
        draw.text((tx, ty), label, font=fnt, fill=SURFACE)

    center_text(draw, "filizlen.io", h - 90, font("Inter-SemiBold.ttf", 36), PRIMARY, w)
    img.save(FEED / "01-marka-tanitim.jpg", quality=94, optimize=True)


def build_feed_feature(
    filename: str,
    video: Path,
    ss: float,
    eyebrow_text: str,
    title: str,
    subtitle: str,
) -> None:
    w, h = 1080, 1080
    base = extract_frame(video, ss, (w, h))
    base = bottom_gradient(base, 0.62, 0.88)
    base = top_glow_bar(base)
    draw = ImageDraw.Draw(base)

    paste_logo(base, BRAND / "logo-navbar.png", y=48, max_w=280)

    y = h - 340
    y = eyebrow(draw, eyebrow_text, y, w)
    y = center_text(draw, title, y, font("Inter-Bold.ttf", 56), SURFACE, w)
    center_text(draw, subtitle, y + 12, font("Inter-Medium.ttf", 30), (203, 213, 225), w)

    base.save(FEED / filename, quality=94, optimize=True)


def build_feed_ekosistem() -> None:
    w, h = 1080, 1080
    img = radial_bg(w, h, glow=(15, 50, 30))
    draw = ImageDraw.Draw(img)

    paste_logo(img, BRAND / "logo-icon.png", y=70, max_w=120)
    center_text(draw, "filizlen.io", 210, font("Inter-Bold.ttf", 36), SURFACE, w)
    center_text(draw, "Ekosistem", 252, font("Inter-Medium.ttf", 24), MUTED, w)

    features = [
        ("Akıllı Sensörler", "Anlık saha verisi"),
        ("Veri Analizi", "Doğru karar, doğru zaman"),
        ("Kaynak Verimliliği", "Su, gübre, zaman"),
        ("Her Yerden Erişim", "Web + mobil panel"),
    ]

    card_x0, card_x1 = 80, w - 80
    y = 320
    for title, sub in features:
        glass_card(draw, (card_x0, y, card_x1, y + 110), radius=20)
        draw.text((card_x0 + 32, y + 22), title, font=font("Inter-SemiBold.ttf", 30), fill=SURFACE)
        draw.text((card_x0 + 32, y + 62), sub, font=font("Inter-Regular.ttf", 24), fill=MUTED)
        y += 130

    # CTA button
    btn_y = h - 130
    btn_h = 64
    btn_w = 420
    bx0 = (w - btn_w) // 2
    draw.rounded_rectangle((bx0, btn_y, bx0 + btn_w, btn_y + btn_h), radius=32, fill=PRIMARY)
    cta = "filizlen.io/iletisim"
    fnt = font("Inter-Bold.ttf", 26)
    bbox = draw.textbbox((0, 0), cta, font=fnt)
    tx = bx0 + (btn_w - (bbox[2] - bbox[0])) // 2
    ty = btn_y + (btn_h - (bbox[3] - bbox[1])) // 2
    draw.text((tx, ty), cta, font=fnt, fill=PRIMARY_DARK)

    img.save(FEED / "04-ekosistem.jpg", quality=94, optimize=True)


def build_reel_slide(
    filename: str,
    *,
    title: str,
    subtitle: str | None = None,
    bg_video: Path | None = None,
    ss: float = 0,
    show_logo: bool = True,
    solid: bool = False,
) -> Path:
    w, h = 1080, 1920
    if solid or bg_video is None:
        img = radial_bg(w, h)
    else:
        img = extract_frame(bg_video, ss, (1080, 1920))
        img = bottom_gradient(img, 0.5, 0.9)
        img = top_glow_bar(img)

    draw = ImageDraw.Draw(img)
    if show_logo:
        paste_logo(img, BRAND / "logo-navbar.png", y=100, max_w=320)

    y = int(h * 0.62) if bg_video else int(h * 0.42)
    if subtitle is None and not solid:
        y = eyebrow(draw, "filizlen.io", y - 60, w)
    y = center_text(draw, title, y, font("Inter-Bold.ttf", 64), SURFACE, w)
    if subtitle:
        center_text(draw, subtitle, y + 16, font("Inter-Medium.ttf", 34), (220, 230, 240), w)

    out = WORK / filename
    WORK.mkdir(parents=True, exist_ok=True)
    img.save(out, quality=95)
    return out


def build_reel() -> None:
    WORK.mkdir(parents=True, exist_ok=True)
    REELS.mkdir(parents=True, exist_ok=True)

    slides = [
        ("slide-intro.png", dict(
            title="Akıllı tarım.",
            subtitle="Güçlü yarınlar.",
            solid=True,
        )),
        ("slide-wheat.png", dict(
            title="Sahadan canlı veri",
            subtitle="Nem, sıcaklık, sulama — tek ekranda",
            bg_video=VIDEOS / "wheat-drone.mp4", ss=2,
        )),
        ("slide-corn.png", dict(
            title="Akıllı sulama",
            subtitle="Otomatik vana kontrolü",
            bg_video=VIDEOS / "corn-sensor-loop.mp4", ss=5,
        )),
        ("slide-sunflower.png", dict(
            title="Kaynak verimliliği",
            subtitle="Su ve enerji tasarrufu",
            bg_video=VIDEOS / "sunflower-drone.mp4", ss=4,
        )),
        ("slide-cta.png", dict(
            title="Sensör → Bulut → Kontrol",
            subtitle="filizlen.io/iletisim",
            solid=True, show_logo=True,
        )),
    ]

    durations = [3.5, 7, 7, 7, 5]
    parts: list[Path] = []

    for (fname, kwargs), dur in zip(slides, durations):
        slide = build_reel_slide(fname, **kwargs)
        part = WORK / f"part-{fname.replace('.png', '.mp4')}"
        # Ken Burns zoom on still slides
        vf = (
            f"scale=1080:1920:force_original_aspect_ratio=increase,"
            f"crop=1080:1920,"
            f"zoompan=z='min(zoom+0.0008,1.08)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':"
            f"d={int(dur * 30)}:s=1080x1920:fps=30"
        )
        subprocess.run(
            [
                "ffmpeg", "-y", "-loglevel", "error",
                "-loop", "1", "-i", str(slide),
                "-vf", vf,
                "-t", str(dur),
                "-c:v", "libx264", "-pix_fmt", "yuv420p",
                str(part),
            ],
            check=True,
        )
        parts.append(part)

    concat = WORK / "reel-parts.txt"
    concat.write_text("\n".join(f"file '{p.name}'" for p in parts))

    video_only = WORK / "reel-video.mp4"
    subprocess.run(
        [
            "ffmpeg", "-y", "-loglevel", "error",
            "-f", "concat", "-safe", "0", "-i", str(concat),
            "-c:v", "libx264", "-pix_fmt", "yuv420p",
            str(video_only),
        ],
        check=True,
        cwd=WORK,
    )

    total_dur = sum(durations)
    audio = WORK / "reel-audio.aac"
    subprocess.run(
        [
            "ffmpeg", "-y", "-loglevel", "error",
            "-ss", "18", "-t", str(total_dur),
            "-i", str(VIDEOS / "filizlen-drive.mp3"),
            "-af", f"afade=t=in:st=0:d=2,afade=t=out:st={total_dur - 2.5}:d=2.5,volume=0.75",
            "-c:a", "aac", "-b:a", "192k",
            str(audio),
        ],
        check=True,
    )

    subprocess.run(
        [
            "ffmpeg", "-y", "-loglevel", "error",
            "-i", str(video_only), "-i", str(audio),
            "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
            "-shortest", "-movflags", "+faststart",
            str(REELS / "filizlen-reel.mp4"),
        ],
        check=True,
    )


def main() -> None:
    FEED.mkdir(parents=True, exist_ok=True)
    REELS.mkdir(parents=True, exist_ok=True)
    print("→ Feed görselleri...")
    build_feed_marka()
    build_feed_feature(
        "02-saha-veri.jpg",
        VIDEOS / "wheat-drone.mp4", 2,
        "CANLI İZLEME", "Sahadan canlı veri",
        "Tarladaki sinyal, anında panelinizde",
    )
    build_feed_feature(
        "03-akilli-sulama.jpg",
        VIDEOS / "corn-sensor-loop.mp4", 5,
        "OTOMATİK KONTROL", "Akıllı sulama",
        "Vana komutları milisaniyeler içinde sahaya",
    )
    build_feed_ekosistem()
    print("→ Reels videosu...")
    build_reel()
    print(f"\n✓ Hazır: {OUT}")


if __name__ == "__main__":
    main()
