# Font Subsetting and Performance: Video Script

Teaching video for the Font Subsetting choose topic. Target length: 13-14 minutes (requirement: 12-15).
Demo folder: `unit-5/font-subsetting-demo/`. The font is Inter (open source, SIL Open Font License), a variable font with two axes.

## Checklist coverage

| Teaching Video Checklist item | Where it is covered |
|---|---|
| 1. Why a font file is bigger than a site needs, and what subsetting removes | 0:00-3:00 |
| 2. How `unicode-range` lets the browser skip files | 3:00-6:30 |
| 3. Static vs dynamic subsetting | 6:30-8:30 |
| 4. What at least one tool does in the workflow | 8:30-10:30 |
| 5. FOIT vs FOUT, narrated against a loading font, and how a smaller subset shortens both | 10:30-12:30 |
| 6. Personal before-and-after in the network panel | 12:30-14:30 |

## Real numbers from the demo

These were measured from the files in `fonts/` (also in `sizes.json`).

| File | Size |
|---|---|
| `Inter-Variable.ttf` (original download) | 876,576 bytes (856 KB) |
| `Inter-full.woff2` (whole font, compressed) | 350,460 bytes (342 KB) |
| `Inter-latin.woff2` | 97,848 bytes (95.6 KB) |
| `Inter-latin-ext.woff2` | 123,680 bytes (120.8 KB) |
| `Inter-greek.woff2` | 29,832 bytes (29.1 KB) |
| `Inter-cyrillic.woff2` | 27,548 bytes (26.9 KB) |
| `Inter-page-only.woff2` (only the 98 characters the page uses) | 72,772 bytes (71.1 KB) |

English page: 342 KB before, 95.6 KB after, which is **72% smaller**.

## Setup before recording

1. In a terminal, from `unit-5/font-subsetting-demo/`, run `node server.js 150`. Fonts are served at 150 KB/s so the download is slow enough to see. Leave it running.
2. Open `http://localhost:8080/unit-5/font-subsetting-demo/` in Chrome or Edge.
3. In DevTools, open the Network tab, filter to **Font**, and tick **Disable cache**.
4. Have `build-fonts.py`, `after.css` and `before.css` open in your editor.
5. Optional: run `python build-fonts.py` once to show the files being generated. It needs `python -m pip install fonttools brotli`.

---

## 0:00-0:45 Introduction

"Hi, I'm Jaeden. For my choose topic I'm covering font subsetting.

Web fonts make a site look better, but they're one of the heaviest things on a page. In this video I'll show why font files are bigger than a site needs, how you cut them down, how the browser uses `unicode-range` to skip files it doesn't need, and how all of it affects what visitors see while a font loads. I'll finish with a before-and-after on a real page, comparing the font request in the network panel."

---

## 0:45-3:00 Why a font file is bigger than you need

**Open `index.html` in the demo. Show the table of file sizes.**

"Here's the problem in numbers. I downloaded Inter, a popular open-source font. The original file is 856 kilobytes. Compressed as a WOFF2, which is the format you'd serve on the web, the whole thing is still 342 kilobytes. And that's one font file. A site often loads several weights.

Why so big? A font isn't just the letters you see. This one includes Latin, Latin Extended for accented letters in other European languages, Greek, Cyrillic, symbols and currency signs. It carries hinting data for low-resolution screens, and layout information like ligatures and kerning for each of those glyphs. Inter is also a variable font, so there's extra data for the weight and optical size axes.

Now think about my portfolio. It's English. The text uses about 100 different characters, out of thousands the font defines. So most of that download is glyphs I never display. That's what subsetting fixes."

**Click the checkboxes to show the sizes.**

"Subsetting means making a new, smaller font file that only contains the glyphs you choose. The text looks exactly the same. The unused glyphs are just gone. If I only need the Latin file, I'm downloading 95 kilobytes, which is 72 percent smaller. The Greek and Cyrillic files are small, around 27 and 29 kilobytes, but Latin Extended is 120 on its own. This also shows that how much you save depends on what's in the font."

