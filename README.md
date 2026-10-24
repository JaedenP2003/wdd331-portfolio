# WDD 331R Portfolio

**Student:** Jaeden Platt
**Semester:** Fall 2026
**Live Site:** [View Site](https://jaedenp2003.github.io/wdd331-portfolio/)

## About

This repository is my portfolio for WDD 331R: Advanced CSS.
Each week I add new pages and styles as I work through the course
assignments. The site deploys automatically to GitHub Pages on
every push to main.

## Pages

- [Home](index.html)
- [Custom Properties and Nesting](unit-1/custom-properties/index.html)
- [nth-child() Demo](unit-1/choose-topic/demo.html)
- [Layered Components](unit-2/layered-components/index.html)
- [Lightning CSS Demo](unit-2/lightning-css-demo/index.html)
- [Visual Effects](unit-3/visual-effects/index.html)
- [Blend Modes Demo](unit-3/blend-modes-demo/index.html)

## CSS Architecture

The homepage is styled by a layered CSS architecture in `css/`. Layer
order is declared once in `css/main.css`, and every file is imported
into its layer, so later layers win without relying on specificity.

```
css/
├── tokens/        colors.css, variables.css        (custom properties)
├── base/          reset.css, elements.css          (bare element styles)
├── layout/        primary.css                      (page structure)
├── components/    nav.css, cards.css,
│                  theme-toggle.css, effects.css    (reusable pieces)
├── utilities/     utilities.css                    (single-purpose helpers)
└── main.css                                        (layer order + imports)
js/
└── theme-preference.js                             (saves the theme choice)
dist/
└── styles.css                                      (bundled, minified output)
```

Layer order: `tokens, base, layout, components, utilities`.

- **Tokens:** spacing, typography, radii, transitions, icon sizes, focus
  width, layered shadow stacks and effect amounts live in `css/tokens/variables.css`. Colors live in
  `css/tokens/colors.css` (see Dark Mode below).
- **Components:** the site nav, the assignment cards (with a CSS-only
  filter by unit using radio inputs plus `:has()`), the theme toggle, and
  the visual effects in `effects.css`.

## Dark Mode

The site supports light, dark and system-default color schemes. Use the
theme menu in the nav to switch; the choice is saved in `localStorage`
and restored by `js/theme-preference.js`.

All color tokens live in `css/tokens/colors.css`:

- **Seeds:** raw light-mode colors and an `oklch()` accent (hue 205, cyan).
- **Accent ramp:** `--accent-200` to `--accent-800`, built with
  `color-mix()` from the seed.
- **Scheme switching:** `:has()` on the `theme-preference` radios sets
  `color-scheme` on `html`.
- **Semantic tokens:** `--color-bg`, `--color-text`, `--color-accent` and
  others use `light-dark()` so one declaration covers both modes.
  Components should only use these semantic tokens.  

## Visual Effects

`unit-3/visual-effects/index.html` is styled by `css/components/effects.css`.
Every effect uses semantic tokens, so it works in light, dark and system modes.

- **Shadow tokens:** `--shadow-sm` and `--shadow-md` are layered stacks in
  `variables.css`. Their colors (`--shadow-color`, `--shadow-color-soft`) are
  stronger in dark mode, and a raised surface gets lighter in dark mode.
- **Hero:** a three-layer gradient scrim (wash, bottom fade, vignette) plus a
  layered `text-shadow`.
- **Cards:** shadow lift on hover, a gradient surface, and an image `filter`
  that clears on hover.
- **Frosted glass:** `backdrop-filter: blur() saturate()` with a `light-dark()`
  background. A solid fallback applies for `prefers-reduced-motion`,
  `prefers-reduced-transparency` and browsers without `backdrop-filter`.
- **Icons:** inline SVGs with stacked `drop-shadow()` calls and `currentColor`.
- **Blend modes (choose topic):** a `background-blend-mode: multiply` banner
  inside an `isolation: isolate` section. See also the
  [Blend Modes Demo](unit-3/blend-modes-demo/index.html).

## Build Tool

I chose **Lightning CSS** to bundle and minify the stylesheet.

```bash
npm install     # install dependencies
npm run build   # bundle css/main.css into dist/styles.css
npm run watch   # rebuild on save
```

The live site links to the source `css/main.css`, which the browser
loads along with its `@import` files. `dist/styles.css` is the same
architecture bundled into one minified file, committed as the
build receipt. Edit the files in `css/`, not `dist/`.
