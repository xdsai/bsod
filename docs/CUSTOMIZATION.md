# Customization Guide

## Changing Colors

The BSOD color scheme is defined in `src/styles/bsod.css`:

```css
:root {
  --bsod-blue: #0000AA;    /* Background */
  --bsod-text: #FFFFFF;    /* Text */
  --bsod-gray: #AAAAAA;    /* Secondary text */
}
```

## Adjusting CRT Effects

### Scanline Intensity

In `src/styles/crt-effects.css`, adjust opacity:

```css
:root {
  --scanline-opacity: 0.15;  /* Lower = less visible */
}
```

### Disable Flicker

Remove or comment out the `::after` pseudo-element in `.crt::after`.

### Disable Glow

Remove the `.glow` class from text elements or delete its styles.

## Boot Sequence

Edit `src/components/BootSequence.astro`:

- **Change timing**: Adjust `data-delay` attributes (in milliseconds)
- **Add/remove lines**: Add more `<div class="boot-line">` elements
- **Speed up**: Reduce delay values
- **Skip by default**: Set shorter `totalDuration`

## Menu Items

To add/remove menu sections:

1. Edit `src/components/BSODMenu.astro` menu structure
2. Create corresponding modal component
3. Import and include in `src/pages/index.astro`

## Typography

Replace fonts in `public/fonts/` and update `src/styles/fonts.css`.

For non-pixelated fonts, remove:
```css
image-rendering: pixelated;
-webkit-font-smoothing: none;
```

## Mobile Optimization

Mobile breakpoints are at 768px. Adjust in individual CSS files:

```css
@media (max-width: 768px) {
  /* Your mobile styles */
}
```

## Reading Mode Colors

Edit reading mode in `src/styles/blog-post.css`:

```css
body.reading-mode {
  background: #1a1a2e;  /* Change this */
}
```

## Disable Effects for Performance

For lower-end devices, you can disable:

1. **Scanlines**: Remove `.crt::before`
2. **Flicker**: Remove `.crt::after`
3. **Glitch animations**: Remove `.glitch-active` class usage
4. **Screen shake**: Remove `.screen-shake` class usage
