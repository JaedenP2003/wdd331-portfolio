# CSS Anchor Positioning: Video Script

Teaching video for the Anchor Positioning choose topic. Target length: 13-14 minutes (requirement: 12-15).
Demo: `unit-4/anchor-positioning-demo/index.html`. The CSS you show is at the top of `styles.css`, in the same order as this script. Look for the VIDEO banners. Everything under "SKIP ON CAMERA" is layout and theming.

## Checklist coverage

| Teaching Video Checklist item | Where it is covered |
|---|---|
| 1. Problem and context: why JS tooltip libraries exist, old code then new code | 0:00-4:00 |
| 2. Core pairing: `anchor-name`, `position-anchor`, dashed ident, `absolute` or `fixed` | 4:00-6:00 |
| 3. `anchor()` vs `position-area`, a live example of each | 6:00-9:00 |
| 4. `position-try-fallbacks` flipping near an edge | 9:00-11:00 |
| 5. Pairing with the `popover` attribute | 11:00-12:30 |
| 6. Honest browser support | 12:30-13:30 |
| 7. Portfolio demo with `anchor-name`, `position-anchor` and a fallback | The whole demo page |

Suggested demo sequence from the course page (used in section 4): remove the fallbacks, drag the anchor into a corner to show it breaking, then restore the fallbacks.

---

## 0:00-1:30 Introduction

"Hi, I'm Jaeden. For my choose topic I'm covering CSS anchor positioning.

Anchor positioning lets you place one element relative to another element, using only CSS. Think of a tooltip next to a button, or a dropdown menu under its trigger. Until recently, doing that well meant JavaScript. In this video I'll show why, then show what replaces it: how the two elements get connected, two ways to place the target, how it repositions itself automatically near the edge of the screen, how it pairs with the HTML popover attribute, and where browser support really stands. Everything I show is in a demo page in my portfolio."

**Show the demo page, top to bottom, quickly.** Point at the green line: "Your browser supports anchor positioning."

---

## 1:30-4:00 The problem: why tooltip libraries exist

**Open section 1: "The old way and the new way."**

"The problem is that a tooltip lives in the document in one place but has to appear somewhere else, next to its button. Plain CSS couldn't see where another element was. So people either wrapped the button and tooltip in a `position: relative` parent, which breaks the moment something clips it with `overflow: hidden`, or they used JavaScript, and that's why libraries like Popper and Tippy exist."

**Show `app.js`, section 1:**

```javascript
function placeOldTip() {
    const rect = oldBtn.getBoundingClientRect();
    oldTip.style.top = rect.top + window.scrollY - oldTip.offsetHeight - 8 + 'px';
    oldTip.style.left = rect.left + window.scrollX + rect.width / 2 - oldTip.offsetWidth / 2 + 'px';
}

oldBtn.addEventListener('mouseenter', showOldTip);
oldBtn.addEventListener('focus', showOldTip);
window.addEventListener('resize', ...);
window.addEventListener('scroll', ...);
```

"This is the old way. On hover, I measure the button with `getBoundingClientRect()`, do math with the scroll position and the tooltip's own size, and write `top` and `left` as inline styles. Then I need listeners for hover, focus, resize and scroll to keep it right. And notice what's missing: if the button is near the edge of the screen, this tooltip just runs off the page. Handling that takes even more code."

**Hover the old button, then the new button.** "They look the same."

**Show `styles.css`, VIDEO 1:30:**

```css
.new-btn {
    anchor-name: --new-btn;
}

.new-tip {
    position: absolute;
    position-anchor: --new-btn;
    position-area: top;
}
```

"This is the new way. No measuring, no listeners, no inline styles. Two lines connect the elements, and one line says where the tooltip goes. The browser does the measuring, and it keeps it correct when the page scrolls or resizes. That's the idea of the whole video."

---

## 4:00-6:00 The core pairing

**Open section 2. Show `styles.css`, VIDEO 4:00:**

```css
.core-btn {
    anchor-name: --core-btn;
}

.core-tip {
    position: absolute;
    position-anchor: --core-btn;
    position-area: top;
}
```

"Anchor positioning is built on a pair of properties. `anchor-name` goes on the **anchor**, the element you're attaching to. `position-anchor` goes on the **target**, the element you're placing, and it says which anchor to use."

