# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Repository: EdSmart — static single-page application (no build toolchain)

- Primary entrypoint: index.html
- Core assets: style.css, script.js, config.js
- Docs: README.md (quick start), PRD.MD (requirements), robots.txt, sitemap.xml

Common commands (Windows PowerShell shown; use equivalents on macOS/Linux)

- Serve locally (Python):
  python -m http.server 5500
  Open http://localhost:5500/

- Serve locally (Node.js, no install):
  npx serve -l 5500
  Open http://localhost:5500/

- Open directly without a server (basic preview):
  Open index.html in a browser (hash routing works without a backend).

Notes on build/lint/test

- Build: not applicable (static files only).
- Lint: not configured in this repo.
- Tests: none present. Running a single test is not applicable.

Configuration you may need

- config.js controls outbound integrations and flags:
  - window.EDS_FORM_ENDPOINT: hosted form endpoint (e.g., Formspree). Set to your real endpoint or leave as-is for mocked submit.
  - window.EDS_ANALYTICS_ENABLED: true/false toggle. Analytics only runs after explicit user consent.
  - window.EDS_ANALYTICS_PROVIDER_URL and window.EDS_ANALYTICS_PROVIDER_ATTRS: optional third-party analytics loader (e.g., Plausible). Loaded only after consent.

High-level architecture and flow

- Single Page Application with hash-based routing
  - script.js defines Router: a minimal client-side router reading window.location.hash.
  - Known routes: home, courses, categories, about, testimonials, contact. Unknown routes redirect to home.
  - Navigation links (<a href="#...">) are intercepted to call router.navigate(path).
  - Router scrolls to the matching section by ID and updates active nav state.

- Initialization (script.js → initApp)
  - Constructs Router, registers routes, executes the current route, then initializes feature modules:
    - initMobileMenu(router): responsive header menu; toggles body scroll and aria attributes; integrates with router navigation.
    - initAnimations(): IntersectionObserver-based fade-in for elements with .animate-fade-in.
    - initSearch(): debounced suggestions, loading state, and simulated results; on submit, shows a toast and navigates to #courses.
    - initProgressBars() + initProgressTracking(): animates .course-progress bars on view; switches “Enroll” to “Continue Learning” with progress text.
    - initCoursesCarousel(): prev/next, dots, keyboard arrows, touch swipe, auto-play with pause-on-hover/touch; responsive slides-per-view.
    - initContactForm(): client validation; optional POST to window.EDS_FORM_ENDPOINT; loading state + success/error toasts.
    - initConsentAndAnalytics(): renders consent banner until accepted; only after consent:
      - optionally loads analytics provider script from config.js
      - tracks page_view on route changes, course_card_click (id), and search_submit (query length only)
    - setupNavigation(router): binds nav links to router.navigate.

- Markup and sections (index.html)
  - Header: logo + nav + mobile menu button; auth buttons are placeholders.
  - Main sections: #home (hero + search), #categories (grid), #courses (carousel), #about (how-it-works steps), #testimonials, #contact (form + info).
  - Accessibility: skip-link, form labels, aria attributes on controls and toasts, basic keyboard handling for components.

- Styling (style.css)
  - CSS variables for theme, spacing, shadows; utility classes; responsive layout; component styles for header/nav/hero/cards/carousel/toasts/consent banner.
  - Header shadow only applied after scroll via header--scrolled class (toggled in initApp).

Where to add or change features

- New route/section:
  - Add a section in index.html with id matching your route, e.g., <section id="faq" class="page-section">...</section>
  - In script.js initApp, register the route: router.addRoute('faq', () => showPage('faq'))
  - Add a nav link <a href="#faq">FAQ</a> (setupNavigation will bind it).

- Contact form backend:
  - Set window.EDS_FORM_ENDPOINT in config.js to your provider endpoint to enable real submits.

- Analytics provider:
  - In config.js set window.EDS_ANALYTICS_PROVIDER_URL and any attributes in window.EDS_ANALYTICS_PROVIDER_ATTRS (e.g., data-domain). Provider script loads only after consent when window.EDS_ANALYTICS_ENABLED is true.

Important repository docs to consult

- README.md: quickstart commands and project structure.
- PRD.MD: MVP scope, routes, accessibility/performance/SEO expectations, consent + analytics events, and launch checklist.

Existing guidance files

- No CLAUDE.md, Cursor rules, Copilot instructions, or prior WARP.md detected.

