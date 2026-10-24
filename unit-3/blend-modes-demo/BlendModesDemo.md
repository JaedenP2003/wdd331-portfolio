# Teaching Video Script: CSS Blend Modes
**Target length:** ~14 minutes (about 1,850 spoken words at a relaxed pace)
**Demo:** open `index.html` (use Live Server in VS Code). Pre-set the scheme to ☀️ Light.
**Voice:** a college student sharing what they just figured out. Casual and honest, not a lecture. Say it in your own words and don't read it word for word.

Cues: **[SCREEN]** = what to show. **[DO]** = action. Spoken lines are plain text.

### CSS finder: where to look in `styles.css` during the video
The top ~97 lines of `styles.css` are the code you show, in video order. Each chunk has a `▶ VIDEO` banner, so you can press Ctrl+F, type `▶ VIDEO 1:00`, and land right on it. Everything under the `SKIP ON CAMERA` banner is just layout and theming.

| Video time | Search for | Line | What to say while it's on screen |
|---|---|---|---|
| 1:00 inward vs. outward | `▶ VIDEO 1:00` | 17 | `.inward` blends its own layers; `.outward__tint` blends with what's behind it |
| 3:30 four families | `▶ VIDEO 3:30` | 36 | Optional. The mode is set per tile inline in `index.html` (`style="background-blend-mode: screen"`). Demo only is fine. |
| 6:30 hero overlay | `▶ VIDEO 6:30` | 9 and 49 | Start at the `:root` variables (line 9), then jump down to `.hero` (line 49) and the gradient version just below it |
| 9:30 risky text | `▶ VIDEO 9:30` | 65 | `.textbox--risky` vs. `.textbox--safe` |
| 11:30 isolation | `▶ VIDEO 11:30` | 84 | `.iso-glow` has `color-dodge`; `.iso-card.is-isolated` has the one-line fix. The checkbox adds that class. |

Tip: before recording, zoom VS Code to ~150% (Ctrl + `+`) so the code is readable on video, and keep the demo page in a second window so you can switch back and forth.

---

## 0:00–1:00 · Intro and roadmap

**[SCREEN]** Demo page top, hero visible.

Hey everyone! So this week I got into CSS blend modes, and honestly, I think they're one of the coolest things I've learned in this class. It's basically Photoshop-style effects, but with a few lines of CSS and no image editing.

Here's what we're covering. One: the difference between `mix-blend-mode` and `background-blend-mode`, because I mixed those up at first. Two: the main families of blend modes. Three: how to build a real hero overlay. Four: why blending text can wreck your accessibility. And five: `isolation: isolate`, which fixed a bug that had me confused for way too long.

Everything is in this one demo page, so you can follow along.

---

## 1:00–3:30 · The big idea: inward vs. outward  (Checklist #1)

**[SCREEN]** Scroll to section 3, "Inward vs. outward."

Okay, so this is the thing that made it all click for me. A blend mode takes a top layer and a bottom layer and does math on the pixels. Multiply, screen, overlay: they're just different formulas for combining the two colors.

So the real question is, *which two layers are we talking about?* That's the whole difference between these two properties.

**`background-blend-mode` is inward.** It blends an element's own background layers with each other. Like a background color and a background image on the same element. That's it. Nothing outside the element gets involved.

**[DO]** Point at the left panel.

Check out the left panel. This box has an orange background color and the photo, blended with multiply. Behind it are these super loud stripes, and see how they don't change anything? The element only talks to itself.

**`mix-blend-mode` is outward.** It blends the whole element with whatever's painted *behind* it.

**[DO]** Point at the right panel.

On the right, this tinted box covers the left half of the photo. Same orange, same multiply, but now it's blending with the picture underneath. Same color, different layers.

So the way I remember it: **inward** is a background blending with its own layers, and **outward** is an element blending with its surroundings.

**[SCREEN]** Show the CSS for the left panel. Say:

