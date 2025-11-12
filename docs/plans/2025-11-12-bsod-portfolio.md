# BSOD Portfolio Website Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a retro BSOD-themed portfolio website with Linux boot sequence intro, CRT effects, keyboard/mouse navigation, and markdown blog.

**Architecture:** Astro static site with content collections for blog posts, vanilla JS for interactive menu/modals, CSS-based CRT effects and animations. Boot sequence transitions into authentic Windows BSOD-styled main menu.

**Tech Stack:** Astro 4.x, TypeScript, CSS3 (animations/effects), Markdown with frontmatter

---

## Task 1: Project Initialization

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`

**Step 1: Initialize Astro project**

Run:
```bash
npm create astro@latest . -- --template minimal --typescript strict --no-install
```

Expected: Astro project scaffolding created

**Step 2: Install dependencies**

Run:
```bash
npm install
```

Expected: Dependencies installed successfully

**Step 3: Configure Astro for content collections**

Edit `astro.config.mjs`:
```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  build: {
    inlineStylesheets: 'auto'
  }
});
```

**Step 4: Verify dev server runs**

Run:
```bash
npm run dev
```

Expected: Dev server starts on localhost:4321

**Step 5: Commit**

```bash
git add .
git commit -m "feat: initialize Astro project with TypeScript"
```

---

## Task 2: Add Pixel Fonts

**Files:**
- Create: `public/fonts/PxPlus_IBM_VGA8.woff2`
- Create: `public/fonts/Fixedsys.woff2`
- Create: `src/styles/fonts.css`

**Step 1: Download authentic pixel fonts**

These fonts need to be acquired:
- **Perfect DOS VGA 437** or **PxPlus IBM VGA8** (authentic BSOD font)
- **Fixedsys Excelsior** (classic Windows terminal font)

Download from:
- https://int10h.org/oldschool-pc-fonts/ (IBM VGA fonts)
- https://github.com/kika/fixedsys (Fixedsys)

Convert to WOFF2 format for web use.

Place in: `public/fonts/`

**Step 2: Create font-face declarations**

Create `src/styles/fonts.css`:
```css
@font-face {
  font-family: 'VGA';
  src: url('/fonts/PxPlus_IBM_VGA8.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: block;
}

@font-face {
  font-family: 'Fixedsys';
  src: url('/fonts/Fixedsys.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: block;
}
```

**Step 3: Commit**

```bash
git add public/fonts/ src/styles/fonts.css
git commit -m "feat: add authentic pixel fonts for BSOD aesthetic"
```

---

## Task 3: Base BSOD Styles

**Files:**
- Create: `src/styles/bsod.css`
- Create: `src/styles/crt-effects.css`

**Step 1: Create core BSOD styling**

Create `src/styles/bsod.css`:
```css
:root {
  /* Authentic Windows BSOD colors */
  --bsod-blue: #0000AA;
  --bsod-text: #FFFFFF;
  --bsod-gray: #AAAAAA;

  /* CRT effects */
  --scanline-opacity: 0.15;
  --flicker-opacity: 0.03;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

body {
  background: var(--bsod-blue);
  color: var(--bsod-text);
  font-family: 'VGA', monospace;
  font-size: 16px;
  line-height: 1.2;
  image-rendering: pixelated;
  image-rendering: crisp-edges;
  -webkit-font-smoothing: none;
  -moz-osx-font-smoothing: grayscale;
}

/* Disable smooth scrolling for authentic feel */
* {
  scroll-behavior: auto !important;
}

/* Selection styling */
::selection {
  background: var(--bsod-text);
  color: var(--bsod-blue);
}

/* Pixel-perfect text rendering */
.bsod-text {
  text-rendering: optimizeSpeed;
  letter-spacing: 0;
}
```

**Step 2: Create CRT effects**

Create `src/styles/crt-effects.css`:
```css
/* CRT Screen Container */
.crt {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* Scanlines effect */
.crt::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.15) 0px,
    rgba(0, 0, 0, 0.15) 1px,
    transparent 1px,
    transparent 2px
  );
  z-index: 1000;
  animation: scanline 8s linear infinite;
}

@keyframes scanline {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(2px);
  }
}

/* Screen flicker */
.crt::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  background: rgba(255, 255, 255, var(--flicker-opacity));
  opacity: 0;
  z-index: 999;
  animation: flicker 0.15s infinite;
}

@keyframes flicker {
  0% {
    opacity: 0.27861;
  }
  5% {
    opacity: 0.34769;
  }
  10% {
    opacity: 0.23604;
  }
  15% {
    opacity: 0.90626;
  }
  20% {
    opacity: 0.18128;
  }
  25% {
    opacity: 0.83891;
  }
  30% {
    opacity: 0.65583;
  }
  35% {
    opacity: 0.67807;
  }
  40% {
    opacity: 0.26559;
  }
  45% {
    opacity: 0.84693;
  }
  50% {
    opacity: 0.96019;
  }
  55% {
    opacity: 0.08594;
  }
  60% {
    opacity: 0.20313;
  }
  65% {
    opacity: 0.71988;
  }
  70% {
    opacity: 0.53455;
  }
  75% {
    opacity: 0.37288;
  }
  80% {
    opacity: 0.71428;
  }
  85% {
    opacity: 0.70419;
  }
  90% {
    opacity: 0.7003;
  }
  95% {
    opacity: 0.36108;
  }
  100% {
    opacity: 0.24387;
  }
}

/* Phosphor glow on text */
.glow {
  text-shadow:
    0 0 2px rgba(255, 255, 255, 0.8),
    0 0 4px rgba(255, 255, 255, 0.6),
    0 0 8px rgba(170, 170, 255, 0.4);
}

/* Screen curvature (subtle) */
.crt-screen {
  position: relative;
  width: 100%;
  height: 100%;
  transform: perspective(1000px) rotateX(0deg);
  filter: contrast(1.1) brightness(1.05);
}

