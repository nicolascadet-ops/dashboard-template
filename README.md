# Pulse: Analytics Dashboard Template

A clean sales analytics dashboard for SaaS, e-commerce and internal tools. Built with [Next.js](https://nextjs.org) and [Recharts](https://recharts.org), with light and dark themes, sortable tables and CSV export. Exports as a static site, so it can be hosted anywhere.

![Pulse dashboard, light theme](docs/screenshot.png)

![Pulse dashboard, dark theme](docs/screenshot-dark.png)

> **All data is fictional.** "Northwind Outdoor", its orders, customers and figures are generated from a fixed seed in `src/lib/data.ts`.

## Pages

| Page | What's on it |
|---|---|
| **Overview** | Date-range presets, KPI tiles with change vs previous period, revenue chart compared with the previous period (with a data-table view), revenue by channel, top products, recent orders |
| **Orders** | Search, status filters, sortable columns, pagination, CSV export of the filtered rows |
| **Customers** | Summary figures, search and a sortable customer table |
| **Settings** | Theme (system / light / dark), report email with validation, currency and alert preferences |

## Features

- **Light and dark themes**: follows the device by default, remembers the user's choice, no flash on load.
- **Accessible charts**: one axis per chart, legends, hover tooltips, colour-blind-safe colours, and a data table for every chart.
- **Status badges** that pair colour with an icon and a label, never colour alone.
- **Responsive**: sidebar becomes a menu on phones; tables scroll inside their cards.
- **Fast**: system fonts, static HTML, a single charting library.

## Run it locally

Requires Node.js 20.9 or later.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Connect your own data

All numbers come from `src/lib/data.ts`. Replace the generated arrays (`DAILY`, `ORDERS`, `CUSTOMERS`, `TOP_PRODUCTS`) with data from your API, database or analytics tool. Two common approaches:

1. **Fetch at build time** in the page files, for reports that update daily (rebuild on a schedule).
2. **Fetch in the browser** from your API, for live numbers (add authentication in front of the dashboard).

## Customise

| What | Where |
|---|---|
| Colours (light and dark), chart colours | CSS variables at the top of `src/app/globals.css` |
| Navigation and workspace name | `src/components/Shell.tsx` |
| Date ranges | `RANGES` in `src/lib/data.ts` |
| Icons | `src/components/Icon.tsx` |

## Deploy to Cloudflare Pages

`next.config.ts` sets `output: "export"`, so the build is a plain static site in `out/`.

- **Dashboard:** Workers & Pages → Create → Pages → Connect to Git → pick this repo. Build command: `npm run build`. Output directory: `out`.
- **CLI:**
  ```bash
  npm run build
  npx wrangler pages deploy out --project-name pulse-dashboard
  ```

For a real dashboard, put it behind authentication (for example Cloudflare Access) before connecting live data.

## Credits

- Charts: [Recharts](https://recharts.org) (MIT).
- Built by **NC Atelier**.

---

### Want a dashboard like this for your business?

NC Atelier designs and builds fast, accessible websites and web apps for businesses in the UK, US and Canada.

**Contact:** _add your email / LinkedIn here_
