---
name: Favour Israel Taiwo Portfolio
description: A sunlit courtyard under three silk banners, with real product screens in the light underneath.
colors:
  indigo: "#2b2f7f"
  indigo-deep: "#1f2263"
  madder: "#b23a65"
  saffron: "#f2b31a"
  plum: "#6a3d8f"
  umber: "#8a4a28"
  dusk: "#5b4a72"
  cloud: "#f7f6f2"
  sky: "#dde5f4"
  white: "#ffffff"
typography:
  display:
    fontFamily: "Jost, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 4.8vw, 4.75rem)"
    fontWeight: 300
    lineHeight: 1.1
    letterSpacing: "0.12em"
  headline:
    fontFamily: "Jost, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4.2vw, 3.75rem)"
    fontWeight: 300
    lineHeight: 1.12
    letterSpacing: "0.12em"
  title:
    fontFamily: "Jost, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.375
    letterSpacing: "0.2em"
  body-lead:
    fontFamily: "Jost, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
  body:
    fontFamily: "Jost, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Jost, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.28em"
  button:
    fontFamily: "Jost, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.28em"
rounded:
  sm: "2px"
  device: "1.1rem"
  panel: "2.5rem"
  full: "9999px"
spacing:
  gutter: "24px"
  panel: "40px"
  page: "48px"
  rail: "208px"
  control-height: "48px"
components:
  button-primary:
    backgroundColor: "{colors.indigo}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "0 32px"
    height: "{spacing.control-height}"
  button-primary-hover:
    backgroundColor: "{colors.indigo-deep}"
    textColor: "{colors.white}"
  button-secondary:
    backgroundColor: "{colors.cloud}"
    textColor: "{colors.indigo}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "0 32px"
    height: "{spacing.control-height}"
  button-secondary-hover:
    backgroundColor: "{colors.indigo}"
    textColor: "{colors.white}"
  field:
    backgroundColor: "{colors.white}"
    textColor: "{colors.indigo}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "0 16px"
    height: "{spacing.control-height}"
  project-card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.indigo}"
    rounded: "{rounded.sm}"
    padding: "24px"
  chat-starter:
    backgroundColor: "{colors.white}"
    textColor: "{colors.indigo}"
    rounded: "{rounded.sm}"
    padding: "12px 16px"
  chat-bubble-user:
    backgroundColor: "{colors.indigo}"
    textColor: "{colors.white}"
    rounded: "{rounded.sm}"
    padding: "10px 14px"
  chat-bubble-assistant:
    backgroundColor: "{colors.white}"
    textColor: "{colors.indigo}"
    rounded: "{rounded.sm}"
    padding: "10px 14px"
  tab-bar:
    backgroundColor: "{colors.indigo}"
    textColor: "{colors.white}"
---

# Design System: Favour Israel Taiwo Portfolio

## Overview

**Creative North Star: "The Silk Canopy"**

The site is a sunlit courtyard. The ground is a warm off-white. Three silk banners (indigo, madder pink, saffron yellow) hang across the top of each page and drift slowly. Real screens of real products sit in the light underneath them. Everything else is quiet: one typeface, one ink colour, thin lines.

Colour does one job. Indigo is the ink for every word, every line and every main control. Madder and saffron are the silk. Where two banners cross, the crossing is painted in an exact third colour, like two dyed cloths laid on top of each other. Away from the canopy, madder and saffron only show up as small signals: a focus ring, a text selection, the edge of a project card.

The layout is a set of ruled panels, not floating cards. Thin indigo lines divide the page into rooms. Type is light and wide: thin capital letters with lots of space between them. The system is light only. It was chosen in place of the dark developer site with a neon accent and a card grid.

**Key Characteristics:**
- Off-white ground, indigo ink, no grey anywhere.
- Three silk bands at the top of every page header, with painted crossings.
- One typeface (Jost) at weights 300, 400 and 500 only.
- Wide-tracked capitals for names, titles, labels and buttons.
- Panels divided by 1px indigo lines.
- Near-square corners (2px) on every control and card.
- Soft indigo-tinted shadows only under screenshots and floating things.

## Colors

A dyed-cloth palette: one deep indigo ink on a sun-white ground, with two bright silks and the colours they make where they cross.

