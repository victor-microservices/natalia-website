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
│   └── main.js               # mobile menu toggle (drawer + backdrop + focus trap)
├── images/
│   ├── logo.png              # official logo with wordmark
│   ├── logo-mark.png         # illustration-only version (used in header)
│   ├── favicon.png           # derived from logo-mark
│   ├── hero-photo.webp       # main portrait
│   ├── about-photo.webp      # photo for the "About" section
│   └── portfolio-03..10.webp # gallery tiles
├── staticwebapp.config.json  # Azure Static Web Apps routing / headers
├── .github/workflows/        # CI/CD to Azure Static Web Apps
├── LICENSE
└── README.md
```

## Run locally

Since this is a fully static site, just open `index.html` in a browser.
For development with *live reload*, any static server will do:

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
| ≥ 760px | gallery 3 columns |
| ≥ 800px | testimonials 3 columns |
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
- Respects `prefers-reduced-motion`.
- AA contrast for text on dark backgrounds.

## SEO

- Semantic HTML5 with a single `<h1>`.
- Canonical URL, Open Graph and Twitter Card metadata.
- JSON-LD structured data (`LocalBusiness` / `BeautySalon`).
- Portuguese (Portugal) language declared (`lang="pt-PT"`).

## Page sections

1. Top ticker
2. Header with logo + nav + CTA
3. Hero with photo and typographic statement
4. Marquee *"A atitude de um trabalho sutil"*
5. About
6. Manifesto (red block)
7. Service menu (6 items)
8. Gallery / portfolio (8 tiles)
9. Testimonials
10. Booking
11. Footer

## License

See [LICENSE](LICENSE).

---

<div align="center">
Made by Victor Prospero. Porto · 2026.
</div>
