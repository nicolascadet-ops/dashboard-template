---
name: Pulse
description: A calm sales analytics dashboard where the data carries the page, in light and dark.
colors:
  page: "#f4f4f1"
  surface: "#fcfcfb"
  surface-2: "#efeee9"
  text: "#0b0b0b"
  text-2: "#52514e"
  muted: "#6e6c66"
  line: "#e1e0d9"
  axis: "#c3c2b7"
  series-1: "#2a78d6"
  compare: "#a9a79f"
  btn: "#2a78d6"
  focus: "#2a78d6"
  good: "#006300"
  good-bg: "#e3f3e3"
  warning: "#8a5a00"
  warning-bg: "#fdf1d3"
  critical: "#b42d2d"
  critical-bg: "#fbe5e5"
  neutral-bg: "#ecebe6"
  page-dark: "#0d0d0d"
  surface-dark: "#1a1a19"
  surface-2-dark: "#242423"
  text-dark: "#ffffff"
  text-2-dark: "#c3c2b7"
  muted-dark: "#9a988f"
  line-dark: "#2c2c2a"
  axis-dark: "#383835"
  series-1-dark: "#3987e5"
  compare-dark: "#6b6a64"
  btn-dark: "#256abf"
  focus-dark: "#6aa8f0"
  good-dark: "#3fbf3f"
  good-bg-dark: "rgb(12 163 12 / .16)"
  warning-dark: "#fab219"
  warning-bg-dark: "rgb(250 178 25 / .14)"
  critical-dark: "#f07a7a"
  critical-bg-dark: "rgb(208 59 59 / .2)"
  neutral-bg-dark: "#2c2c2a"
typography:
  headline:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "24px"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  kpi:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "28px"
    fontWeight: 650
    lineHeight: 1.15
    letterSpacing: "-0.02em"
    fontFeature: "tnum"
  title:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  body:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.5
  mono:
    fontFamily: "ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "13px"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  pill: "99px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "20px"
  xl: "28px"
components:
  button-primary:
    backgroundColor: "{colors.btn}"
    textColor: "#ffffff"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "0 14px"
    height: "36px"
  button-ghost:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "0 14px"
    height: "36px"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "18px 20px"
  kpi-tile:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "16px 18px"
  segmented-option-active:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    height: "30px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "38px"
  status-good:
    backgroundColor: "{colors.good-bg}"
    textColor: "{colors.good}"
    rounded: "{rounded.pill}"
    height: "24px"
  status-warning:
    backgroundColor: "{colors.warning-bg}"
    textColor: "{colors.warning}"
    rounded: "{rounded.pill}"
    height: "24px"
  status-critical:
    backgroundColor: "{colors.critical-bg}"
    textColor: "{colors.critical}"
    rounded: "{rounded.pill}"
    height: "24px"
  status-neutral:
    backgroundColor: "{colors.neutral-bg}"
    textColor: "{colors.text-2}"
    rounded: "{rounded.pill}"
    height: "24px"
---

# Design System: Pulse

## Overview

**Creative North Star: "The Quiet Instrument"**

Pulse is an operations dashboard that stays out of the way of its numbers. The chrome is warm off-white paper and hairline borders; the only saturated colour on a normal screen is one blue data series (plus status colours where a status exists). Cards sit flat on the page, axes recede, and every figure uses tabular numerals so columns read like a ledger.

Density is moderate and even: 20px between sections, 12px between KPI tiles, a 236px sidebar on desktop collapsing to a top bar with a menu toggle below 900px. Light is the default; dark follows the OS setting unless the user picks a theme (stored in `localStorage` as `pulse-theme`, applied as `data-theme` on `<html>` before paint).

Pulse refuses gradient KPI cards, neon dark-mode dashboards, dual-axis charts, donut charts and decorative sparklines. Every chart answers one question with one axis.

**Key Characteristics:**
- Flat surfaces, 1px hairline borders, 10px card corners.
- One blue for "this period"; one grey for "previous period"; nothing else competes.
- Status is always colour + icon + label, never colour alone.
- System UI type, 15px base, tabular numerals on every number.
- Every token has a light and a dark value; components only ever read `var(--token)`.

## Colors

A warm, near-neutral grey ramp carrying a single blue accent and four semantic status pairs.

All colours are CSS custom properties in `app/assets/css/main.css`. The light set lives on `:root`; the dark set is declared twice (inside `prefers-color-scheme: dark` for `:root:not([data-theme="light"])`, and on `:root[data-theme="dark"]`). **To retheme, edit both dark blocks identically**, or the toggle and the OS setting will disagree.

### Primary
- **Series Blue** (`series-1`, dark `series-1-dark`): the current-period data series, the active nav icon, focus outlines, input focus rings, text selection, links styled as buttons, and the logo tile. It is a data colour first; chrome uses it sparingly.
- **Button Blue** (`btn`, dark `btn-dark`): primary button fill. Same as Series Blue in light; darkened in dark mode so white button text keeps contrast.