"Three rules to remember:

**One: the name is a dashed ident.** It has to start with two dashes, like a custom property, and it's unique per page. It's also a CSS property, not an HTML attribute, so you set it in your stylesheet. If two elements share the same name, the last one in the document wins, and it fails silently. So I give each demo its own: `--new-btn`, `--core-btn`, and so on.

**Two: the target must be `position: absolute` or `position: fixed`.** Without that, `position-anchor` has no effect. The anchor needs no special positioning at all.

**Three: the two elements can be anywhere in the DOM.** The tooltip doesn't have to be inside the button or share a wrapper with it. That's what gets rid of the clipping and stacking problems of the old wrapper approach."

**Hover the button.** "Here's the result. The tooltip appears centered above the button."

---

## 6:00-7:15 Placement method one: `anchor()`

**Open section 3. Show `styles.css`, VIDEO 6:00:**

```css
.fn-tip {
    position: absolute;
    position-anchor: --fn-btn;
    bottom: anchor(top);
    left: anchor(center);
    translate: -50% 0;
}
```

"There are two ways to say *where* the target goes. The first is the `anchor()` function, and it's precise. You use it inside the inset properties, `top`, `right`, `bottom` and `left`, and it returns the position of an edge of the anchor.

Here I'm saying: my **bottom** edge is at the anchor's **top** edge. My **left** edge is at the anchor's **center**. That puts the tooltip's left edge in the middle of the button, so I add `translate: -50% 0`, which pulls it back by half its own width, and now it's centered.

The keywords are `top`, `right`, `bottom`, `left`, `center`, plus logical ones like `start` and `end` that follow the writing direction. And because it's returning a length, it works with `calc()`, margins and `translate`, so I can add exact offsets.

The tradeoff: `anchor()` gives me full control, but it takes several lines and some math."

**Hover the `anchor()` button.**

---

## 7:15-9:00 Placement method two: `position-area`

**Show the explorer. Show `styles.css`, VIDEO 7:15:**

```css
.area-target {
    position: absolute;
    position-anchor: --area-box;
    position-area: top;
}
```

"The second way is `position-area`, and it's a shorthand. Picture the anchor sitting in the middle of a three-by-three grid. The anchor is the center cell. There are eight cells around it: top left, top, top right, and so on. `position-area` just says *which cell* the target sits in."

**Click through the radio buttons.** Narrate a few: "top left, bottom, right, center."

"The first word is the vertical position and the second is the horizontal one. A single word like `top` means centered on the other axis. The page also mentions `span-all`, which lets the target stretch across several cells.

Behind the scenes, each radio button is just changing this one property. I use `:has()` to read whichever one is checked:"

```css
.area-demo:has([value="top left"]:checked) .area-target { position-area: top left; }
```

"So when do I use which? `position-area` is easier to read and covers most tooltips and menus, in one line. I reach for `anchor()` when I need a precise edge or an offset the grid can't express."

---

## 9:00-11:00 Automatic repositioning

**Open section 4. Show `styles.css`, VIDEO 9:00:**

```css
.drag-tip {
    position: absolute;
    position-anchor: --drag;
    position-area: top;
    position-try-fallbacks: flip-block, flip-inline, flip-block flip-inline;
}
```

"Here's the part that used to be the hardest. What happens when there's no room for the tooltip above the anchor? That's the job of `position-try-fallbacks`. It's a list of alternatives. The browser tries your normal position first, and if the target would overflow, it tries the first fallback, then the next, and uses the first one that fits. `flip-block` flips it vertically, to the other side of the anchor. `flip-inline` flips it horizontally. You can also point to your own `@position-try` blocks that change several properties at once."

**Demo, following the suggested sequence:**

1. "First I'll turn the fallbacks **off**." Uncheck the box. "That sets `position-try-fallbacks: none`."
2. "Now I'll drag the anchor into the top-left corner." Drag it. "There's no room above, so the tooltip gets stuck on top of the anchor, covering it. That's the broken version."
3. "Now I'll turn the fallbacks back **on**." Check the box. "It flips below the anchor and stays inside the box."
4. "Let me drag it to the other corners." Drag around. "It flips whenever it needs to, and that's with no JavaScript and no event listeners."