```css
.inward { background-color: var(--overlay);
          background-image: url(hero.jpg);
          background-blend-mode: multiply; }
.outward__tint { mix-blend-mode: multiply; }
```

One's a background property and one's an element property. If you keep that straight, you won't mix them up like I did.

---

## 3:30–6:30 · The four families, live  (Checklist #2)

**[SCREEN]** Scroll to section 2, "Four families, same photo."

There are 16 blend modes, which sounds like a lot to memorize, and I was not about to do that. But they come in families, so if you get one from each family, you basically get them all. Every tile here is the same photo and the same orange layer. Only the mode changes.

**Darken: multiply.** Multiply can only make things darker. White leaves the photo alone and black stays black. I think of it like stacking two sheets of colored plastic and holding them up to a window. It's great for color washes and shadows. Darken and color-burn are its cousins.

**Lighten: screen.** Screen is the opposite. It can only make things lighter. Picture two projectors aimed at the same wall. It's great for glows and light effects. Its cousins are lighten and color-dodge.

**Contrast: overlay.** This is my favorite. It multiplies the dark parts and screens the light parts, so it adds contrast but keeps the photo's mid-tones. Look at this tile, it still looks like a real photo, just with a mood on it. Hard-light and soft-light are variations of this.

**Component: color.** This family works with hue, saturation and luminosity. `color` keeps the photo's brightness but swaps in the layer's hue and saturation. It's basically a recolor. You can still see all the detail, but the whole scene's been dyed.

**[SCREEN]** Quick scroll to "Blend Mode Comparison" at the bottom.

And here are all 16 at once. Same photo, same color. If you click a tile, it sends that mode up to the hero, which is a really good way to audition them. (Difference and exclusion are kind of the weird ones. They invert colors. I just wanted to show where they fit.)

**[DO]** Click `luminosity`, then `multiply`, then scroll to the top.

---

## 6:30–9:30 · Building the hero overlay  (Checklist #3)

**[SCREEN]** Section 1 at the top. Open `styles.css` side by side.

Alright, the part you'd actually use on a real site: a hero section with a tinted photo. And I wanted to do it in a way that's easy to maintain, so I start with one custom property for the overlay color.

**[SCREEN]** `:root { --overlay: #c2410c; }`

Just one variable. Everything uses it, so if I want to change the brand color later, that's a one-line change.

**[SCREEN]** Show the `.hero` rule.

```css
.hero {
  background-color: var(--overlay);
  background-image: url("hero.jpg");
  background-size: cover;
  background-blend-mode: multiply;
}
```

The color is the background color, so it's the bottom layer. The photo sits on top. Then `background-blend-mode: multiply` combines them. There's no extra overlay div, no pseudo-element, no opacity hacks. The heading and button are just regular HTML sitting on top.

**[DO]** Use the color picker to change the overlay color to blue, then a green, then back to orange.

See how the whole hero changes instantly? That's the custom property doing its thing.

**[DO]** Change the mode dropdown from multiply to overlay, then to color.

Different mode, totally different feel. Multiply is dark and moody. Overlay is punchy. Color is a clean tint.

**[DO]** Check "Gradient instead of flat color."

If you want something fancier, swap the flat color for a gradient. Now the background has two layers, a gradient on top and the photo below, and the blend mode combines those.

```css
background-image: linear-gradient(to top, var(--overlay), #6d28d9), url("hero.jpg");
```

And since the assignment says to test light, dark and system default, let me flip through those.

**[DO]** Click 🌖 Dark, then ⚙️ System default, then ☀️ Light.

The hero looks the same because the blend is part of the image itself. What changes is the page around it, and that's driven by CSS variables that respond to `prefers-color-scheme`. So light, dark and system default all work.

---

## 9:30–11:30 · The accessibility problem with blended text  (Checklist #4)

**[SCREEN]** Section 4.

