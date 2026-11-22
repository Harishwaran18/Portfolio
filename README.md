# Ink & Impact — a portfolio for job seekers

A single-page portfolio for recruiters and hiring managers. Warm paper, ink, one
signal colour, editorial typography, and case studies that lead with evidence.
No framework, no build step, no tracking — just HTML, CSS, and vanilla JS.

**Structure:** hero → about → skills → selected work (case study dialogs) →
experience → testimonials → contact → footer.

---

## 1. The design concept

**Ink & Impact** treats the portfolio like a well-set printed report rather than a
template. The craft signals care; the structure signals judgement.

| Element | Choice | Why |
| --- | --- | --- |
| Palette | Warm paper `#F5F1E8`, ink `#12120E`, one vermilion accent `#B23A16` | Reads as print, not a SaaS landing page. One accent keeps attention on names, numbers, and actions. |
| Display type | **Fraunces** (variable serif, optical sizing, italic accents) | Distinctive and human. A serif headline signals editorial confidence; italic emphasis adds personality without shouting. |
| Body type | **Inter** | Neutral, highly legible at small sizes, familiar to reviewers. |
| Labels / data | **IBM Plex Mono** | Section numbers, dates, metrics, and tags read as precise, technical, and scannable. |
| Layout | Asymmetric 12-column grid, hairline rules, generous margins | Mirrors a CV/editorial page: strong hierarchy, obvious grouping, easy skimming. |
| Signature element | Rotating "open to work" seal + hand-drawn underline + dotted-leader "impact ledger" | A memorable personal mark that never competes with the content. All decorative motion stops for reduced-motion users. |
| Rhythm | Paper → tinted → paper → dark band → paper → dark footer | Gives a long page a pulse, so reviewers always know where they are. |

### Why these decisions support the job search

- **Recruiters scan in seconds.** The name, role, availability, and two primary
  actions sit above the fold. Every section starts with a numbered, one-line
  promise, so a six-second scan still produces a clear picture.
- **Hiring managers look for evidence.** Each case study is framed as
  problem → what I did → outcome, with a ledger of metrics. That is the shape of
  an interview answer, which makes it easy to talk about you afterwards.
- **Depth without a long page.** Full case studies open in accessible dialogs, so
  the landing page stays short while the evidence is one click away.
- **Personality, safely.** The seal, hand-drawn underline, grain, and hover
  interactions show front-end craft and taste. None of them touch body text,
  contrast, or reading order.
- **Mobile matters.** Many reviewers open links on a phone between meetings.
  Type is fluid, tap targets are generous, and the menu is a full-height panel.
- **Accessibility is a seniority signal.** WCAG AA contrast, landmarks, skip link,
  visible focus, native dialogs, and real form errors show how you build, not just
  what you say.
- **Speed is respect.** One CSS file, one JS file, no framework, no image
  payload on the page. Fonts are preconnected and use `font-display: swap`.

---

## 2. Files

```
Portfolio/
├── index.html                 # All content, sections, and case study dialogs
├── resume.pdf                 # Placeholder — replace with your real résumé
├── robots.txt
├── sitemap.xml
└── assets/
    ├── css/styles.css         # Design tokens + all styles (incl. print & reduced motion)
    ├── js/main.js             # Nav, reveals, dialogs, copy email, form, cursor label
    ├── favicon.svg
    ├── og-image.svg           # Source artwork for the social card
    └── og-image.png           # 1200×630 social preview (already exported)
```

---

## 3. Run it

```bash
# from the project folder
python3 -m http.server 8000
# then open http://localhost:8000
```

Or just open `index.html` in a browser. There is no build step and no dependency.

---

## 4. Personalise it (about 20 minutes)

Every placeholder is wrapped in square brackets. Find them all:

```bash
grep -o '\[[^]]*\]' index.html | sort -u
```

### Highest-impact replacements

