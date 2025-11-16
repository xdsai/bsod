# Fonts for BSOD Portfolio

This directory contains font files for the authentic BSOD aesthetic.

## Required Font: Lucida BSOD

**Lucida BSOD** is an authentic Windows BSOD-style bitmap font that provides the perfect retro aesthetic for this portfolio.

### Download Instructions

The Lucida BSOD font must be manually downloaded from FontStruct:

1. **Visit FontStruct**: Go to https://fontstruct.com/fontstructions/show/2322862/lucida-bsod
2. **Download the font**: Click the "Download" button on the page
3. **Save the TTF file**: Save the downloaded TTF file as `lucida-bsod.ttf`
4. **Place in this directory**: Move `lucida-bsod.ttf` to `/public/fonts/` (this directory)

### Current Status

**PLACEHOLDER MODE**: The site is currently using VT323 from Google Fonts as a fallback.

- ✅ VT323 provides a good pixelated retro aesthetic
- ⚠️ For the most authentic BSOD look, download Lucida BSOD from the link above
- 📁 Once downloaded, the site will automatically use Lucida BSOD instead of VT323

### Fallback Behavior

The CSS is configured with a smart fallback system:
1. **Lucida BSOD** (if downloaded and placed in this directory)
2. **VT323** (loaded from Google Fonts as backup)
3. **monospace** (system fallback)

This ensures the site always works, even without the custom font.

## Alternative Fonts

If you prefer a different retro aesthetic, you could also try:

### PxPlus IBM VGA8
- **Source**: https://int10h.org/oldschool-pc-fonts/
- Authentic DOS/Windows font

### Fixedsys Excelsior
- **Source**: https://github.com/kika/fixedsys
- Classic Windows 9x font

## Font Conversion

If you need to convert fonts to web formats (WOFF2 for better compression):

### Online Tools
- https://cloudconvert.com/ttf-to-woff2
- https://everythingfonts.com/ttf-to-woff2

### Command Line
```bash
pip install fonttools brotli
pyftsubset font.ttf --output-file=font.woff2 --flavor=woff2
```
