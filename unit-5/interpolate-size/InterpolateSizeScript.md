# interpolate-size: Video Script

Teaching video for the interpolate-size choose topic. Target length: 13-14 minutes (requirement: 12-15).
Demo: `unit-5/interpolate-size/index.html`. Record in Chrome or Edge, which support the property. The CSS you show is at the top of `styles.css`, in the same order as this script. Look for the VIDEO banners. Everything under "SKIP ON CAMERA" is layout and theming.

## Checklist coverage

| Teaching Video Checklist item | Where it is covered |
|---|---|
| 1. Why `height: auto` has no midpoint unless the browser can resolve keywords | 0:45-2:30 |
| 2. What `allow-keywords` opts into, and why `:root` | 2:30-4:30 |
| 3. Why `max-height` stalls compared to a true height-to-auto transition | 7:30-9:00 |
| 4. The progressive enhancement stack: native `details`, CSS, optional `CSS.supports()` fallback | 11:00-12:30 |
| 5. Why `overflow: hidden`, `details[open]` and `prefers-reduced-motion` belong in every pattern | 4:30-7:30 |
| 6. Portfolio demo: accordion with at least three panels that animate open and closed | The whole demo page (four panels) |

The course page's suggested opening, used in section 1: toggle a panel before `interpolate-size` is set, then turn it on and show the jump become a smooth slide.

## What the demo controls do

- **`interpolate-size: allow-keywords` checkbox:** turns the opt-in on and off (off sets the default value, `numeric-only`).
- **`animate the ::details-content box` checkbox:** switches between the plain course pattern and the fix I found (section 4).
- **Speed:** Normal (0.35s), Slow motion (1.5s) or Very slow (3s). Use slow motion on camera so viewers can follow it.

## Numbers from my testing (Chrome 152, speed set to Very slow, 3s)

Heights of the whole details box in pixels, closed height 59.6px.

| Pattern | Opening | Closing |
|---|---|---|
| Fix applied (`::details-content` + `interpolate-size`) | 105 at 0.5s, 250 at 2s, 265 at the end | holds 265 at 0.1s, 147 at 1.5s, 59.6 at the end |
| Plain course pattern (`.panel` only) | 263 already at 0.5s (instant) | 59.6 at 0.1s (instant) |
| `max-height: 100rem` | **178 (fully open) by 0.5s** of a 3s transition, then nothing | stays at 178 for about 2s, then drops at the end |
| `height: auto` | 62 at 0.5s, 96 at 1s, 160 at 2s, 178 at 3s | 178 at 1s, 80 at 2s, 59.6 at the end |

---

## 0:00-0:45 Introduction

"Hi, I'm Jaeden. For my choose topic I'm covering `interpolate-size`, a CSS property that lets you animate an element to `height: auto`.

If you've ever built an accordion or a dropdown, you've probably wanted a panel to slide open smoothly, and CSS couldn't do it for decades. In this video I'll explain why, show what `interpolate-size` changes, compare it with the old `max-height` trick, walk through the full accordion pattern, and share something I ran into that the course page doesn't mention. Everything I show is in a demo on my portfolio."

**Show the demo page, top to bottom.** Point at the green line: "Your browser supports interpolate-size."

---

## 0:45-2:30 Why `auto` has never been animatable

**Scroll to the Controls and the accordion. Untick `interpolate-size: allow-keywords`. Set the speed to Normal.**

"First, the problem. I've turned the opt-in off. Watch what happens when I open a panel."

**Click a panel.** "It jumps. No animation at all."

"Here's why. CSS transitions work by interpolating between a start value and an end value. Halfway between 0 and 100 is 50, so the browser needs two concrete numbers. But `height: auto` isn't a number. It's an instruction: work out the height from the content. The browser can't know that until layout runs. So a transition from `height: 0` to `height: auto` has no midpoint to calculate, and the property just flips instantly.

The old workarounds were awkward. You could animate `max-height` to some big number, which I'll show in a minute, and it has real problems. Or you could write JavaScript that measures `scrollHeight` and sets a pixel height. That works, but it's a lot of script for something that should be pure CSS."

---

## 2:30-4:30 `interpolate-size: allow-keywords`

**Show `styles.css`, VIDEO 2:30:**