/* Glitch effect (for transitions) */
@keyframes glitch {
  0% {
    transform: translate(0);
  }
  20% {
    transform: translate(-2px, 2px);
  }
  40% {
    transform: translate(-2px, -2px);
  }
  60% {
    transform: translate(2px, 2px);
  }
  80% {
    transform: translate(2px, -2px);
  }
  100% {
    transform: translate(0);
  }
}

.glitch-active {
  animation: glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

/* Screen shake (for crash effect) */
@keyframes screen-shake {
  0%, 100% {
    transform: translate(0, 0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translate(-4px, 2px);
  }
  20%, 40%, 60%, 80% {
    transform: translate(4px, -2px);
  }
}

.screen-shake {
  animation: screen-shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}
```

**Step 3: Commit**

```bash
git add src/styles/
git commit -m "feat: add BSOD base styles and CRT effects"
```

---

## Task 4: Boot Sequence Component

**Files:**
- Create: `src/components/BootSequence.astro`
- Create: `src/components/BootSequence.client.ts`

**Step 1: Create boot sequence HTML structure**

Create `src/components/BootSequence.astro`:
```astro
---
---

<div id="boot-sequence" class="boot-container">
  <div class="boot-content">
    <div class="boot-line" data-delay="0">Linux version 5.15.0-generic</div>
    <div class="boot-line" data-delay="100">Command line: BOOT_IMAGE=/boot/vmlinuz root=/dev/sda1</div>
    <div class="boot-line" data-delay="200">Kernel command line: quiet splash</div>
    <div class="boot-line" data-delay="400">Memory: 16384MB RAM</div>
    <div class="boot-line" data-delay="600">CPU: 8 x 3.6GHz</div>
    <div class="boot-line" data-delay="800">[  OK  ] Started System Logging Service</div>
    <div class="boot-line" data-delay="1000">[  OK  ] Started Network Manager</div>
    <div class="boot-line" data-delay="1200">[  OK  ] Started User Manager</div>
    <div class="boot-line" data-delay="1400">[  OK  ] Reached target Multi-User System</div>
    <div class="boot-line" data-delay="1800">[  OK  ] Started GNOME Display Manager</div>
    <div class="boot-line error" data-delay="2200">[FAILED] Failed to start Portfolio Service</div>
    <div class="boot-line error" data-delay="2400">[FAILED] Critical system error detected</div>
    <div class="boot-line error" data-delay="2600">[FAILED] Kernel panic - unable to continue</div>
    <div class="boot-line error" data-delay="2800">Entering emergency mode...</div>
  </div>
</div>

<style>
  .boot-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #000;
    color: #0f0;
    font-family: 'Fixedsys', monospace;
    font-size: 14px;
    padding: 20px;
    overflow: hidden;
    z-index: 10000;
  }

  .boot-content {
    max-width: 100%;
  }

  .boot-line {
    opacity: 0;
    margin: 4px 0;
    white-space: pre-wrap;
    word-break: break-all;
  }

  .boot-line.visible {
    opacity: 1;
    animation: boot-appear 0.05s ease-out;
  }

  .boot-line.error {
    color: #ff3333;
    font-weight: bold;
  }

  @keyframes boot-appear {
    from {
      opacity: 0;
      transform: translateX(-2px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .boot-container.fade-out {
    animation: fade-to-blue 0.5s ease-out forwards;
  }

  @keyframes fade-to-blue {
    0% {
      background: #000;
      opacity: 1;
    }
    50% {
      opacity: 1;
    }
    100% {
      background: #0000AA;
      opacity: 0;
    }
  }
</style>

<script>
  const bootSequence = document.getElementById('boot-sequence');
  const bootLines = document.querySelectorAll('.boot-line');

  // Show boot lines sequentially
  bootLines.forEach((line) => {
    const delay = parseInt(line.getAttribute('data-delay') || '0');
    setTimeout(() => {
      line.classList.add('visible');
    }, delay);
  });

  // After all lines shown, trigger crash and transition
  const totalDuration = 2800 + 500; // Last line delay + extra wait
  setTimeout(() => {
    // Screen shake effect
    bootSequence.classList.add('screen-shake');

    setTimeout(() => {
      // Fade out and show BSOD
      bootSequence.classList.add('fade-out');

      setTimeout(() => {
        bootSequence.style.display = 'none';
        // Dispatch event to show BSOD menu
        window.dispatchEvent(new CustomEvent('boot-complete'));
      }, 500);
    }, 500);
  }, totalDuration);
</script>
```

**Step 2: Commit**

```bash
git add src/components/BootSequence.astro
git commit -m "feat: add Linux boot sequence with gradual corruption"
```

---

## Task 5: BSOD Menu Component

**Files:**
- Create: `src/components/BSODMenu.astro`
- Create: `src/scripts/menu.ts`

**Step 1: Create BSOD menu HTML structure**

Create `src/components/BSODMenu.astro`:
```astro
---
---

<div id="bsod-menu" class="bsod-screen" style="display: none;">
  <div class="crt">
    <div class="crt-screen">
      <div class="bsod-content">
        <div class="bsod-header">
          <p class="glow">A fatal exception has occurred at 0x00000000:00000000</p>
          <p>The current application will be terminated.</p>
        </div>

        <div class="bsod-separator">
          ************************************************************
        </div>

        <nav class="menu" role="navigation" aria-label="Main menu">
          <div class="menu-item" data-target="about" tabindex="0">
            <span class="menu-arrow">►</span> ABOUT
          </div>
          <div class="menu-item" data-target="skills" tabindex="0">
            <span class="menu-arrow">►</span> SKILLS
          </div>
          <div class="menu-item" data-target="blog" tabindex="0">
            <span class="menu-arrow">►</span> BLOG
          </div>
          <div class="menu-item" data-target="contact" tabindex="0">
            <span class="menu-arrow">►</span> CONTACT
          </div>
        </nav>

        <div class="bsod-separator">
          ************************************************************
        </div>

        <div class="bsod-footer">
          <p>Press any menu option to continue _</p>
          <p class="help-text">Use ↑↓ arrows or click to navigate • ENTER to select • ESC to close</p>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .bsod-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--bsod-blue);
    z-index: 100;
    opacity: 0;
    animation: fade-in 0.3s ease-out forwards;
  }

  @keyframes fade-in {
    to {
      opacity: 1;
    }
  }

  .bsod-content {
    padding: 40px;
    max-width: 900px;
    margin: 0 auto;
  }

  .bsod-header {
    margin-bottom: 30px;
  }

  .bsod-header p {
    margin: 8px 0;
  }

  .bsod-separator {
    margin: 20px 0;
    color: var(--bsod-gray);
  }

  .menu {
    margin: 30px 0;
  }

  .menu-item {
    padding: 8px 20px;
    margin: 4px 0;
    cursor: pointer;
    position: relative;
    outline: none;
  }

  .menu-item:hover,
  .menu-item:focus,
  .menu-item.selected {
    background: var(--bsod-text);
    color: var(--bsod-blue);
  }

  .menu-arrow {
    display: inline-block;
    width: 20px;
  }

  .menu-item:not(.selected) .menu-arrow {
    opacity: 0;
  }

  .menu-item.selected .menu-arrow {
    opacity: 1;
  }

  .bsod-footer {
    margin-top: 30px;
  }

  .bsod-footer p {
    margin: 4px 0;
  }

  .help-text {
    color: var(--bsod-gray);
    font-size: 14px;
    margin-top: 16px;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .bsod-content {
      padding: 20px;
      font-size: 14px;
    }

    .menu-item {
      padding: 12px 16px;
      touch-action: manipulation;
    }
  }
</style>

<script src="../scripts/menu.ts"></script>
```

**Step 2: Create menu interaction logic**

Create `src/scripts/menu.ts`:
```typescript
// Menu navigation state
let selectedIndex = 0;
const menuItems = Array.from(document.querySelectorAll('.menu-item'));

// Initialize menu when boot completes
window.addEventListener('boot-complete', () => {
  const menu = document.getElementById('bsod-menu');
  if (menu) {
    menu.style.display = 'block';
    selectMenuItem(0);
  }
});

// Select menu item by index
function selectMenuItem(index: number) {
  menuItems.forEach((item, i) => {
    if (i === index) {
      item.classList.add('selected');
      (item as HTMLElement).focus();
    } else {
      item.classList.remove('selected');
    }
  });
  selectedIndex = index;
}

// Navigate menu with arrow keys
document.addEventListener('keydown', (e) => {
  // Only handle if no modal is open
  if (document.querySelector('.modal.active')) return;

  switch (e.key) {
    case 'ArrowUp':
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + menuItems.length) % menuItems.length;
      selectMenuItem(selectedIndex);
      break;
    case 'ArrowDown':
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % menuItems.length;
      selectMenuItem(selectedIndex);
      break;
    case 'Enter':
      e.preventDefault();
      openModal(menuItems[selectedIndex].getAttribute('data-target') || '');
      break;
  }
});

// Click to select and open
menuItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    selectMenuItem(index);
    openModal(item.getAttribute('data-target') || '');
  });
});

