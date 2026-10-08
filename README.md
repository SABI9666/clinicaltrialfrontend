# Clinical Trial Access — public website

The public Clinical Trial Access site: a React port of the supplied HTML
design, rendering content served by the API.

- **Framework:** React 18 + Vite
- **Hosting:** Vercel
- **Content:** fetched from the API in
  [`clinicaltrialadmin`](https://github.com/SABI9666/clinicaltrialadmin)
  (Node on Google Cloud Run)

---

## How content reaches the page

The site fetches `GET /api/public/site` once on load — one request returning
every section and all published trials, reports, FAQs, news and policies.

`src/data/fallback.js` holds a bundled snapshot of that payload. The page
renders from the snapshot immediately, then swaps to live content when the API
responds. If the API is slow or unreachable the site still shows the correct
page rather than an empty one. The snapshot is generated from the API's seed
data — edit content in the admin, not in that file.

---

## Running locally

```bash
npm install
npm run dev          # http://localhost:5173
```

The dev server proxies `/api` to `http://localhost:8080` (or `VITE_DEV_API`), so running the API from the other repository gives a
full local stack. Without it, the site renders from the bundled fallback.

```bash
npm run build        # production build into dist/
npm run preview      # serve the build locally
```

---

## Deploying to Vercel

Create a Vercel project from this repository:

- **Framework preset:** Vite (detected automatically)
- **Build command:** `npm run build`
- **Output directory:** `dist`

The site calls `/api` on its own address, and `vercel.json` forwards those
requests to the Cloud Run service. If the service URL ever changes, update both
rewrites in that file. Because the browser never calls the API directly, the
site works on any domain attached to the Vercel project without adding it to
the API's `CORS_ORIGINS`.

One consequence: the API sees Vercel's addresses rather than each visitor's,
so its per-address limits (20 enquiries and 10 registrations an hour) can end
up shared between visitors. Fine while traffic is light; for a busy site,
have the API take the visitor address from Vercel's forwarding header instead.

`vercel.json` sets long-lived caching for hashed assets and a few standard
security headers.

---

## Project structure

```
public/media/           Optimised site images (WebP + JPEG)
src/
  App.jsx               Page composition and dialog/tab state
  components/
    Header.jsx          Sticky nav with mobile menu
    Hero.jsx            Hero banner
    HeroWide.jsx        Full-width banner image
    TrialsSection.jsx   Trial search and result cards
    TrialDialog.jsx     Trial detail modal
    Journey.jsx         "Finding a clinical trial" steps
    WhyJoin.jsx         "Why participate" section
    Insights.jsx        Reports / FAQs / News tabs
    About.jsx           About panel
    Contact.jsx         Enquiry form
    Footer.jsx          Footer and policy links
    Dialog.jsx          Native <dialog> wrapper
    Image.jsx           <picture> with WebP + fallback
  lib/
    api.js              API client
    useSite.js          Content loading with fallback
  data/fallback.js      Bundled content snapshot
  styles/site.css       Styles, ported verbatim from the design
```

---

## Notes on the port

- `src/styles/site.css` is the original stylesheet, unchanged, so the rendered
  page matches the supplied design.
- The four images were extracted from the original data URIs and re-encoded as
  WebP with JPEG fallbacks — about 10 MB of inline base64 became ~670 KB of
  cacheable files.
- Tabs, dialogs and the mobile menu are React state rather than direct DOM
  manipulation, keeping the original ARIA roles and keyboard behaviour
  (arrow keys move between tabs, Escape closes dialogs).
- The contact form posts to the API and appears in the admin enquiry inbox.
  The original demo form sent nothing, so the top banner no longer says
  enquiries are not sent; that banner text is editable in the admin.
- Trial filters ignore a facet a trial has not recorded, so a trial with
  unconfirmed locations stays visible. Eligibility is always determined by the
  research team, which the page states.