```css
:root {
    interpolate-size: allow-keywords;
}
```

"This one line is the fix. `interpolate-size` tells the browser whether it may animate to and from size keywords. The default value is `numeric-only`, which is what I just demonstrated: only real numbers can animate. Setting it to `allow-keywords` opts in. The browser then treats `auto`, `min-content` and `max-content` as animatable endpoints, by working them out to real numbers before it interpolates.

And I put it on `:root` because the property is **inherited**. Set it once on the root element and every element on the page gets the behavior. That's the usual pattern. You can also set it on one component if you want to limit where it applies."

**Tick the checkbox back on. Open a panel at Slow motion speed.**

"Same panel, same CSS for the height. Now it slides."

---

## 4:30-7:30 The height-to-auto pattern

**Show `styles.css`, VIDEO 4:30:**

```css
.panel {
    height: 0;
    overflow: hidden;
    transition: height 0.35s ease;
}

details[open] .panel {
    height: auto;
}

@media (prefers-reduced-motion: reduce) {
    .panel {
        transition: none;
    }
}
```

"This is the pattern from the course page, and there are three pieces that belong in every animated disclosure.

**The state comes from `details[open]`.** I'm using the native `details` and `summary` elements, so the browser keeps track of open and closed. When you click the summary, it adds the `open` attribute, and my CSS responds to that attribute. There's no JavaScript. The browser handles the state, and CSS handles the look.

**`overflow: hidden` clips the content.** While the panel is only 20 pixels tall, the text inside it is still its full size. Without `overflow: hidden`, the whole text would show at full height while the panel animates, and it would spill out over everything below.

**And `prefers-reduced-motion`.** Some people get dizzy or distracted by animation, and they turn on a setting in their operating system to say so. This media query reads that setting and turns the transition off, so the panel just opens instantly for them. It's a small block, and it's an accessibility requirement for any animated pattern."

**To demo reduced motion:** DevTools, `Ctrl+Shift+P`, type "Emulate CSS prefers-reduced-motion", choose "reduce", and open a panel. It opens with no animation.

---

## 7:30-9:00 Why `max-height` stalls

**Scroll to "height: auto versus max-height." Set the speed to Very slow.**

"Before `interpolate-size`, the standard trick was animating `max-height`. A number can be interpolated, so you set `max-height` to something big. Let me show why that's a poor fit. Both panels have the same content, about 100 pixels tall."

```css
.cmp-max[open]::details-content  { max-height: 100rem; }   /* a guess: 1000px */
.cmp-auto[open]::details-content { height: auto; }
```

**Open the `max-height` panel first.**

"The transition travels all the way to 1000 pixels, but the content is only about 100 tall. So the panel is fully open after roughly 15 percent of the animation, and then nothing visible happens for the rest of the time. I measured it: with a three-second transition, it was fully open by half a second. The easing is also wrong, because the curve is applied across the whole 1000 pixels, not the 100 you can see. And closing is worse. The panel hovers at full size for about two seconds before it starts to shrink."

**Open the `height: auto` panel.**

"Now the real thing. The transition travels exactly as far as the content is tall, so the motion fills the whole duration and finishes exactly when the panel is fully open. It's smooth in both directions."

---

## 9:00-11:00 What I found: the course pattern isn't enough in newer Chrome

**Scroll to the accordion. Untick "animate the ::details-content box". Set the speed to Slow motion.**

"Here's something the course page doesn't mention, and I found it by testing. This is the pattern exactly as published, with the second checkbox off. Watch."

**Open a panel, then close it.** "It opens with a jump, and it snaps shut. No animation in either direction, even though `interpolate-size` is on."

"Here's what's happening. In newer versions of Chrome, the content of a `details` element sits inside a special box called `::details-content`, and when the details is closed, that box stops rendering its contents right away. So my `.panel` transition happens inside something that's already hidden, and you never see it."

**Tick the checkbox back on. Show `styles.css`, VIDEO 7:30:**

```css
details::details-content {
    height: 0;
    overflow: clip;
    transition:
        height 0.35s ease,
        content-visibility 0.35s allow-discrete;
}

details[open]::details-content {
    height: auto;
}
```

