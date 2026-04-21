<div align="center">

<img src="images/logo-mark.png" alt="Natália Vicente" width="140" />

# Natália Vicente — Nail Designer

**Brand website** — static, responsive, no build dependencies.
Aesthetic: classic beauty salon with an alternative visual identity.

Live: [www.nataliavicente.pt](https://www.nataliavicente.pt)

</div>

---

## About

Showcase site for **Natália Vicente**'s nail design atelier.
Built with plain HTML, CSS and JavaScript, served as a static page
on Azure Static Web Apps.

The visual language mixes condensed editorial typography (Oswald + Playfair Display),
a monochrome palette in black / red / bone, and flourishes in *old-school tattoo flash* style.

## Stack

| Layer | Technology |
|---|---|
| Markup | Semantic HTML5 |
| Styles | CSS3 (custom properties, grid, clamp) |
| Script | Vanilla JavaScript ES6 (no frameworks) |
| Typography | Google Fonts — Oswald · Playfair Display · Inter |
| Hosting | Azure Static Web Apps |
| Build | *none* — static |

## Project structure

```
natalia-website/
├── index.html                # single page
├── css/
│   └── style.css             # single stylesheet, organized into 18 sections
├── js/
│   ├── i18n.js               # dictionary loader + DOM translator (see "Internationalization")
│   └── main.js               # two IIFEs: mobile drawer (focus trap) + love-letters carousel
├── i18n/
│   ├── pt.json               # Portuguese (default)
│   └── en.json               # British English
├── images/
│   ├── logo.png              # official logo with wordmark
│   ├── logo-mark.png         # illustration-only version (used in header)
│   ├── favicon.png           # derived from logo-mark
│   ├── hero-photo.webp       # main portrait
│   ├── about-photo.webp      # photo for the "About" section
│   ├── portfolio-03..10.webp # gallery tiles
│   └── love-01..05.jpg       # testimonial screenshots (WhatsApp / Instagram)
├── staticwebapp.config.json  # Azure Static Web Apps routing / headers
├── .github/workflows/        # CI/CD to Azure Static Web Apps
├── LICENSE
└── README.md
```

## Run locally

The site must be served over HTTP — opening `index.html` directly from the
file system (`file://`) does **not** work because `js/i18n.js` loads the
language dictionaries via `fetch`, which browsers block for local files.

Any static server works:

```bash
# Python 3
python -m http.server 8080

# Node (npx)
npx serve .

# VS Code
# "Live Server" extension → right-click index.html → "Open with Live Server"
```

Then: [http://localhost:8080](http://localhost:8080)

## Deployment

Deploys automatically to Azure Static Web Apps on push to `main` via the
workflow in `.github/workflows/`. No build step is required — files are
served as-is from the repo root.

## Design tokens

Palette defined via `:root` in `css/style.css`:

| Token | Value | Usage |
|---|---|---|
| `--red` | `#EE0310` | primary, CTAs, accents |
| `--bone` | `#EEEEEE` | text on dark background |
| `--ink` | `#0A0A0A` | main background |
| `--ink-soft` | `#141414` | secondary backgrounds |
| `--ink-deep` | `#050505` | footer background |
| `--fg-soft` · `--fg-muted` · `--fg-subtle` · `--fg-faint` | `rgba(bone, α)` | typographic hierarchy |
| `--rule` | `rgba(bone, .14)` | dividers |

Typography tokens: `--ff-display` (Oswald), `--ff-serif` (Playfair Display), `--ff-body` (Inter).
Layout tokens: `--maxw` (1360px), `--pad` (responsive `clamp`).
Motion: `--ease` (cubic-bezier).

## Responsiveness

Mobile-first breakpoints:

| Width | Target |
|---|---|
| ≥ 520px | booking info 2 columns |
| ≥ 560px | footer 2 columns |
| ≥ 600px | header CTA becomes visible |
| ≥ 700px | services 2 columns |
| ≥ 720px | testimonials carousel gains side padding for nav arrows |
| ≥ 760px | gallery 3 columns |
| ≥ 900px | hero / about / booking / footer in larger layouts |
| ≥ 960px | desktop nav (hamburger hidden) |
| ≥ 1060px | services 3 columns |
| ≥ 1100px | gallery 4 columns |

## Accessibility

- Semantic landmarks (`<header>`, `<main>`, `<nav>`, `<footer>`).
- Skip-to-content link for keyboard users.
- `aria-expanded` / `aria-controls` on the mobile toggle.
- `aria-label` on navs and decorative elements.
- Visible focus (`:focus-visible` with red outline).
- Drawer closes on **Esc** key, backdrop click, or link activation.
- Focus is trapped inside the open drawer and restored on close.
- Testimonials carousel: `aria-roledescription="carousel"`, per-slide labels, keyboard arrows, `aria-current` on active dot.
- Respects `prefers-reduced-motion`.
- AA contrast for text on dark backgrounds.

## SEO

- Semantic HTML5 with a single `<h1>`.
- Canonical URL, Open Graph and Twitter Card metadata.
- JSON-LD structured data (`LocalBusiness` / `BeautySalon`).
- `<html lang>`, `<title>`, `<meta name="description">` and `og:*` tags are
  rewritten on language change (see below).

## Internationalization (i18n)

The site supports **Portuguese (pt-PT, default)** and **British English
(en-GB)**. A flag button in the header (and mobile drawer) toggles between
them and persists the choice in `localStorage` under `nv.lang`. On first
visit, the initial language is picked from `localStorage`, then
`navigator.language`, falling back to Portuguese.

**Dictionaries.** One JSON file per language lives under `i18n/`. Adding a
new language means dropping a new file (e.g. `i18n/fr.json`), adding its
code to the `LANGS` array in `js/i18n.js`, and adding a flag symbol +
`.lang-toggle__flag--<code>` visibility rule.

**Markup.** Translatable content is declared on elements via `data-*`
attributes — no central string table in JS:

| Attribute                           | Effect                                         |
|---|---|
| `data-i18n="key"`                   | sets `textContent`                             |
| `data-i18n-html="key"`              | sets `innerHTML` (for entries containing `<em>`, `<b>`, etc.) |
| `data-i18n-alt="key"`               | sets the `alt` attribute                       |
| `data-i18n-aria-label="key"`        | sets `aria-label`                              |
| `data-i18n-aria-roledescription="key"` | sets `aria-roledescription`                 |
| `data-i18n-title="key"`             | sets `title`                                   |
| `data-i18n-placeholder="key"`       | sets `placeholder`                             |
| `data-i18n-content="key"`           | sets `content` (used on `<meta>` tags)         |

**Dynamic strings.** Scripts can call `window.NVi18n.t(key, params)` to
translate imperatively (e.g. the carousel's per-dot `aria-label`), with
`{{name}}` placeholders interpolated from `params`. Whenever the language
changes, `js/i18n.js` dispatches a `nv:lang-change` `CustomEvent` on
`document`, so subscribers can re-apply any dynamic labels.

## Page sections

1. Top ticker
2. Header with logo + nav + CTA
3. Hero with photo and typographic statement
4. Marquee *"A atitude de um trabalho sutil"*
5. About
6. Manifesto
7. Service menu (6 items)
8. Gallery / portfolio (8 tiles)
9. Testimonials — *Love Letters* carousel (screenshots of real client messages)
10. Booking
11. Footer

## License

See [LICENSE](LICENSE).

---

<div align="center">
Made by Victor Prospero. Porto · 2026.
</div>