---

## 3:00-6:30 `unicode-range`: how the browser skips files

**Open `after.css`.**

"Splitting a font into files only helps if the browser knows which one to load. That's what `unicode-range` is for."

```css
@font-face {
    font-family: "Inter Demo";
    src: url("fonts/Inter-latin.woff2") format("woff2");
    font-weight: 100 900;
    font-display: swap;
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+2000-206F;
}

@font-face {
    font-family: "Inter Demo";
    src: url("fonts/Inter-cyrillic.woff2") format("woff2");
    font-weight: 100 900;
    font-display: swap;
    unicode-range: U+0400-045F, U+0490-0491;
}
```

"I wrote one `@font-face` rule per file, and all of them share the same `font-family` name, so in my CSS it still looks like one font. The new part is `unicode-range`, which lists the Unicode code points that file provides. `U+0000-00FF` is basic Latin and Latin-1, which covers English and accented letters like é. `U+0400-045F` is Cyrillic.

Here's the key idea. The browser looks at the characters on the page. If none of them fall inside a file's range, **it doesn't download that file at all.** An English page only requests the Latin file. A Russian page only requests the Cyrillic one. And `unicode-range` has universal browser support."

**Demo: open `after.html` with the Network tab (Font filter, cache disabled). Reload.**

"One request. `Inter-latin.woff2`, about 96 kilobytes. Latin Extended, Greek and Cyrillic are all declared in the CSS, but none were downloaded."

**Click "Add Russian text".**

"Watch the network panel. The moment Russian text appears on the page, the browser requests `Inter-cyrillic.woff2`. It wasn't needed, so it didn't load, and now it is, so it does."

**Click "Add Greek text."** "Same thing for Greek."

"That's `unicode-range` working. The files are lazy-loaded by character."

---

## 6:30-8:30 Static vs dynamic subsetting

"There are two ways to get subset files.

**Static subsetting** is what I did. I build the files ahead of time, choose exactly which characters or scripts to include, and host them myself. I have full control, my site has no runtime dependency on another service, and I control caching.

**Dynamic subsetting** is when a font service generates the subset for you on demand. Google Fonts is the common example. It looks at the characters a page declares, or a `text` parameter in the URL, and serves a file tailored to that. There's no build step, which makes it great for rapid prototyping. The tradeoff is that you depend on an outside service, and you get less direct control over caching and delivery.

My rule of thumb: dynamic for quick prototypes, static for production sites you control, which is why I went static here."

---

## 8:30-10:30 The tool: `pyftsubset`

**Open `build-fonts.py`.**

"The tool I used is `pyftsubset`, part of fonttools, a Python library. It's what most other subsetting tools use underneath. Here's the command my script runs for the Latin file:"

```
python -m fontTools.subset Inter-Variable.ttf
    --unicodes="U+0000-00FF,U+0131,U+0152-0153,U+2000-206F"
    --flavor=woff2
    --layout-features=*
    --output-file=Inter-latin.woff2
```

"Each flag has a job. `--unicodes` is the list of code points to keep, and it's the same list I put in the `unicode-range`, so the file and the CSS always match. `--flavor=woff2` compresses the output as WOFF2. `--layout-features=*` keeps features like kerning and ligatures, since the default removes some of them. And `--output-file` is where it goes."

"My script also does one more trick. It reads my page, collects the characters it actually uses, 98 of them, and subsets by that list with `--text-file`. That gives `Inter-page-only.woff2`, at 71 kilobytes. That's what a tool called **glyphhanger** automates: it scans your pages for the characters used, then drives the subsetter. I wrote a tiny scanner instead, because glyphhanger needs a headless browser installed."

"Notice that even with only 98 characters, the file is 71 kilobytes. That's because this is a variable font, and the data for the weight and size axes is a big part of the size. If I only needed one weight, I could pin the axes first and get it much smaller. A third tool, **Wakamai Fondue**, is useful before any of this: you drop in a font and it shows what's inside, the glyphs, the features and the axes, so you can decide what's safe to remove."