"The fix is to animate that `::details-content` box instead. It's the same height-to-auto idea, with `interpolate-size` still doing the work. The new part is also transitioning `content-visibility` with `allow-discrete`, which keeps the content rendered while it shrinks, so the closing animation can play.

One more detail: the `.panel` stops animating in this version. If both the box and the panel have a height transition, they fight each other. The box's `auto` height depends on the panel's current height, which is also changing, and the opening gets sluggish. So one of them does the animating."

**Open and close a panel.** "Smooth in both directions."

"I believe `::details-content` arrived in Chrome 131, but check MDN to confirm. On Chrome 129 and 130, the course's plain pattern worked, so the fix is an enhancement on top."

---

## 11:00-12:30 The progressive enhancement stack

**Show `app.js`.**

"The way I think about this is as layers, and each one works without the next.

**Layer one is native HTML.** The `details` and `summary` elements work in every browser with no JavaScript and no CSS animation support. In a browser that doesn't support `interpolate-size`, the panels still open and close. They just do it instantly.

**Layer two is the CSS animation.** In supporting browsers, `interpolate-size` plus the height transition makes it smooth. The animation is an enhancement, not a requirement.

**Layer three is optional.** If you really need the animation in older browsers, there's a JavaScript fallback:"

```javascript
if (!CSS.supports('interpolate-size', 'allow-keywords')) {
    document.querySelectorAll('.accordion details').forEach((details) => {
        const panel = details.querySelector('.panel');
        details.addEventListener('toggle', () => {
            panel.style.height = details.open ? panel.scrollHeight + 'px' : '0';
        });
    });
}
```

"It measures the panel with `scrollHeight` and sets a pixel height, the old approach. The important part is the `CSS.supports()` check around it. That inline height would conflict with `height: auto` in a browser that supports the property, so the fallback must only run where it's missing. In supporting browsers, this block never runs."

**Point at the green "supports" line, and the `@supports not` rule in `styles.css`, VIDEO 11:30:**

```css
@supports not (interpolate-size: allow-keywords) {
    .support-yes { display: none; }
    .support-no { display: block; }
}
```

"The same check in CSS: on an unsupported browser this swaps the green message for a warning. To show the unsupported behavior, I'll turn the opt-in checkbox off, which is the same as an unsupported browser. The panels still work, they just jump. That's a simulation, not a real unsupported browser."

---

## 12:30-13:30 Honest browser support

"Support is still limited. The course page says Chrome and Edge added it in version 129 in late 2024, and that Firefox and Safari don't support it yet. That could have changed, so check Can I Use before you rely on it. I only tested in Chrome, version 152.

The good news is that because of the layers I just described, an unsupported browser isn't broken. It gets a working accordion that opens instantly, and the people on Chrome and Edge get the animation."

---

## 13:30-14:00 Closing

"To wrap up: `height: auto` can't animate because it isn't a number. Setting `interpolate-size: allow-keywords` on `:root` lets the browser resolve keywords to real values, so height-to-auto transitions work, with none of the guesswork of `max-height`. A good pattern uses native `details` for state, CSS for the animation with `overflow: hidden` and a reduced-motion block, an optional `CSS.supports()` fallback, and in newer Chrome you animate `::details-content` so it works in both directions. Thanks for watching."

---

## What I'd add if I recorded it again

- **Exclusive accordions:** Giving several `details` elements the same `name` attribute makes opening one close the others, with no JavaScript.
- **Other keywords:** The same opt-in works for `min-content` and `max-content`, and for width.
- **Keyboard and screen readers:** `summary` is focusable and works with Enter and Space by default, which is a big reason to use native elements instead of a `div` accordion.

## Before you record

1. **Browser:** Use Chrome or Edge. In Firefox or Safari, the demo shows the red "not supported" line and the panels open instantly, which is also a useful clip.
2. **Support claims:** The version numbers (129 for `interpolate-size`) come from the course page, and the "131" for `::details-content` is from my own knowledge. Confirm both on MDN and Can I Use.
3. **Numbers:** The pixel measurements in the table are from my test. Yours will differ slightly, so don't read them out as exact on camera, or measure your own.
4. **Timing:** Do a practice run. The requirement is 12-15 minutes.
5. **Homepage and README:** The demo isn't linked from your homepage or README yet.