// Open modal based on target
function openModal(target: string) {
  const event = new CustomEvent('open-modal', { detail: { target } });
  window.dispatchEvent(event);
}
```

**Step 3: Commit**

```bash
git add src/components/BSODMenu.astro src/scripts/menu.ts
git commit -m "feat: add BSOD menu with keyboard and mouse navigation"
```

---

## Task 6: Modal Component System

**Files:**
- Create: `src/components/Modal.astro`
- Create: `src/scripts/modal.ts`

**Step 1: Create reusable modal component**

Create `src/components/Modal.astro`:
```astro
---
interface Props {
  id: string;
  title: string;
}

const { id, title } = Astro.props;
---

<div class="modal" id={`modal-${id}`} role="dialog" aria-modal="true" aria-labelledby={`modal-title-${id}`}>
  <div class="modal-backdrop"></div>
  <div class="modal-window">
    <div class="modal-titlebar">
      <div class="modal-title" id={`modal-title-${id}`}>{title}</div>
      <button class="modal-close" aria-label="Close modal">×</button>
    </div>
    <div class="modal-content">
      <slot />
    </div>
    <div class="modal-footer">
      <p class="modal-hint">Press ESC to close</p>
    </div>
  </div>
</div>

<style>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    display: none;
    align-items: center;
    justify-content: center;
  }

  .modal.active {
    display: flex;
  }

  .modal-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
  }

  .modal-window {
    position: relative;
    background: var(--bsod-blue);
    border: 3px solid var(--bsod-text);
    box-shadow:
      0 0 0 1px #000,
      4px 4px 0 0 rgba(0, 0, 0, 0.5);
    max-width: 90%;
    max-height: 85%;
    width: 700px;
    display: flex;
    flex-direction: column;
    animation: modal-appear 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  @keyframes modal-appear {
    from {
      transform: scale(0.8);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  .modal-titlebar {
    background: var(--bsod-text);
    color: var(--bsod-blue);
    padding: 8px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid var(--bsod-blue);
  }

  .modal-title {
    font-weight: bold;
    font-size: 18px;
  }

  .modal-close {
    background: none;
    border: none;
    color: var(--bsod-blue);
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    line-height: 1;
    font-family: 'VGA', monospace;
  }

  .modal-close:hover {
    background: var(--bsod-blue);
    color: var(--bsod-text);
  }

  .modal-content {
    padding: 30px;
    overflow-y: auto;
    flex: 1;
    line-height: 1.6;
  }

  .modal-content::-webkit-scrollbar {
    width: 12px;
  }

  .modal-content::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.3);
  }

  .modal-content::-webkit-scrollbar-thumb {
    background: var(--bsod-text);
    border: 2px solid var(--bsod-blue);
  }

  .modal-footer {
    padding: 8px 12px;
    border-top: 2px solid var(--bsod-text);
    background: rgba(0, 0, 0, 0.2);
  }

  .modal-hint {
    color: var(--bsod-gray);
    font-size: 14px;
    margin: 0;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .modal-window {
      max-width: 95%;
      max-height: 90%;
      width: auto;
    }

    .modal-content {
      padding: 20px;
    }
  }
</style>
```

**Step 2: Create modal controller script**

Create `src/scripts/modal.ts`:
```typescript
// Modal management
const modals = new Map<string, HTMLElement>();

// Register all modals
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal').forEach((modal) => {
    const id = modal.id.replace('modal-', '');
    modals.set(id, modal as HTMLElement);

    // Close button handler
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn?.addEventListener('click', () => closeModal(id));

    // Backdrop click to close
    const backdrop = modal.querySelector('.modal-backdrop');
    backdrop?.addEventListener('click', () => closeModal(id));
  });
});

