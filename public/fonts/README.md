# Pixel Fonts for BSOD Portfolio

This directory should contain authentic pixel fonts for the BSOD aesthetic.

## Required Fonts

### 1. PxPlus IBM VGA8 (or Perfect DOS VGA 437)
- **Purpose**: Main BSOD text font (authentic Windows BSOD font)
- **Source**: https://int10h.org/oldschool-pc-fonts/
- **Download**: Get the "PxPlus IBM VGA8" font
- **Format**: Convert to WOFF2 for web use
- **File**: `PxPlus_IBM_VGA8.woff2`

### 2. Fixedsys Excelsior
- **Purpose**: Boot sequence and terminal text
- **Source**: https://github.com/kika/fixedsys
- **Format**: Convert to WOFF2 for web use
- **File**: `Fixedsys.woff2`

## Font Conversion

To convert TTF/OTF fonts to WOFF2:

### Online Tools
- https://cloudconvert.com/ttf-to-woff2
- https://everythingfonts.com/ttf-to-woff2

### Command Line (fonttools)
```bash
pip install fonttools brotli
pyftsubset font.ttf --output-file=font.woff2 --flavor=woff2
```

## Alternative: Using Web Fonts

If you prefer not to download fonts, the CSS file is configured to fall back to:
- `Courier New` (monospace system font)
- Generic `monospace` font

These provide a similar retro aesthetic without requiring font downloads.

## Current Status

**PLACEHOLDER MODE**: The fonts.css file is currently set up with fallback fonts only.
To get the authentic BSOD look, please:

1. Download the fonts from the sources above
2. Convert them to WOFF2 format
3. Place the WOFF2 files in this directory
4. The CSS will automatically use them (already configured)