### Primary
- **Indigo Ink** (`indigo`): all text, all dividing lines, filled buttons, the mobile tab bar, the phone frame border, and one of the three silk bands. Softer text is this same indigo at 85% opacity; lines are indigo at 25% to 40% opacity.
- **Deep Indigo** (`indigo-deep`): the hover state of the filled button, the text colour of selected text, and the faint fold shading on the silk.

### Secondary
- **Madder Silk** (`madder`): the pink silk band and one of the three project card edges. As a small signal it is also the focus ring, the text cursor in fields, form error text, and links inside project write-ups and chat replies.

### Tertiary
- **Saffron Silk** (`saffron`): the yellow silk band and one of the three project card edges. As a small signal it is also the text selection background, the active tab line on mobile, the rail dot on hover, and the 4px line on top of the chat panel. It never carries text.
- **Plum Chord** (`plum`): painted where indigo crosses madder.
- **Umber Chord** (`umber`): painted where madder crosses saffron.
- **Dusk Chord** (`dusk`): painted where indigo crosses saffron. It lives only inside the canopy drawing and has no Tailwind token.

### Neutral
- **Sun-White Ground** (`cloud`): the page background, the hero name panel, the outlined button, and the chat panel body.
- **Pale Sky** (`sky`): the top of the sky gradient behind the canopy and behind screenshots. It always fades down into the ground colour.
- **Paper White** (`white`): raised surfaces only: project cards, form fields, chat starter buttons, chat bubbles, screenshot frames. Also text on indigo.

### Named Rules
**The Indigo Ink Rule.** Every word and every line is indigo. Quieter text is indigo at lower opacity (85% for body, never below 75%). There is no grey and no black in this system.

**The Silk Only Rule.** Madder and saffron fill large areas only as silk: the canopy bands and the coloured edge of a project card. Anywhere else they are small signals a few pixels wide. They are never a button fill, a panel background or a heading colour.

**The Painted Chord Rule.** Where two silk bands cross, paint the crossing in its exact chord colour with a clipped shape. Do not use blend modes. Multiply turns indigo over madder nearly black.

## Typography

**Display Font:** Jost (with the system sans-serif stack as fallback)
**Body Font:** Jost
**Label Font:** Jost

**Character:** One geometric sans does everything. Hierarchy comes from size, capital letters and letter spacing, not from weight. Big type is thin and airy; small labels are tiny capitals spread wide.

### Hierarchy
- **Display** (300, `clamp(2.5rem, 4.8vw, 4.75rem)`, line-height 1.1, uppercase, 0.12em tracking): the name on the home page. Page titles ("Work", "Say hello") use the same style at `clamp(2.5rem, 5vw, 4.5rem)` with 0.16em tracking.
- **Headline** (300, `clamp(2rem, 4.2vw, 3.75rem)`, line-height 1.12, uppercase, 0.12em tracking, balanced wrapping, max 22 characters wide): the project name on a project page.
- **Title** (500, 0.875rem, line-height 1.375, uppercase, 0.2em tracking): project names on cards and rows. The single featured project uses 1rem with 0.3em tracking.
- **Body Lead** (400, 1.125rem, line-height 1.625): the one or two sentences under a page title, the tagline, and email links. Kept to 52 to 65 characters wide.
- **Body** (400, 1rem, line-height 1.625, indigo at 85%): descriptions and panel text. Cards and chat starters step down to 0.9375rem. Long write-ups are capped at 70 characters wide.
- **Label** (400, 0.6875rem, line-height 1, uppercase, 0.28em tracking): panel headings, form labels, rail menu items, social links, dates, "View project".
- **Button** (400, 0.75rem, uppercase, 0.28em tracking): button text only.

Headings inside project write-ups are uppercase, weight 400, 0.14em tracking.

### Named Rules
**The Thin Capitals Rule.** Display type is weight 300, uppercase and wide-tracked. Nothing in the system is heavier than 500. Only weights 300, 400 and 500 are loaded, so anything bolder would be faked by the browser.

**The One Label Rule.** There is one small-caps label style (0.6875rem, 0.28em). Use it for every label. Panel headings are this label on top of a 1px indigo line, set as real headings.

## Layout

The page is a courtyard with a wall on the left. On desktop (1024px and up) a fixed rail 208px wide holds the wordmark at the top, the dot-and-line menu in the middle and the Lagos clock at the bottom. Content fills the rest. The home hero slides under the rail so the name panel and the silk reach the left edge.