// Listen for open modal events
window.addEventListener('open-modal', ((e: CustomEvent) => {
  const { target } = e.detail;

  // Special handling for blog (navigate to page)
  if (target === 'blog') {
    window.location.href = '/blog';
    return;
  }

  openModal(target);
}) as EventListener);

// ESC key to close active modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const activeModal = document.querySelector('.modal.active');
    if (activeModal) {
      const id = activeModal.id.replace('modal-', '');
      closeModal(id);
    }
  }
});

function openModal(id: string) {
  const modal = modals.get(id);
  if (!modal) return;

  // Add glitch effect
  document.body.classList.add('glitch-active');
  setTimeout(() => {
    document.body.classList.remove('glitch-active');
  }, 300);

  // Show modal
  modal.classList.add('active');

  // Focus first focusable element or modal itself
  const focusable = modal.querySelector('button, a, input, [tabindex="0"]');
  if (focusable) {
    (focusable as HTMLElement).focus();
  }
}

function closeModal(id: string) {
  const modal = modals.get(id);
  if (!modal) return;

  modal.classList.remove('active');

  // Return focus to menu
  const selectedItem = document.querySelector('.menu-item.selected');
  if (selectedItem) {
    (selectedItem as HTMLElement).focus();
  }
}
```

**Step 3: Commit**

```bash
git add src/components/Modal.astro src/scripts/modal.ts
git commit -m "feat: add modal component system with ESC close and focus management"
```

---

## Task 7: Content Modals (About, Skills, Contact)

**Files:**
- Create: `src/components/AboutModal.astro`
- Create: `src/components/SkillsModal.astro`
- Create: `src/components/ContactModal.astro`

**Step 1: Create About modal**

Create `src/components/AboutModal.astro`:
```astro
---
import Modal from './Modal.astro';
---

<Modal id="about" title="ABOUT :: SYSTEM_INFORMATION">
  <div class="content-section glow">
    <h2>▬▬▬ WHO AM I ▬▬▬</h2>
    <p>
      [Replace this with your actual bio]
    </p>
    <p>
      I'm a developer who loves building things that live on the web.
      Currently working full-time, exploring new technologies, and
      occasionally writing about my experiences.
    </p>
    <p>
      When I'm not coding, you'll find me [your hobbies/interests].
    </p>

    <h2 style="margin-top: 30px;">▬▬▬ BACKGROUND ▬▬▬</h2>
    <p>
      [Add your background, education, what drives you, etc.]
    </p>
  </div>
</Modal>

<style>
  .content-section h2 {
    font-size: 18px;
    margin-bottom: 16px;
    color: var(--bsod-text);
  }

  .content-section p {
    margin-bottom: 16px;
  }
</style>
```

**Step 2: Create Skills modal**

Create `src/components/SkillsModal.astro`:
```astro
---
import Modal from './Modal.astro';
---

<Modal id="skills" title="SKILLS :: SYSTEM_CAPABILITIES">
  <div class="skills-section glow">
    <h2>▬▬▬ TECHNICAL SKILLS ▬▬▬</h2>

    <div class="skill-category">
      <h3>► Languages</h3>
      <ul>
        <li>JavaScript / TypeScript</li>
        <li>Python</li>
        <li>HTML / CSS</li>
        <li>[Add your languages]</li>
      </ul>
    </div>

    <div class="skill-category">
      <h3>► Frameworks & Libraries</h3>
      <ul>
        <li>React / Next.js</li>
        <li>Node.js</li>
        <li>Astro</li>
        <li>[Add your frameworks]</li>
      </ul>
    </div>

    <div class="skill-category">
      <h3>► Tools & Technologies</h3>
      <ul>
        <li>Git / GitHub</li>
        <li>Docker</li>
        <li>VS Code</li>
        <li>[Add your tools]</li>
      </ul>
    </div>

    <div class="skill-category">
      <h3>► Areas of Interest</h3>
      <ul>
        <li>Web Development</li>
        <li>UI/UX Design</li>
        <li>[Add your interests]</li>
      </ul>
    </div>
  </div>
</Modal>

<style>
  .skills-section h2 {
    font-size: 18px;
    margin-bottom: 24px;
  }

  .skill-category {
    margin-bottom: 24px;
  }

  .skill-category h3 {
    font-size: 16px;
    margin-bottom: 12px;
    color: var(--bsod-text);
  }

  .skill-category ul {
    list-style: none;
    padding-left: 20px;
  }

  .skill-category li {
    margin: 6px 0;
    position: relative;
  }

  .skill-category li::before {
    content: '•';
    position: absolute;
    left: -15px;
  }
</style>
```

**Step 3: Create Contact modal**

Create `src/components/ContactModal.astro`:
```astro
---
import Modal from './Modal.astro';
---

<Modal id="contact" title="CONTACT :: NETWORK_CONNECTIONS">
  <div class="contact-section glow">
    <h2>▬▬▬ GET IN TOUCH ▬▬▬</h2>

    <div class="contact-item">
      <span class="contact-label">EMAIL:</span>
      <a href="mailto:alex@jndl.dev" class="contact-link">
        alex@jndl.dev
      </a>
    </div>

    <div class="contact-item">
      <span class="contact-label">GITHUB:</span>
      <a href="https://github.com/jndl" target="_blank" rel="noopener noreferrer" class="contact-link">
        github.com/jndl
      </a>
    </div>

    <div class="contact-item">
      <span class="contact-label">LINKEDIN:</span>
      <a href="https://linkedin.com/in/jndl" target="_blank" rel="noopener noreferrer" class="contact-link">
        linkedin.com/in/jndl
      </a>
    </div>

    <div style="margin-top: 30px;">
      <p>Feel free to reach out for collaborations, questions, or just to say hi!</p>
    </div>
  </div>