**Optional in DevTools:** select `.drag-tip`, uncheck `position-try-fallbacks` in the Styles panel, and show the same result.

"Compare that to the old way, where I'd have to measure the room on every side and swap classes in JavaScript."

---

## 11:00-12:30 Pairing with the `popover` attribute

**Open section 5. Show `index.html` and `styles.css`, VIDEO 11:00:**

```html
<button popovertarget="menu" class="menu-btn">Options</button>
<div id="menu" class="menu" popover>...</div>
```

```css
.menu-btn {
    anchor-name: --menu-btn;
}

.menu {
    position-anchor: --menu-btn;
    position-area: bottom span-right;
    width: anchor-size(width);
    margin: 0;
    position-try-fallbacks: flip-block;
}
```

"Anchor positioning only decides *where* something goes. The HTML `popover` attribute handles the rest of a menu: it shows and hides it, puts it in the **top layer** so it appears above everything, even fixed headers and dialogs, and closes it when you click outside or press Escape. Used together, they make a complete tooltip or dropdown with no JavaScript.

A few details. `bottom span-right` puts the menu under the button with its left edges lined up and extending to the right. `anchor-size(width)` makes the menu exactly as wide as the button, which is the other thing JavaScript used to do. And `margin: 0`, because popovers have automatic margins by default that would fight the positioning."

**Click the button.** "It opens right under the button, same width." Close it.

**Scroll until the button is near the bottom of the window and open it.** "Now there's no room below, so `flip-block` opens it upward."

"One thing I noticed: the course page's popover example writes `anchor-name` as an HTML attribute. That's not how it works. It's a CSS property, so I set it in my stylesheet, and that's the version in this demo."

---

## 12:30-13:30 Honest browser support

**Show `styles.css`, VIDEO 12:30, and the support line at the top of the page:**

```css
@supports not (anchor-name: --test) {
    .support-ok { display: none; }
    .support-missing { display: block; }
}
```

"Anchor positioning reached **Baseline** in January 2026: Chrome and Edge from version 125, Firefox from 147, and Safari 26. So it's supported by all the major browsers, but 'supported' isn't the same as 'identical'. Browsers still differ in how they handle overflow and in how `position-try-fallbacks` behaves, especially when the anchor is inside a scroll container. So the honest advice is to test in more than one browser and check Can I Use for current numbers.

For older browsers, `@supports` lets me detect it. The line at the top of my page uses exactly that: it shows a green message when the property is supported, and a warning when it isn't. For a real site I'd make sure the tooltip content is still usable without positioning, for example by showing it inline."

**Accessibility, briefly:** "One more thing the page doesn't cover. Anchor positioning is purely visual. It doesn't tell a screen reader that the tooltip belongs to the button. That's why my tooltips have `role="tooltip"` and the buttons use `aria-describedby`, and why the popover uses the real `popovertarget` attribute. Position with CSS, and connect them semantically with HTML."

---

## 13:30-14:00 Closing

"To wrap up: two properties connect a target to an anchor, `anchor-name` and `position-anchor`, and the target has to be absolute or fixed. You place it with `anchor()` for precision or `position-area` for readability. `position-try-fallbacks` keeps it on screen automatically. The popover attribute adds the top layer and dismissal. And it's supported across the major browsers, with a few differences, so test it. It replaces a whole category of JavaScript I used to need for tooltips and menus. Thanks for watching."

---

## Before you record

1. **Run the demo locally or live:** Open `unit-4/anchor-positioning-demo/index.html` through your live site or a local server, not by double-clicking the file, so the shared `css/main.css` and theme script load. Use Chrome or Edge 125+, Firefox 147+ or Safari 26.
2. **Timing:** This runs about 13-14 minutes at a clear pace. Time a practice run. If you're over 15, trim the `anchor()` explanation or the accessibility note.
3. **Practice the drag:** In section 4, make sure fallbacks are on when you start, and drag slowly into a corner.
4. **Add the demo to your homepage:** Link `unit-4/anchor-positioning-demo/index.html` from `index.html` and the README, and add a Unit 4 card if you want it listed.
5. **Check the claims:** I took the support versions and Baseline date from the course page. Confirm them on Can I Use before you record.