1. **Name and role** — `<title>`, meta description, OG tags, JSON-LD, the header
   brand, hero `<h1>`, about copy, footer, and `assets/favicon.svg` (aria-label).
2. **Contact details** — `[you@email.com]`, `[your-domain.com]`, LinkedIn, GitHub,
   Dribbble. Update them in the contact section, footer, JSON-LD, and
   `sitemap.xml` / `robots.txt`.
3. **Availability** — the hero pill, seal text (`OPEN TO WORK · [YOUR ROLE] · 2026`),
   contact block, and mobile menu meta.
4. **Case studies** — for each of the three cards, update the card body *and* its
   matching dialog (`#case-01`, `#case-02`, `#case-03`). Keep the ids unique if
   you add more.
5. **Metrics** — replace `[XX%]`, `[X]+`, `[$XXXk]` with real numbers you can
   defend in an interview. If a number is not measurable, use scope or speed
   instead ("shipped in 6 weeks with 2 engineers").
6. **Testimonials** — replace the quotes and initials. Keep them short and
   specific; one concrete sentence beats three generic ones.
7. **Résumé** — overwrite `resume.pdf` with your real one-page PDF.
8. **Portrait** — the hero and about use a styled placeholder. To use a photo,
   put it inside `.portrait__frame`:

   ```html
   <img src="assets/portrait.jpg" alt="[Your Name], [Your Role]"
        width="800" height="1000" loading="lazy" decoding="async">
   ```

   and add to your CSS:

   ```css
   .portrait__frame img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
   ```

   Then remove the monogram/label spans so they do not sit on top of the photo.

### Tailoring to your industry

The copy is written for product/design roles but the structure is industry-neutral.
To target a specific field:

- Put the industry in the hero tagline and the about lead, e.g.
  "I help [healthcare operations teams] turn [manual workflows] into [measurable outcomes]".
- Mirror the job description's vocabulary in the skills columns and the marquee —
  recruiters and ATS-adjacent tools both look for those terms.
- Keep the metric types native to the field: revenue and conversion for product,
  cycle time and error rate for operations, patient throughput for healthcare,
  latency and uptime for engineering.
- Add a fourth case study that is specific to the industry you are targeting.

---

## 5. Contact form

By default the form validates in the browser and opens the visitor's email app
with the message prefilled — no backend, no secrets, works on any static host.

To send submissions directly instead:

**Formspree (or similar)**

1. Create a form and copy the endpoint.
2. Change the `<form>` tag:
   ```html
   <form class="form" id="contactForm" action="https://formspree.io/f/[your-id]" method="POST">
   ```
3. In `assets/js/main.js`, delete the `window.location.href = 'mailto:' ...` block
   and the `event.preventDefault();` line, so the browser submits normally.
   Keep the validation block above it.

**Netlify Forms** — add `data-netlify="true"` and a hidden `form-name` input, then
deploy on Netlify; remove the mailto block the same way.

---

## 6. Accessibility

Built to WCAG 2.2 AA:

- **Contrast:** all tested text pairings pass, with a minimum measured ratio of
  **5.31:1** (accent and large display text), most body text 8–16:1. The accent
  used on the dark section is lightened to `#F08A63` to keep AA there.
- **Structure:** one `<h1>`, ordered headings, `<main>`, `<header>`, `<nav>`,
  `<footer>`, labelled sections, lists for lists.
- **Keyboard:** skip link, visible `:focus-visible` rings, native `<dialog>`
  focus containment, Escape to close, focus returned to the card that opened it.
- **Screen readers:** dialog `aria-labelledby` + `aria-describedby`, form errors
  linked with `aria-describedby`, copy-email confirmation in a live region,
  decorative art and the seal hidden with `aria-hidden`.
- **Motion:** every animation (reveals, marquee, seal rotation, underline draw)
  is disabled or replaced by a static layout under `prefers-reduced-motion: reduce`.
- **Touch:** the custom cursor label only appears for `(pointer: fine)`.