</Modal>

<style>
  .contact-section h2 {
    font-size: 18px;
    margin-bottom: 24px;
  }

  .contact-item {
    margin: 16px 0;
    display: flex;
    gap: 12px;
    align-items: baseline;
  }

  .contact-label {
    min-width: 100px;
    color: var(--bsod-gray);
  }

  .contact-link {
    color: var(--bsod-text);
    text-decoration: none;
    border-bottom: 1px solid var(--bsod-text);
    transition: all 0.1s;
  }

  .contact-link:hover {
    background: var(--bsod-text);
    color: var(--bsod-blue);
    text-shadow: none;
  }

  @media (max-width: 768px) {
    .contact-item {
      flex-direction: column;
      gap: 4px;
    }
  }
</style>
```

**Step 4: Commit**

```bash
git add src/components/AboutModal.astro src/components/SkillsModal.astro src/components/ContactModal.astro
git commit -m "feat: add About, Skills, and Contact modal content"
```

---

## Task 8: Blog Content Collection Setup

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/blog/.gitkeep`

**Step 1: Configure content collections**

Create `src/content/config.ts`:
```typescript
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { blog };
```

**Step 2: Create blog directory**

```bash
mkdir -p src/content/blog
touch src/content/blog/.gitkeep
```

**Step 3: Create example blog post**

Create `src/content/blog/welcome.md`:
```markdown
---
title: "Welcome to my BSOD Blog"
description: "The first post on this retro-styled blog"
date: 2025-11-12
tags: ["meta", "welcome"]
---

# Welcome

This is the first post on my BSOD-themed blog. If you're reading this, you've successfully navigated the retro interface!

## Why BSOD?

I wanted to create something unique and nostalgic. The Windows Blue Screen of Death is iconic, and building a portfolio around it felt like a fun challenge.

## What to Expect

I'll be writing about:
- Web development
- Cool projects I'm working on
- Technical deep-dives
- Whatever else interests me

Thanks for visiting!
```

**Step 4: Commit**

```bash
git add src/content/
git commit -m "feat: setup blog content collection with example post"
```

---

## Task 9: Blog Index Page

**Files:**
- Create: `src/pages/blog/index.astro`
- Create: `src/styles/blog.css`

**Step 1: Create blog listing page**

Create `src/pages/blog/index.astro`:
```astro
---
import { getCollection } from 'astro:content';
import '../../styles/fonts.css';
import '../../styles/bsod.css';
import '../../styles/crt-effects.css';
import '../../styles/blog.css';

const posts = (await getCollection('blog')).sort(
  (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
);

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BLOG :: ERROR_LOGS</title>
  <meta name="description" content="Blog posts and writings">
</head>
<body>
  <div class="crt">
    <div class="crt-screen">
      <div class="blog-container">
        <header class="blog-header">
          <h1 class="glow">SYSTEM ERROR LOGS</h1>
          <p>A collection of documented failures and successes</p>
        </header>

        <div class="blog-separator">
          ════════════════════════════════════════════════════════════
        </div>

        <div class="posts-list">
          {posts.map((post) => (
            <article class="post-item">
              <a href={`/blog/${post.slug}`} class="post-link">
                <h2 class="post-title">
                  <span class="post-arrow">►</span>
                  {post.data.title}
                </h2>
                <div class="post-meta">
                  <time datetime={post.data.date.toISOString()}>
                    {formatDate(post.data.date)}
                  </time>
                  {post.data.tags && post.data.tags.length > 0 && (
                    <span class="post-tags">
                      {post.data.tags.map(tag => `[${tag}]`).join(' ')}
                    </span>
                  )}
                </div>
                <p class="post-description">{post.data.description}</p>
              </a>
            </article>
          ))}
        </div>

        <div class="blog-separator">
          ════════════════════════════════════════════════════════════
        </div>

        <footer class="blog-footer">
          <a href="/" class="back-link">← Return to main menu</a>
          <p class="help-text">Use ↑↓ arrows or click to navigate posts</p>
        </footer>
      </div>
    </div>
  </div>

  <script>
    // Keyboard navigation for posts
    const postLinks = Array.from(document.querySelectorAll('.post-link'));
    let selectedIndex = 0;

    function selectPost(index: number) {
      postLinks.forEach((link, i) => {
        const item = link.closest('.post-item');
        if (i === index) {
          item?.classList.add('selected');
          (link as HTMLElement).focus();
        } else {
          item?.classList.remove('selected');
        }
      });
      selectedIndex = index;
    }

    // Initial selection
    if (postLinks.length > 0) {
      selectPost(0);
    }

    document.addEventListener('keydown', (e) => {
      if (postLinks.length === 0) return;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          selectedIndex = (selectedIndex - 1 + postLinks.length) % postLinks.length;
          selectPost(selectedIndex);
          break;
        case 'ArrowDown':
          e.preventDefault();
          selectedIndex = (selectedIndex + 1) % postLinks.length;
          selectPost(selectedIndex);
          break;
        case 'Enter':
          e.preventDefault();
          (postLinks[selectedIndex] as HTMLElement).click();
          break;
        case 'Escape':
          e.preventDefault();
          window.location.href = '/';
          break;
      }
    });

    // Click to select
    postLinks.forEach((link, index) => {
      link.addEventListener('click', (e) => {
        selectPost(index);
      });
    });
  </script>
</body>
</html>
```

**Step 2: Create blog-specific styles**