### Secondary
- **Comparison Grey** (`compare`): the previous-period line. Deliberately recessive so the current period always reads first.

### Status
- **Good** (`good` on `good-bg`): Paid, positive deltas, saved confirmations.
- **Warning** (`warning` on `warning-bg`): Pending, low-stock flags.
- **Critical** (`critical` on `critical-bg`): Failed, negative deltas, form errors and invalid-field borders.
- **Neutral** (`text-2` on `neutral-bg`): Refunded and any terminal state that is neither good nor bad.

### Neutral
- **Paper** (`page`): the app background behind cards.
- **Card White** (`surface`): cards, KPI tiles, sidebar, inputs, table headers, tooltips.
- **Pressed Stone** (`surface-2`): active nav item, pressed segmented option, workspace avatar.
- **Ink** (`text`), **Graphite** (`text-2`), **Pebble** (`muted`): primary text; secondary text, nav labels, chart category labels; captions, axis ticks, placeholders, table headers.
- **Hairline** (`line`, also `--grid`): every border, divider and chart gridline.
- **Axis** (`axis`): the x-axis line, chart cursor, scrollbar thumb.
- **Hover wash** (`--hover`, `rgb(11 11 11 / .04)` light, `rgb(255 255 255 / .05)` dark): row and button hover.

### Named Rules
**The One Series Rule.** A chart shows one coloured series (`series-1`). A comparison uses `compare` grey on the same axis. A bar chart of one measure uses one colour for every bar, with values labelled at the bar ends. If you need a second coloured series, add a `--series-2` token with light and dark values validated for contrast against `surface` and against `series-1`, never a hard-coded hex in the chart.