---

## 7. Performance

- No framework, no build, no runtime dependencies.
- ~1,750 lines of CSS and ~250 lines of JS, both cached separately.
- The page ships **zero content images**; project visuals are CSS gradients and
  the portrait is a styled placeholder, so first paint is fast.
- Fonts are preconnected and use `display=swap`; system serif/sans/mono fallbacks
  are declared.
- All motion uses `transform`/`opacity`; the scroll listener is `passive` and
  rAF-throttled.

If you add photography, compress to WebP/AVIF, set explicit `width`/`height`, and
keep the hero image under ~150 KB.

---

## 8. SEO checklist before launch

- [ ] Replace `https://[your-domain.com]/` in the canonical, OG/Twitter tags,
      JSON-LD, `sitemap.xml`, and `robots.txt`.
- [ ] Replace the title, description, and OG description with your own positioning.
- [ ] Point `og:image` at the deployed `assets/og-image.png` (absolute URL).
- [ ] Re-export the social card if your name or role changes: edit
      `assets/og-image.svg`, or replace `assets/og-image.png` with a 1200×630 image.
- [ ] Update the JSON-LD `sameAs` links and `knowsAbout` terms.
- [ ] Add the site to Google Search Console and submit `sitemap.xml`.
- [ ] Keep the page one `<h1>` and descriptive link text (already done).

The case studies are dialogs on the same URL. If you want each one indexed
separately, split them into `/work/[project]/` pages and link the cards to those.

---

## 9. Deploy

Any static host works.

**GitHub Pages:** push the folder to a repo, then Settings → Pages → deploy from
the branch root. Add a `.nojekyll` file if you use folders beginning with `_`.

**Netlify / Vercel / Cloudflare Pages:** drag the folder in, or connect the repo.
No build command; publish directory is the project root.

**Custom domain:** add the domain at your host, then update the canonical, OG
URLs, sitemap, and robots file.

---

## 10. Design tokens

All visual decisions live at the top of `assets/css/styles.css`.

| Token | Value | Use |
| --- | --- | --- |
| `--paper` | `#F5F1E8` | Page background |
| `--paper-2` | `#EDE7DA` | Tinted sections, form card |
| `--ink` | `#12120E` | Primary text, dark sections |
| `--muted` | `#5A594F` | Secondary text (6.3:1 on paper) |
| `--accent` | `#B23A16` | Emphasis, numbers, links (5.3:1 on paper) |
| `--accent-bright` | `#E4572E` | Decorative marks only, never small text |
| `--accent-on-ink` | `#F08A63` | Accent inside dark sections (7.6:1) |
| `--live` | `#2C7A4B` | Availability dot (non-text indicator) |
| `--font-display` | Fraunces | Headlines |
| `--font-body` | Inter | Body and UI |
| `--font-mono` | IBM Plex Mono | Labels, numbers, metadata |

If you change the accent, re-check contrast against `--paper` and `--paper-2`
(aim for 4.5:1 for normal text, 3:1 for text ≥24px). If you change the display
face, keep the fallback stack and re-test the hero at 320px wide.

---

## 11. QA performed

- Full-page renders at 1440, 820, 390, and 320 px with no horizontal overflow.
- Contrast audit of 26 text styles: all pass AA.
- Keyboard: skip link, tab order, dialog focus containment, Escape, focus return.
- Dialogs: backdrop click, close button, internal scrolling with a pinned close
  button, body scroll lock.
- Mobile menu: open/close, `aria-expanded`, Escape, scroll lock, link navigation.
- Form: empty and invalid submissions set `aria-invalid`, reveal linked errors,
  and move focus to the first invalid field; the mailto handoff is composed.
- Copy-email button: success state and live-region announcement.
- Reduced motion: reveals and marquee fall back to a static layout.

---

Free to use and adapt for your own job search. Replace the placeholders, keep the
metrics honest, and ship it.