Create `src/styles/blog.css`:
```css
.blog-container {
  padding: 40px;
  max-width: 900px;
  margin: 0 auto;
  min-height: 100vh;
}

.blog-header {
  margin-bottom: 30px;
}

.blog-header h1 {
  font-size: 24px;
  margin-bottom: 12px;
}

.blog-header p {
  color: var(--bsod-gray);
}

.blog-separator {
  margin: 20px 0;
  color: var(--bsod-gray);
  font-size: 14px;
  overflow: hidden;
}

.posts-list {
  margin: 30px 0;
}

.post-item {
  margin: 20px 0;
  transition: background 0.1s;
}

.post-item.selected {
  background: rgba(255, 255, 255, 0.1);
}

.post-link {
  display: block;
  padding: 16px;
  color: var(--bsod-text);
  text-decoration: none;
  outline: none;
}

.post-link:hover,
.post-link:focus {
  background: var(--bsod-text);
  color: var(--bsod-blue);
}

.post-link:hover .post-title,
.post-link:focus .post-title,
.post-item.selected .post-title {
  text-shadow: none;
}

.post-title {
  font-size: 20px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.post-arrow {
  opacity: 0;
  transition: opacity 0.1s;
}

.post-item.selected .post-arrow,
.post-link:hover .post-arrow,
.post-link:focus .post-arrow {
  opacity: 1;
}

.post-meta {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: var(--bsod-gray);
  margin-bottom: 8px;
}

.post-tags {
  font-family: 'Fixedsys', monospace;
}

.post-description {
  margin-top: 8px;
  line-height: 1.5;
}

.blog-footer {
  margin-top: 30px;
}

.back-link {
  color: var(--bsod-text);
  text-decoration: none;
  border-bottom: 1px solid var(--bsod-text);
  display: inline-block;
  margin-bottom: 16px;
}

.back-link:hover {
  background: var(--bsod-text);
  color: var(--bsod-blue);
}

.help-text {
  color: var(--bsod-gray);
  font-size: 14px;
}

/* Responsive */
@media (max-width: 768px) {
  .blog-container {
    padding: 20px;
  }

  .post-meta {
    flex-direction: column;
    gap: 4px;
  }
}
```

**Step 3: Commit**

```bash
git add src/pages/blog/index.astro src/styles/blog.css
git commit -m "feat: add blog index page with keyboard navigation"
```

---

## Task 10: Blog Post Page with Reading Mode Toggle

**Files:**
- Create: `src/pages/blog/[slug].astro`
- Create: `src/styles/blog-post.css`

**Step 1: Create blog post template**

Create `src/pages/blog/[slug].astro`:
```astro
---
import { getCollection } from 'astro:content';
import '../../styles/fonts.css';
import '../../styles/bsod.css';
import '../../styles/crt-effects.css';
import '../../styles/blog-post.css';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{post.data.title} :: ERROR_LOG</title>
  <meta name="description" content={post.data.description}>
</head>
<body>
  <div class="crt">
    <div class="crt-screen">
      <div class="post-container">
        <header class="post-header">
          <h1 class="post-title glow">{post.data.title}</h1>
          <div class="post-meta">
            <time datetime={post.data.date.toISOString()}>
              {formatDate(post.data.date)}
            </time>
            {post.data.tags && post.data.tags.length > 0 && (
              <span class="post-tags">
                {post.data.tags.map(tag => `[${tag}]`).join(' ')}
              </span>
            )}
          </div>
          <button id="reading-mode-toggle" class="reading-mode-btn" aria-label="Toggle reading mode">
            <span class="toggle-icon">□</span> Reading Mode
          </button>
        </header>

        <div class="post-separator">
          ════════════════════════════════════════════════════════════
        </div>

        <article class="post-content prose">
          <Content />
        </article>

        <div class="post-separator">
          ════════════════════════════════════════════════════════════
        </div>

        <footer class="post-footer">
          <a href="/blog" class="back-link">← Back to all posts</a>
          <a href="/" class="home-link">← Return to main menu</a>
        </footer>
      </div>
    </div>
  </div>

  <script>
    const toggle = document.getElementById('reading-mode-toggle');
    const body = document.body;
    const icon = toggle?.querySelector('.toggle-icon');

    // Check for saved preference
    const savedMode = localStorage.getItem('reading-mode');
    if (savedMode === 'true') {
      body.classList.add('reading-mode');
      if (icon) icon.textContent = '■';
    }

    toggle?.addEventListener('click', () => {
      body.classList.toggle('reading-mode');
      const isActive = body.classList.contains('reading-mode');
      if (icon) icon.textContent = isActive ? '■' : '□';
      localStorage.setItem('reading-mode', String(isActive));
    });

    // ESC to go back
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        window.location.href = '/blog';
      }
    });
  </script>
</body>
</html>
```

**Step 2: Create blog post styles with reading mode**

