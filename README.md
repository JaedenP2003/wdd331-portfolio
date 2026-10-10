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

## CSS Architecture

The homepage is styled by a layered CSS architecture in `css/`. Layer
order is declared once in `css/main.css`, and every file is imported
into its layer, so later layers win without relying on specificity.

```
css/
├── tokens/        colors.css, variables.css   (custom properties)
├── base/          reset.css, elements.css     (bare element styles)
├── layout/        primary.css                 (page structure)
├── components/    nav.css, cards.css          (reusable pieces)
├── utilities/     utilities.css               (single-purpose helpers)
└── main.css                                   (layer order + imports)
dist/
└── styles.css                                 (bundled, minified output)
```

Layer order: `tokens, base, layout, components, utilities`.

- **Tokens:** Sheikah-slate color palette, spacing, typography, radius
  and shadow, named by purpose (for example `--color-primary`,
  `--space-md`).
- **Components:** the site nav and the assignment cards, which include
  a CSS-only filter by unit (radio inputs plus `:has()`).

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