---

## 10:30-12:30 FOIT vs FOUT, and how a smaller subset shortens both

**Open `loading.html?font=full`. The server is throttling fonts to 150 KB/s.**

"While a web font downloads, the browser has to decide what to show. There are two behaviors.

**FOIT** is the flash of invisible text. The browser hides the text until the font arrives. Nothing jumps, but visitors stare at blank space.

**FOUT** is the flash of unstyled text. The browser shows the text immediately in a fallback font, then swaps to the web font when it arrives. It's always readable, but the swap is visible.

Neither is automatically better. You choose with the `font-display` descriptor. On this page, the left column is `font-display: block`, which behaves like FOIT, and the right column is `font-display: swap`, which behaves like FOUT. It's the same font file."

**Click "Load the full font." Narrate while it loads.**

"I'm serving the full font slowly on purpose. Look at the left column: blank. The text is there, but it's invisible. On the right, I can read it right away in the fallback serif font, and then it snaps to Inter when the download finishes. The page shows how long that took."

**Click "Load the Latin subset." Narrate.**

"Same two columns, but now the file is about a quarter of the size. The invisible period on the left is much shorter, and the swap on the right happens much sooner. That's what subsetting does for loading behavior. A smaller file finishes faster, so both windows get shorter, and the swap happens closer to first paint.

But it's not a replacement for choosing `font-display` on purpose. Subsetting shortens the problem. `font-display` decides which problem you get."

---

## 12:30-14:30 My before-and-after

**Open `before.html`. Network tab: filter Font, Disable cache on. Reload.**

"Now the real comparison. This page is my portfolio's styling with the full font. One font request: `Inter-full.woff2`, 342 kilobytes, **350,460 bytes**."

**Point to the size and the time columns. (Record the actual time you see on screen.)**

**Open `after.html`. Reload.**

"Same page, same text, same look. One font request: `Inter-latin.woff2`, **97,848 bytes**, about 96 kilobytes. That's 72 percent smaller, and the Greek, Cyrillic and Latin Extended files were never requested."

**Optional: switch DevTools throttling to Fast 4G or Slow 4G and reload both to compare the time column.**

"On a slow connection, that difference turns into real time. Less data means the font arrives sooner, which is what we saw with the FOIT and FOUT columns."

---

## 14:30-15:00 Closing

"To wrap up: font files are large because they carry every script, feature and axis, and most sites use a tiny fraction of it. Subsetting trims the file to the characters you need, and `unicode-range` lets the browser skip files a page doesn't use. You can subset statically, like I did with `pyftsubset`, or dynamically with a service. It shortens both the invisible and the unstyled text windows, and on my English page it took a font request from 342 kilobytes to 96. Thanks for watching."

---

## What I'd add if I recorded it again

- **Subsetting only keeps characters you chose.** If you later add text with a character that isn't in your subset, it silently falls back to another font, so subsets need updating when content changes. Splitting by script with `unicode-range` is a safety net against this.
- **Variable fonts dominate the size.** Pinning the axes you don't use (for example with fonttools' instancer) would shrink my file well below 71 KB.
- **Preload.** For the main font, `<link rel="preload" as="font">` starts the download earlier. The course page doesn't cover it.
- **License.** Subsetting makes a modified version of a font, so check the license allows it. Inter's license, the SIL Open Font License, does.

## Before you record: checks

1. **Timing numbers:** I verified file sizes in the browser, but not load times. My test browser pane was hidden, so the timers it showed weren't trustworthy. Read the real times from your network panel while recording.
2. **Course page gaps:** The page doesn't cover variable fonts, preload, or `pyftsubset` options, so the commands and the added points above are from my own work and general knowledge. Double-check anything you're unsure of.
3. **Length:** Time a practice run. The requirement is 12-15 minutes.