Create `src/styles/blog-post.css`:
```css
.post-container {
  padding: 40px;
  max-width: 900px;
  margin: 0 auto;
  min-height: 100vh;
}

.post-header {
  margin-bottom: 30px;
}

.post-title {
  font-size: 28px;
  margin-bottom: 16px;
  line-height: 1.3;
}

.post-meta {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: var(--bsod-gray);
  margin-bottom: 16px;
}

.post-tags {
  font-family: 'Fixedsys', monospace;
}

.reading-mode-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid var(--bsod-text);
  color: var(--bsod-text);
  font-family: 'VGA', monospace;
  font-size: 14px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.1s;
}

.reading-mode-btn:hover {
  background: var(--bsod-text);
  color: var(--bsod-blue);
}

.toggle-icon {
  font-size: 16px;
}

.post-separator {
  margin: 30px 0;
  color: var(--bsod-gray);
  font-size: 14px;
  overflow: hidden;
}

/* Prose styles for markdown content */
.prose {
  line-height: 1.7;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  margin-top: 32px;
  margin-bottom: 16px;
  font-weight: bold;
}

.prose h1 { font-size: 24px; }
.prose h2 { font-size: 22px; }
.prose h3 { font-size: 20px; }
.prose h4 { font-size: 18px; }

.prose p {
  margin-bottom: 16px;
}

.prose a {
  color: var(--bsod-text);
  text-decoration: underline;
}

.prose a:hover {
  background: var(--bsod-text);
  color: var(--bsod-blue);
}

.prose ul,
.prose ol {
  margin-left: 30px;
  margin-bottom: 16px;
}

.prose li {
  margin: 8px 0;
}

.prose code {
  background: rgba(0, 0, 0, 0.3);
  padding: 2px 6px;
  font-family: 'Fixedsys', monospace;
  font-size: 14px;
}

.prose pre {
  background: rgba(0, 0, 0, 0.5);
  padding: 16px;
  overflow-x: auto;
  margin: 16px 0;
  border: 1px solid var(--bsod-gray);
}

.prose pre code {
  background: none;
  padding: 0;
}

.prose blockquote {
  border-left: 4px solid var(--bsod-text);
  padding-left: 16px;
  margin: 16px 0;
  color: var(--bsod-gray);
  font-style: italic;
}

.prose img {
  max-width: 100%;
  height: auto;
  margin: 24px 0;
  border: 2px solid var(--bsod-text);
}

.prose hr {
  border: none;
  border-top: 2px solid var(--bsod-gray);
  margin: 32px 0;
}

/* Reading Mode Styles */
body.reading-mode {
  background: #1a1a2e;
}

body.reading-mode .post-content {
  background: rgba(0, 0, 30, 0.8);
  padding: 30px;
  border-radius: 0;
  border: 2px solid rgba(170, 170, 170, 0.3);
}

body.reading-mode .prose {
  color: #e0e0e0;
  line-height: 1.8;
}

body.reading-mode .prose a {
  color: #6b9eff;
}

body.reading-mode .prose code {
  background: rgba(0, 0, 0, 0.5);
  color: #a0e0ff;
}

body.reading-mode .reading-mode-btn {
  background: var(--bsod-text);
  color: var(--bsod-blue);
}

.post-footer {
  margin-top: 30px;
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.back-link,
.home-link {
  color: var(--bsod-text);
  text-decoration: none;
  border-bottom: 1px solid var(--bsod-text);
  display: inline-block;
}

.back-link:hover,
.home-link:hover {
  background: var(--bsod-text);
  color: var(--bsod-blue);
}

/* Responsive */
@media (max-width: 768px) {
  .post-container {
    padding: 20px;
  }

  .post-title {
    font-size: 22px;
  }

  .post-meta {
    flex-direction: column;
    gap: 4px;
  }

  .prose pre {
    font-size: 12px;
  }
}
```

**Step 3: Commit**

```bash
git add src/pages/blog/[slug].astro src/styles/blog-post.css
git commit -m "feat: add blog post page with reading mode toggle"
```

---

## Task 11: Main Index Page Assembly

**Files:**
- Create: `src/pages/index.astro`

**Step 1: Create main index page with all components**

Create `src/pages/index.astro`:
```astro
---
import BootSequence from '../components/BootSequence.astro';
import BSODMenu from '../components/BSODMenu.astro';
import AboutModal from '../components/AboutModal.astro';
import SkillsModal from '../components/SkillsModal.astro';
import ContactModal from '../components/ContactModal.astro';
import '../styles/fonts.css';
import '../styles/bsod.css';
import '../styles/crt-effects.css';
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FATAL_EXCEPTION :: Portfolio</title>
  <meta name="description" content="A retro BSOD-themed portfolio website">
</head>
<body>
  <BootSequence />
  <BSODMenu />
  <AboutModal />
  <SkillsModal />
  <ContactModal />

  <script src="../scripts/modal.ts"></script>
</body>
</html>
```

**Step 2: Test the site**

Run:
```bash
npm run dev
```

Expected:
- Boot sequence appears
- Transitions to BSOD menu after ~3.5 seconds
- Menu keyboard navigation works
- Modals open and close
- CRT effects visible

**Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: assemble main index page with all components"
```

---

## Task 12: Build Configuration and Optimization

**Files:**
- Modify: `astro.config.mjs`
- Create: `.gitignore`

**Step 1: Update Astro config for production**

Edit `astro.config.mjs`:
```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      cssMinify: 'lightningcss',
    },
  },
});
```

**Step 2: Ensure proper gitignore**

Create/update `.gitignore`:
```
# dependencies
node_modules/

# build output
dist/
.astro/

# environment variables
.env
.env.production

# macOS
.DS_Store

# editor
.vscode/
.idea/
*.swp
*.swo

# logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
```

**Step 3: Test production build**

Run:
```bash
npm run build
```

Expected: Successful build with no errors

Run:
```bash
npm run preview
```

Expected: Production build previews correctly

**Step 4: Commit**

```bash
git add astro.config.mjs .gitignore
git commit -m "chore: configure build optimization and gitignore"
```

---

## Task 13: Documentation and README

**Files:**
- Create: `README.md`
- Create: `docs/CUSTOMIZATION.md`

**Step 1: Create comprehensive README**

Create `README.md`:
```markdown
# BSOD Portfolio Website

A retro Windows BSOD-themed portfolio website with authentic pixel fonts, CRT effects, and nostalgic vibes.

## Features

- 🖥️ Authentic Windows BSOD aesthetic
- 📺 CRT scanlines, screen flicker, and phosphor glow effects
- ⌨️ Full keyboard navigation (arrow keys, Enter, ESC)
- 🖱️ Mouse/touch support
- 📝 Markdown blog with frontmatter
- 📖 Reading mode toggle for comfortable long-form reading
- 🎨 Responsive design (desktop-first but mobile-friendly)
- ⚡ Fast static site generation with Astro

## Tech Stack

- **Framework**: Astro 4.x
- **Language**: TypeScript
- **Styling**: CSS3 (vanilla)
- **Fonts**: Authentic pixel fonts (IBM VGA, Fixedsys)
- **Content**: Markdown with frontmatter

## Project Structure