Below the hero, content is a stack of full-width bands split into panels by 1px indigo lines (40% opacity). Panels sit side by side in uneven columns, for example 1.5 to 1.4 for featured work and 1.2 to 1 to 1 for the three home panels. There is no outer container and no centred column; panels run edge to edge.

Padding is 24px on phones. On desktop it is 40px inside home panels and 48px on page headers and the projects and contact pages. Page headers leave 160px (192px on desktop) of clear space at the top for the silk.

The home hero is `min(76dvh, 740px)` tall with a 600px minimum on desktop. It splits 46% for the name and the rest for screens, tagline and buttons.

On phones the rail is replaced by a fixed indigo tab bar at the bottom with four items: Home, Work, AI chat, Contact. Panels stack and the dividing lines turn from vertical to horizontal. Project cards go from one column to two at 640px and three at 1280px.

**The Ruled Panel Rule.** Sections are separated by a 1px indigo line, never by a gap, a background change or a shadow.

## Elevation & Depth

The ground is flat. Panels and cards have no shadow; a card is a white surface with a 1px indigo border. Depth is saved for things that sit above the ground: screenshots, the hero name panel, and floating chat pieces. Their shadows are tinted indigo, never black, with a large blur and a negative spread so they read as soft daylight shade.

### Shadow Vocabulary
- **Screen shade** (`box-shadow: 0 30px 60px -28px rgba(43,47,127,0.55)`): under hero screens and project page screenshots. Cover images on cards use a slightly smaller version (`0 24px 48px -24px rgba(43,47,127,0.55)`).
- **Panel shade** (`box-shadow: 18px 18px 60px -34px rgba(43,47,127,0.45)`): under the hero name panel, desktop only.
- **Float shade** (`box-shadow: 0 32px 64px -24px rgba(43,47,127,0.6)`): the open chat panel. The chat launcher uses `0 18px 40px -16px rgba(43,47,127,0.7)` and toasts use `0 18px 40px -20px rgba(43,47,127,0.5)`.

### Named Rules
**The Daylight Shade Rule.** Shadows are indigo-tinted and only go under screenshots and floating things. Cards, fields and buttons stay flat; they change border or fill on hover, not height.

## Shapes

Controls and cards are almost square: a 2px corner on buttons, fields, cards, chat bubbles, screenshot frames and the chat panel. Three shapes are allowed to be round, and each one draws a real object:

- The phone frame: 1.1rem corners with a 4px solid indigo border.
- The hero name panel: one 2.5rem curve on its lower right corner, desktop only.
- The rail menu dots: 10px circles with a 1px indigo border.

Borders are always 1px indigo at reduced opacity (30% on cards and frames, 40% on fields and panel lines, 25% on row dividers and the footer line). On hover or focus the border goes to full indigo.

The silk bands are long curved shapes that run off the top and right edges of the header. They are the only large curves in the system.

## Components

### Buttons
Calm, square and exact.
- **Shape:** near-square (2px corner), 48px tall, 32px side padding, text never wraps.
- **Primary:** indigo fill with white button text. Hover goes to deep indigo.
- **Secondary:** sun-white fill, 1px indigo border, indigo text. Hover fills with indigo and turns the text white.
- **Press / Disabled:** scales to 0.97 on press. Disabled is 50% opacity with a not-allowed cursor.
- **Motion:** transform, background and text colour over 200ms with the strong ease-out curve `cubic-bezier(0.23, 1, 0.32, 1)`.
- **Arrow link:** a text link in the label style with an 8px underline offset; the underline appears on hover. On cards and rows it is followed by a thin line arrow (18px, 1.25 stroke) that slides 6px right on hover.

### Cards / Containers
- **Project card:** white surface, 1px indigo border at 30%, 2px corner, 24px padding, no shadow. A silk-coloured strip takes the right 14% of the card. The strip colour cycles indigo, madder, saffron by position.
- **Hover:** the border goes to full indigo and the silk strip widens to 1.6 times its width over 500ms, sweeping in from the right. Press scales the card to 0.99.
- **With cover:** on the projects page the card opens with a 256px cover: a sky-to-ground gradient with the screenshot framed inside. Landscape shots get a thin browser-style frame; portrait shots get the phone frame.
- **Project row:** for projects without screenshots. A three-column line (name, summary, arrow) divided by 1px lines; the row turns white on hover.