**The Token-Only Rule.** Components and the SVG charts read `var(--token)` (`stroke="var(--series-1)"`, `.axis-label { fill: var(--muted) }`), so charts switch theme with the page. The only literal is white (#fff) on blue fills (buttons, logo tile, selection); any other literal colour in a component is a bug.

## Typography

**Body Font:** system-ui (with -apple-system, Segoe UI, Roboto, sans-serif)
**Mono Font:** ui-monospace (with SF Mono, Menlo, Consolas) for order IDs only

**Character:** The platform's own UI face, tightened slightly at heading sizes. It reads as native software, not a marketing page.

### Hierarchy
- **Headline** (650, 24px, 1.2, -0.015em): one page title per page.
- **KPI value** (650, 28px, 1.15, -0.02em, tabular): KPI tile figures; 22px below 560px.
- **Title** (600, 16px, 1.2): card titles.
- **Body** (400, 15px, 1.5): default text; tables use 14px.
- **Label** (500 to 600, 13px): KPI labels, deltas, segmented options, field labels, legends, card subtitles (`.sub`, muted). Table headers are 12px, 500, muted, sentence case.

### Named Rules
**The Tabular Rule.** Every number that can sit next to another number (KPI values, deltas, table numeric columns, tooltip values) uses `font-variant-numeric: tabular-nums`, and numeric columns are right-aligned (`num: true` on a DataTable column).

**The Sentence Case Rule.** Labels and headers are sentence case at normal tracking. No uppercase micro-labels above titles.

## Layout

- **Shell:** two-column grid, 236px sticky sidebar plus fluid main. Below 900px the sidebar becomes a sticky top bar; the nav opens from a menu button.
- **Page:** padding `28px clamp(16px, 3vw, 36px) 48px`, sections stacked with a 20px gap, max width 1400px (settings: 760px, `.page.narrow`).
- **Page head:** title and subtitle left, the page's controls (range presets, export) right, wrapping on narrow screens.
- **KPIs:** 4 columns (or 3 with `.kpis.three`), 2 columns below 1100px and below 560px, 12px gap. Below 560px the delta's "vs previous period" basis drops to its own line.
- **Two-up cards:** `.grid-2`, 20px gap, single column below 1100px.
- **Tables on phones:** below 640px, columns flagged `hideSm: true` in a `DataTable` column definition (and any element with `.hide-sm`) are hidden. Keep the identifier, the primary name, the status and the total visible; hide dates, channels, item counts and secondary lines like email.

## Elevation & Depth

Flat. Cards, tiles, the sidebar and table headers separate from the page by tone (`surface` on `page`) and a 1px `line` border, never by shadow.

### Shadow Vocabulary
- **Tooltip float** (`box-shadow: 0 4px 16px rgb(0 0 0 / .12)`): chart tooltips only, the one element that floats over content.
- **Focus glow** (`box-shadow: 0 0 0 3px color-mix(in srgb, var(--series-1) 20%, transparent)`): inputs and the search field on focus. A ring, not elevation.
- **Pressed hairline** (`box-shadow: 0 0 0 1px var(--line) inset`): the selected segmented option.

### Named Rules
**The Tooltip-Only Shadow Rule.** Only transient overlays float. Cards stay flat at rest and on hover.

## Shapes

Soft rectangles throughout: 10px for cards, KPI tiles and the workspace block (`--radius`); 8px for buttons, inputs, nav items, tooltips and icon buttons; 6px for options inside a segmented control (whose container is 9px); full pill (99px) for status badges. Borders are always 1px `line`. Bars in the channel chart round only their outer end (4px). Icons are 20px line drawings on a 20-unit grid with a 1.6 stroke and round caps (`app/utils/icons.ts`); add new icons to that map at the same stroke.

## Components

### Buttons
- **Primary** (`.btn`): `btn` fill, white 600 14px text, 36px tall, 8px corners; hover brightens slightly. One per view, for the committing action (Save changes).
- **Ghost** (`.btn .btn-ghost`): surface fill, hairline border, ink text; hover takes the hover wash. Used for navigation and secondary actions (View all orders, Export CSV, Clear filters).
- **Icon button** (`.icon-btn`): 36px square, hairline border; disabled at 40% opacity. Always has an `aria-label`.
- **Link button** (`.link-btn`): series-blue underlined 13px text for in-card toggles (Show data table).
- **Focus:** global 2px `focus` outline at 2px offset on every focusable element.

### Segmented control
- **Style** (`.range`): a hairline-bordered capsule of 30px options; the pressed one (`aria-pressed="true"`) takes `surface-2` with an inset hairline. Used for date ranges, status filters and the theme choice. It is a `role="group"` of toggle buttons, not tabs.

### Cards / Containers
- **Card:** `surface`, 1px `line`, 10px corners, 18px 20px padding. `.card.flush` removes padding for edge-to-edge tables.
- **Card head:** title (16px) with a muted 13px subtitle; actions or legend on the right.

### KPI tile
Label (13px, graphite), value (28px tabular), then a delta: arrow icon plus percentage in `good` or `critical`, a screen-reader "increase/decrease", and a muted "vs previous …" basis. Pass `invert` for metrics where down is good. Value-only tiles (no delta) are fine.

### Status badge
`<StatusBadge :status="…" />` renders a 24px pill with a 14px icon and the label. **To add a status:** extend `OrderStatus` in `app/utils/data.ts`, then add one entry to the map in `app/components/StatusBadge.vue` choosing one of the four classes (`good`, `warning`, `critical`, `neutral`) and an icon from `app/utils/icons.ts`. Reuse the four semantic pairs; a new colour pair needs light and dark tokens and a contrast check in both themes.

### Inputs / Fields
- **Style:** 38px, surface fill, hairline border, 8px corners, max width 420px; label above in 600 13px.
- **Focus:** border turns `series-1` plus the focus glow.
- **Error:** `aria-invalid="true"` turns the border `critical`; message below in 13px `critical`, linked by `aria-describedby`.
- **Search:** same shell with a leading search icon; focus via `:focus-within`.

### Tables
Header 12px muted, sticky, sentence case, each header a sort button (sort icon at 40% when inactive). Rows 14px with hairline dividers and the hover wash. Inside padded cards the first and last cells lose their outer padding so text aligns with the card title. A pager sits below with a range count and previous/next icon buttons.

### Charts
- **Revenue line:** one y-axis with round, even ticks (`niceTicks`), horizontal `line` gridlines only, x-axis `axis` hairline, 12px muted ticks. Current period is a 2px `series-1` stroke over a fill fading from 18% to 0; previous period is a 2px `compare` line without fill. A legend sits in the card head; a "Show data table" toggle gives the exact values.
- **Channel bars:** horizontal, one colour, labels at bar ends, no visible value axis.
- **Tooltip:** surface card, hairline border, 8px corners, the float shadow; date muted, values bold and tabular, each row keyed by a 12×2px swatch.
- Every chart wrapper has `role="img"` and an `aria-label` summarising the data. Animations are off.

### Navigation
Sidebar items: 20px icon plus 500 label in graphite, 8px corners; hover takes the wash; current page (`aria-current="page"`) takes `surface-2`, ink text and a blue icon. The footer holds the theme toggle and the credit line.

## Do's and Don'ts

### Do:
- **Do** read every colour from a CSS custom property, and give every new token a light value and both dark declarations.
- **Do** pair every status or delta colour with an icon and a text label (the low-stock flag uses the alert icon plus "Low stock: N left").
- **Do** keep comparisons on one shared axis, current period in `series-1`, previous in `compare`.
- **Do** use tabular numerals and right alignment for every numeric column.
- **Do** mark secondary table columns `hideSm: true` so phones keep the identifier, name, status and total.
- **Do** offer a data table or direct labels alongside any chart.

### Don't:
- **Don't** add shadows to cards, tiles or buttons; only tooltips float.
- **Don't** use gradient-filled KPI cards, neon accents on dark backgrounds, dual y-axes, donut or pie charts, or decorative sparklines.
- **Don't** colour bars by category when they show one measure.
- **Don't** signal state with colour alone.
- **Don't** hard-code hex colours in components or chart props (white on blue fills excepted).