```
/
├── src/
│   ├── pages/
│   │   ├── index.astro          # Main BSOD menu page
│   │   └── blog/
│   │       ├── index.astro      # Blog listing
│   │       └── [slug].astro     # Individual blog posts
│   ├── components/
│   │   ├── BootSequence.astro   # Linux boot animation
│   │   ├── BSODMenu.astro       # Main navigation menu
│   │   ├── Modal.astro          # Reusable modal component
│   │   ├── AboutModal.astro     # About section
│   │   ├── SkillsModal.astro    # Skills section
│   │   └── ContactModal.astro   # Contact section
│   ├── content/
│   │   └── blog/                # Markdown blog posts
│   ├── scripts/
│   │   ├── menu.ts              # Menu navigation logic
│   │   └── modal.ts             # Modal management
│   └── styles/
│       ├── fonts.css            # Font declarations
│       ├── bsod.css             # Base BSOD styling
│       ├── crt-effects.css      # CRT visual effects
│       ├── blog.css             # Blog listing styles
│       └── blog-post.css        # Blog post styles
└── public/
    └── fonts/                   # Pixel font files
```

## Development

### Prerequisites

- Node.js 18+
- npm/pnpm/yarn

### Setup

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open http://localhost:4321

### Commands

| Command                | Action                                       |
|:-----------------------|:---------------------------------------------|
| `npm install`          | Install dependencies                         |
| `npm run dev`          | Start dev server at `localhost:4321`        |
| `npm run build`        | Build production site to `./dist/`          |
| `npm run preview`      | Preview production build locally             |

## Content Customization

### Personal Information

Edit these files to customize your content:

- **About**: `src/components/AboutModal.astro`
- **Skills**: `src/components/SkillsModal.astro`
- **Contact**: `src/components/ContactModal.astro`

### Blog Posts

Create new posts in `src/content/blog/` with frontmatter:

```markdown
---
title: "Your Post Title"
description: "A brief description"
date: 2025-11-12
tags: ["tag1", "tag2"]
---

Your content here...
```

Posts are automatically sorted by date (newest first).

### Keyboard Controls

- **Arrow Keys (↑↓)**: Navigate menu/lists
- **Enter**: Select/open
- **ESC**: Close modal/return
- **Any key**: Skip boot sequence

## Deployment

Build the site:
```bash
npm run build
```

Deploy the `dist/` folder to any static host:
- Netlify
- Vercel
- GitHub Pages
- Cloudflare Pages

## License

MIT

## Credits

Fonts:
- IBM VGA Font by VileR (int10h.org)
- Fixedsys Excelsior by Darien Valentine
```

**Step 2: Create customization guide**

Create `docs/CUSTOMIZATION.md`:
```markdown
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
```

**Step 3: Commit**

```bash
git add README.md docs/CUSTOMIZATION.md
git commit -m "docs: add comprehensive README and customization guide"
```

---

## Task 14: Final Testing and Polish

**Step 1: Test all functionality**

Manual testing checklist:

- [ ] Boot sequence plays and transitions correctly
- [ ] Menu keyboard navigation (↑↓ arrows)
- [ ] Menu mouse click navigation
- [ ] About modal opens/closes
- [ ] Skills modal opens/closes
- [ ] Contact modal opens/closes
- [ ] Links in contact modal work
- [ ] Blog menu item navigates to /blog
- [ ] Blog listing shows posts sorted by date
- [ ] Blog listing keyboard navigation works
- [ ] Blog post opens and renders markdown
- [ ] Reading mode toggle works
- [ ] Reading mode preference persists
- [ ] ESC key closes modals
- [ ] ESC key on blog returns to listing
- [ ] CRT scanlines visible
- [ ] Screen flicker effect present
- [ ] Text glow effect visible
- [ ] Responsive layout on mobile
- [ ] Touch navigation on mobile

**Step 2: Performance check**

Run Lighthouse audit:
```bash
npm run build
npm run preview
```

Open DevTools → Lighthouse → Run audit

Target scores:
- Performance: 90+
- Accessibility: 85+
- Best Practices: 90+

**Step 3: Cross-browser testing**

Test in:
- Chrome/Edge
- Firefox
- Safari (if on macOS)
- Mobile browsers

**Step 4: Fix any issues found**

Document issues and create follow-up tasks if needed.

**Step 5: Final commit**

```bash
git add .
git commit -m "test: verify all functionality and cross-browser compatibility"
```

---

## Task 15: Deployment Setup

**Files:**
- Create: `netlify.toml` (for Netlify)
- Create: `vercel.json` (for Vercel)

**Step 1: Create Netlify config**

Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Step 2: Create Vercel config**

Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "astro"
}
```

**Step 3: Add deployment instructions to README**

Add to `README.md` after the Build section:

```markdown
### Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

1. Connect your Git repository
2. Build command: `npm run build`
3. Publish directory: `dist`

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Import your repository
2. Framework preset: Astro
3. Deploy!
```

**Step 4: Commit**

```bash
git add netlify.toml vercel.json README.md
git commit -m "chore: add deployment configs for Netlify and Vercel"
```

---

## Summary

This implementation plan creates a fully functional BSOD-themed portfolio website with:

✅ Authentic Windows BSOD aesthetic with IBM VGA fonts
✅ Linux-style boot sequence with gradual corruption
✅ CRT effects (scanlines, flicker, phosphor glow, glitch transitions)
✅ Keyboard navigation (arrows, Enter, ESC) + mouse support
✅ Modal windows for About, Skills, Contact sections
✅ Blog system with markdown + frontmatter, sorted by date
✅ Reading mode toggle for comfortable blog reading
✅ Responsive design (desktop-first, mobile-friendly)
✅ Fast static site generation with Astro
✅ Deployment-ready configs

**Total Tasks**: 15
**Estimated Time**: 3-4 hours for experienced developer
**Lines of Code**: ~1500 (HTML/CSS/TS)

**Next Steps After Implementation**:
1. Customize content in modal components
2. Write blog posts in `src/content/blog/`
3. Acquire and add authentic pixel fonts to `public/fonts/`
4. Deploy to hosting platform
5. Share your retro portfolio!
