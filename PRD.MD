# Product Requirements Document (PRD): EdSmart

## 1. Overview
EdSmart is a free, web-based learning platform offering courses across multiple disciplines. This document defines the scope, requirements, and success criteria to launch an MVP to production.

## 2. Objectives and Success Metrics
- Provide a fast, accessible, mobile-first learning experience
- Help users find and start a course in under 30 seconds
- Accessibility: meet WCAG 2.1 AA for key flows
- Performance: Lighthouse Performance ≥ 90 on mobile, TTI < 3s on a mid-tier device
- Engagement: ≥ 40% visitors interact with a course card or search

## 3. Users and Personas
- Explorer: browsing categories, wants overviews, skims
- Goal-seeker: comes with a topic in mind, uses search, wants clarity and trust
- Returner: comes back to continue progress

## 4. Scope (MVP)
- Landing with hero search, featured courses, categories, testimonials, contact
- Client-side router (hash-based)
- Course cards with tags, duration, ratings, and progress indicator
- Search box with suggestions (mocked)
- Contact form (client-side validation + pluggable submit target)
- Basic analytics with user consent

Out of scope for MVP:
- Authentication and persistence of user progress
- Full course player and content catalog

## 5. UX Requirements
- Keyboard navigability across header, hero, carousel, and cards
- Visible focus styles; skip-to-content link
- Color contrast AA; no content shift on interaction
- Toasts are announced via ARIA (status/alert)

## 6. Information Architecture
- Routes: #home, #courses, #categories, #about, #testimonials, #contact
- Unknown routes redirect to #home

## 7. Functional Requirements
- Router: deep link support; active link states; smooth scroll with header offset
- Carousel: mouse, keyboard (arrows), touch swipe, responsive slides-per-view
- Search: submit navigates to courses with message; suggestions appear after 3+ chars
- Contact: validate fields; disable button while submitting; success and error states
- Consent: banner appears until accepted; analytics only runs after opt-in

## 8. Non-Functional Requirements
- Performance: preload fonts; minimize unused JS/CSS; lazy where reasonable
- Security: no inline secrets; use hosted form endpoint if enabled
- Privacy: no tracking before consent; easy opt-out (localStorage flag)

## 9. SEO and Social
- Descriptive title/description
- Open Graph and Twitter card tags
- robots.txt (allow all) and sitemap.xml
- JSON-LD Organization metadata

## 10. Analytics
- Pluggable provider via window.EDS_ANALYTICS_ENABLED and consent flag
- Event: page_view (route), search_submit (query length only), course_card_click (id)

## 11. Launch Checklist
- [ ] Lighthouse ≥ 90 Performance/Best Practices/SEO; Accessibility ≥ 90
- [ ] Keyboard navigation tested across major flows
- [ ] Metadata validated (Open Graph, Twitter, JSON-LD)
- [ ] robots.txt and sitemap.xml deployed
- [ ] Consent banner behaves as expected; analytics gated
- [ ] Contact form submit path tested (mock and production)
- [ ] Deployed to production with cache headers

## 12. Risks and Mitigations
- Over-animating hurts performance → prefers-reduced-motion and efficient CSS
- Hash routing SEO limits → static pre-render pages for marketing later
- Form spam → use hosted provider with spam protection