### Inputs / Fields
- **Style:** white fill, 1px indigo border at 40%, 2px corner, 48px tall, 16px side padding, 1rem indigo text. Placeholder is indigo at 80%. The text cursor is madder.
- **Focus:** the border goes to full indigo over 150ms.
- **Labels:** the label style, set 12px above the field.
- **Error:** a 0.875rem madder message 8px under the field. Server errors show as a toast, not inline.

### Navigation
- **Rail menu (desktop):** label-style items in a column, each with a 10px outlined dot on a 1px vertical line. The current page's dot is filled indigo. On hover the dot fills saffron and grows to 1.25 times.
- **Wordmark:** weight 300, 1.125rem, uppercase, 0.42em tracking, indigo. On phones it sits over the silk in white.
- **Tab bar (phones):** fixed to the bottom, indigo fill, white line icons (20px, 1.5 stroke) over small uppercase labels. The active tab has a 2px saffron line on its top edge.
- **Focus:** every focusable thing gets a 2px madder outline, 3px away from the element.

### Silk Canopy (signature)
Three curved bands (saffron, indigo, madder) drawn as one SVG at 94% opacity, over a sky-to-ground gradient. Crossings are painted in the chord colours with clipped shapes. A faint deep-indigo gradient adds a fold to the madder and saffron bands.
- **Motion:** the whole cloth drifts as one piece on a 14s ease-in-out loop that runs back and forth (18px across, 10px down, 1.2 degree skew). It also leans up to 28px toward the pointer on a soft spring (stiffness 40, damping 14).
- **Reduced motion:** both the drift and the lean stop.
- **Placement:** top of every page header. 224px tall on phones; 60% of the hero on the desktop home page; 256px on other desktop pages.

### Device Screens (signature)
A browser-shaped screenshot (16:10, 2px corner, 1px indigo border) with a phone screenshot (9:19, phone frame) overlapping its lower right corner. Both carry the screen shade. This pairing shows web and mobile together. If a screenshot is missing, the slot shows a pale sky fill with a plain label saying it is to come.

### Chat
- **Starter buttons:** white, 1px indigo border at 30%, 2px corner, 12px by 16px padding, 0.9375rem text. Hover takes the border to full indigo; press scales to 0.98.
- **Panel:** sun-white body, 1px indigo border, 2px corner, float shade, with a 4px saffron line across the top. 380px wide on desktop, nearly full width on phones. It opens with a 200ms fade and scale from the lower right.
- **Bubbles:** the visitor's messages are indigo with white text; replies are white with indigo text and a 1px border. Both have 2px corners.
- **Launcher (desktop):** a 56px indigo square with a white icon. It lifts 2px on hover.

### Local Time
A thin sun icon (26px, 1 stroke) beside two label lines: the city and the current time with fixed-width numerals. It sits at the bottom of the rail.

## Do's and Don'ts

### Do:
- **Do** set every word and every line in indigo, and use indigo at 85% for quieter text.
- **Do** open each page with the silk canopy over the sky-to-ground gradient, and leave clear space under it.
- **Do** divide sections with 1px indigo lines at 40% opacity.
- **Do** use the one label style (0.6875rem, uppercase, 0.28em) for every small label.
- **Do** keep controls 48px tall with 2px corners.
- **Do** tint shadows indigo and keep them under screenshots and floating things.
- **Do** give each project card one silk colour, cycling indigo, madder, saffron.
- **Do** show a web screen and a phone screen together when a product has both.
- **Do** stop the silk drift and lean when the visitor asks for reduced motion.
- **Do** use the strong ease-out curve at 200ms for controls and 150ms for colour-only changes.

### Don't:
- **Don't** use grey, black or pure black shadows. The system has no neutral ink.
- **Don't** use madder or saffron as a button fill, a panel background or a heading colour.
- **Don't** set text in saffron.
- **Don't** use blend modes for silk crossings; paint the chord colour.
- **Don't** use a font weight above 500, or a second typeface.
- **Don't** round corners beyond 2px, except the phone frame, the hero name panel and the rail dots.
- **Don't** put shadows on cards, buttons or fields.
- **Don't** build a dark theme. The world is daylight, and this was the owner's choice.
- **Don't** fill empty screenshot slots with made-up images. Say plainly that the screenshot is to come.