Okay, now a warning. It's really tempting to put `mix-blend-mode` on text because it looks so cool. Here's why I'd think twice.

On the left, this text has `mix-blend-mode: difference`. Its color is calculated from whatever's behind it.

**[DO]** Slowly drag the slider from left to right.

Watch what happens as I slide the text across the photo. Over the sky, it's one color. Over the mountains, it's something else. Over the sun, it almost vanishes. I literally can't tell you what color this text is, which means I can't tell you the contrast ratio. And WCAG wants 4.5 to 1 for body text.

It also depends on the photo. If someone swaps the image, or the user's in dark mode, the contrast changes. You can't test every combination.

**[DO]** Point at the right side.

Now the right side. Here I use `background-blend-mode` to darken the *background*, and the text is just plain white. Text color is fixed, background is predictably dark, so the contrast is predictable too. I can check it once with a contrast checker and trust it.

So my rule is: **blend the background, not the text.** Get the look with `background-blend-mode` and keep your text a normal solid color. If you do use `mix-blend-mode` on text, keep it big and decorative, and never make it the only way to read something important.

---

## 11:30–14:00 · `isolation: isolate` and the colors-explode problem  (Checklist #5)

**[SCREEN]** Section 5. Make sure the checkbox is unchecked.

Last topic, and this is the one that got me. Say you've got a card, and inside it there's a decorative glow using `mix-blend-mode: color-dodge`. You'd expect that glow to only affect the card, right?

**[DO]** Point at the screen.

Nope. Look at this. The glow is a flat orange layer, but it's blending with *everything behind it*, including this rainbow page background. The colors just exploded. The photo's washed out and the halo went white and neon. That's color-dodge doing math against colors I never meant it to see.

**Why does this happen?** A blended element blends with everything behind it, up to the nearest *stacking context*. Our card isn't one, so the blend goes right through the card and into the page.

**[SCREEN]** Show the CSS.

```css
.iso-card.is-isolated { isolation: isolate; }
```

**[DO]** Check the `isolation: isolate` box.

One line. Watch the card. Boom, fixed. The page behind it is out of the blend and the glow is flat orange. `isolation: isolate` creates a new stacking context without changing how anything looks or is positioned. It's like putting up a wall: blending inside the card stays inside the card.

**[DO]** Toggle it on and off twice so people see the contrast.

So now, any time I put a blend-mode element inside a component, like a card, a hero or a modal, I add `isolation: isolate` to the *container*. It's cheap, it's safe, and it makes the component look the same on any background.

(If your blend ever looks weird in dark mode, try isolation first.)

---

## 14:00–14:45 · Wrap-up

**[SCREEN]** Hero at the top.

Quick recap. `background-blend-mode` is inward and `mix-blend-mode` is outward. Learn one mode from each family: multiply, screen, overlay and color. Build your hero from one custom property and `background-blend-mode`. Blend backgrounds, not text. And put `isolation: isolate` on the container so your blends don't escape.

The demo and code are in my portfolio repo. Thanks for watching, and I'll see you in the next one!

---

## Timing cheat sheet

| Segment | Start | Length |
|---|---|---|
| Intro | 0:00 | 1:00 |
| Inward vs. outward | 1:00 | 2:30 |
| Four families | 3:30 | 3:00 |
| Hero overlay | 6:30 | 3:00 |
| Text accessibility | 9:30 | 2:00 |
| Isolation | 11:30 | 2:30 |
| Wrap-up | 14:00 | 0:45 |

If you run long, trim the "All 16" tour and the gradient variant. If you run short, add a second family member to each tile (darken, color-dodge, hard-light, luminosity).

## Checklist coverage

1. mix vs. background-blend-mode, inward vs. outward: 1:00
2. Three or more modes across families, live: 3:30 (all four families)
3. Working hero overlay with `background-blend-mode`: 6:30
4. Why `mix-blend-mode` on text is risky: 9:30
5. `isolation: isolate` and "colors explode": 11:30
