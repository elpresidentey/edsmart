# EdSmart

Free online learning platform front-end (static SPA).

## Features
- SPA with hash-based routing (home, courses, categories, about, testimonials, contact)
- Responsive header with mobile menu
- Hero search with suggestions (mocked)
- Featured courses carousel
- Progress bars and status tags on course cards
- Toast notifications for success/error

## Getting started
1. Open index.html in a browser (no build step required).
2. For local dev with live reload, use a static server:
   - PowerShell (Windows 10+):
     - Python 3: `python -m http.server 5500` then open http://localhost:5500/
     - Node (if installed): `npx serve -l 5500` then open http://localhost:5500/

## Project structure
- index.html: markup and critical CSS
- style.css: main styles
- script.js: routing and interactivity
- PRD.MD: product requirements document

## Roadmap (towards launch)
- A11y improvements (keyboard nav, focus, ARIA)
- SEO polish (meta, sitemap.xml, robots.txt, JSON-LD)
- Performance pass (minify, preload fonts, lazy load)
- Analytics + basic consent banner
- Contact form: client validation + backend (e.g., Formspree)
- CI/CD to deploy (GitHub Pages/Netlify/Cloudflare Pages)

## License
TBD

