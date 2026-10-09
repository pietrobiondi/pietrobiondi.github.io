# Pietro Biondi — Website V2 redesign plan

## Scope and guardrails

- **Delivery target:** a static, GitHub Pages-compatible single-page site. No server, database, PHP, runtime build step, framework, or mandatory third-party service.
- **Working branch:** `redesign-v2` (verified before this plan was created). `master` is not to be modified or pushed as part of the redesign work.
- **Technology:** semantic HTML5, modern CSS, and small vanilla JavaScript modules only.
- **Content rule:** every professional, academic, research, project, publication, talk, media, and social item inventoried below remains available in V2. Text may be restructured for legibility, but no facts are to be invented.
- **Explicit exclusions:** no CV download/page/file; no added social networks; no hacker clichés (Matrix, fake terminal, scrolling code, aggressive glitch); no framework or legacy plugin retained for convenience.

## 1. Proposed architecture

V2 will remain one document (`index.html`) with same-page anchor navigation. Content will be grouped into meaningful landmarks rather than template-specific blocks:

1. `header#home` — identity, role, research summary, primary social links, visual hero.
2. `main`
   - `section#about`
   - `section#currently`
   - `section#research`
   - `section#experience`
   - `section#education`
   - `section#work` — selected projects / selected work, with all projects available in an expandable collection.
   - `section#publications`
   - `section#talks`
   - `section#media`
3. `footer#contact` — contact action, the existing social profiles, copyright.

The navigation will expose the most useful primary anchors and may group dense content under an accessible “More” disclosure on small screens. Every visible navigation entry will map to a real landmark. Navigation state will be updated through `IntersectionObserver`, with a scroll-based fallback.

## 2. HTML structure

- Use `<!doctype html>`, `lang="en"` (existing content is predominantly English), UTF-8, a non-restrictive viewport, and a skip link.
- Use one `<h1>` for Pietro Biondi; each major section has an `<h2>`; cards/timeline entries use `<h3>`; no heading levels skipped.
- Use `<article>` for publications, projects, talks, and media entries; `<time datetime="…">` wherever dates can safely be represented; `<address>` for the email contact.
- Use lists for social links, research areas, bibliography/action links, and timeline records where appropriate.
- Use native `<button>` controls for theme, mobile navigation, and show-more functionality. Their `aria-expanded`, `aria-controls`, and visible labels will be synchronized by JavaScript.
- Publication and project collections will retain all records in the DOM: the initial subset is disclosed progressively without requiring network access. A native client-side search/filter for publications is optional and must leave the full unfiltered list available without JavaScript.
- Add accessible SVG icons inline or as external local SVG symbols only if needed; icon-only controls receive a descriptive accessible name.

## 3. CSS structure

Prefer a compact local stylesheet layout, for example:

```text
css/
  site.css        # tokens, reset/base, typography, layout, components, utilities
```

If file size and maintenance justify it, the same source can instead be separated into `tokens.css`, `base.css`, `components.css`, and `utilities.css`, all loaded locally. No CSS framework will be introduced.

CSS will use cascade layers (`reset`, `base`, `layout`, `components`, `utilities`) where useful; custom properties; logical properties; Grid and Flexbox; `clamp()` for fluid type/spacing; `min()`/`max()`; `:focus-visible`; `@supports`; and a small number of content-led media queries. Container queries may be used within card collections only when they simplify the component without excluding a reasonable fallback.

## 4. JavaScript structure

One deferred local script is sufficient:

```text
js/site.js
```

Responsibilities:

- Initial theme selection and persistence via `localStorage`, guarded with `try/catch`; first visit defaults to dark while recording system preference as an available hint rather than overriding that dark default.
- Accessible mobile navigation open/close, Escape handling, focus return, and correct ARIA state.
- Smooth anchor scrolling only when motion is allowed; native hash navigation remains a full fallback.
- Active-section navigation via `IntersectionObserver`, with a lightweight scroll fallback.
- Progressive “Show all / Show less” controls for publications, projects, and media; all content remains available if JS is unavailable.
- Optional client-side publication search/filter using text already in the document, with an accessible result count.
- Reveal-on-scroll only by adding a class after observation; initial content must never be hidden if JS or `IntersectionObserver` is unavailable.

No polling, animation loops, analytics tracker, social SDK, DOM framework, or dependency loader will be used.

## 5. Design system and palette

The visual direction is **academic security research**: quiet, precise, technical, and premium. The hero can combine the existing photographic background at low contrast with a local CSS/SVG technical grid, radial illumination, sparse node/line geometry, and restrained translucency. Decoration must be non-semantic and ignored by assistive technology.

### Core tokens

Use semantic tokens, expressed with `oklch()` and conservative fallback declarations where appropriate:

- Dark canvas: near-black blue (`#08111d` fallback).
- Dark raised surface: deep blue/slate (`#101d2d`).
- Dark border/text-muted: cool slate.
- Dark primary text: high-contrast cool white.
- Accent: controlled cyan/electric blue (`#38c8ff` fallback), reserved for focus, links, indicators, and compact highlights.
- Accent soft surface: translucent cyan derived with `color-mix()` and fallback RGBA.
- Light canvas: cool off-white (`#f4f8fc`); surfaces white/slate-tinted; ink dark navy; adjusted darker accent for AA contrast.
- Status/secondary colors are avoided unless carrying content; no decorative rainbow palette.

### Typography

- Use a system-first stack for performance and modern rendering: `Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif` only if Inter is already locally available; otherwise omit it and use the native stack.
- Retain no legacy font formats merely for old browsers. A small local WOFF2 family may be considered only if it produces a meaningful visual gain and its license/asset source is clear.
- Display type is a fluid sans-serif weight/size scale using `clamp()`; prose maximizes at a readable line length (about 65–72ch); metadata uses compact but legible sizes.

## 6. Layout and responsive strategy

- Establish a centered content container with fluid gutters, a broad desktop max width, and predictable section rhythm.
- Hero: split editorial layout on wide screens; identity/content stays readable over the visual field. It collapses into one column before either column becomes cramped.
- Research: compact semantic topic chips/cards, not a skills-percentage chart.
- Experience and Education: a shared timeline component. Desktop uses a left date rail and aligned vertical rule; mobile becomes a single-column timeline with the rule on the inline start.
- Projects: responsive auto-fit Grid cards. Important/current items are surfaced first; the full verified set is shown via one disclosure control.
- Publications: editorial list with year/venue/action metadata; desktop uses a small metadata rail, mobile stacks naturally. The initially visible count must remain useful without concealing the existence of older work.
- Talks and media: compact card/list grids that collapse to one column.
- Use only necessary layout thresholds (roughly compact/mobile, medium/tablet, wide desktop), driven by collision/content rather than device names.
- Never disable pinch zoom. Avoid fixed heights except decorative hero constraints that preserve content overflow.

## 7. Dark/light mode strategy

- Default paint is dark (`<meta name="color-scheme" content="dark light">` plus dark root tokens) to avoid a light flash.
- A labelled theme button exposes the current action, e.g. “Switch to light theme”; it is keyboard reachable and focus-visible.
- If a valid stored user choice exists, apply it before first paint through a tiny inline, non-analytics preference snippet or a class/data attribute strategy. Storage errors fall back safely to dark.
- On first visit, dark remains the prescribed default; `prefers-color-scheme` may inform the control state or future design refinement but must not violate the requested default.
- Theme changes use a short color transition, disabled under `prefers-reduced-motion: reduce`.

## 8. Motion and interaction

- Native `scroll-behavior: smooth` is enabled only outside reduced-motion mode.
- Sections/cards may have one-time opacity/translate reveals; no continuous decorative animation.
- Hover states enhance links/cards but all affordances are visible and operable with keyboard/touch.
- Mobile navigation may use opacity/transform transitions; it remains usable when transitions are disabled.
- View Transitions are unnecessary for a single page and will not be used unless a later interaction gains a concrete benefit with a graceful fallback.

## 9. Accessibility requirements

- Semantic landmarks, skip link, correct heading hierarchy, readable source order, and meaningful labels.
- Verify contrast in both schemes, including muted text, chip borders, current nav state, and focus indicator. Accent text is never the only state indicator.
- `:focus-visible` ring with sufficient contrast; no global outline removal.
- Menu: `aria-controls`, `aria-expanded`, Escape close, focus return, and click/keyboard-safe behavior.
- All images get purposeful alt text: the profile photo identifies Pietro Biondi; decorative hero layers have empty alt/`aria-hidden`.
- Buttons do not use inline `onclick`; disclosure controls announce their state.
- Respect `prefers-reduced-motion`; no zoom restriction; sufficiently large touch targets.
- Test keyboard-only flow, no-JS reading order, narrow viewport reflow, and light/dark contrast.

## 10. SEO and metadata

- Replace dated metadata with a precise title such as “Pietro Biondi, Ph.D. — Computer Science & Cybersecurity” and a truthful description based only on the listed biography/research.
- Keep canonical `https://pietrobiondi.github.io/`, favicon, robots directives, Open Graph, and X/Twitter summary card metadata, with the profile image as sharing image.
- Use `og:locale="en_US"` only if the page language remains English; otherwise align language and locale deliberately.
- Add JSON-LD with `@graph` for `WebSite` and `Person`: name, URL, image, email, job/research descriptors grounded in page content, and the existing social/academic profile URLs as `sameAs`.
- Do not emit individual `ScholarlyArticle` JSON-LD records unless every required bibliographic field is verified; the HTML bibliography and DOI links remain authoritative.
- Update `robots.txt` to a concise valid allow-all + sitemap declaration and deduplicate/update `sitemap.xml` to one homepage URL with a deliberate modification date at implementation time.

## 11. Performance and privacy

- Ship no framework and no third-party runtime CSS/JS.
- Remove Google Analytics, Facebook SDK/share button, X/Twitter widget, CDN Academicons, and all legacy JavaScript. Existing profile links remain as ordinary privacy-preserving links.
- Load `profile.jpeg` with explicit width/height, `decoding="async"`; prioritize only hero-critical media. Below-fold images, if any are added later, use `loading="lazy"` and explicit dimensions.
- Use CSS gradients/SVG for the hero visual rather than a heavy new raster image. Evaluate whether `header-background.jpg` improves the final composition; do not load it if not used.
- System font stack avoids font requests and legacy font payloads.
- Minimize render-blocking files: one local stylesheet and one deferred local script; no unnecessary preload.
- Verify layout stability, request count, no-JS behavior, and browser console after implementation.

## 12. Asset management

### Preserve initially

- `images/profile.jpeg` — active profile image.
- `images/favicon.ico` — current favicon, subject to adding modern local favicon variants only if created as part of implementation.
- `images/header-background.jpg` — retain until the redesigned hero decision is made; it is a possible source asset.
- `bibtex/*.bib` — 13 existing bibliography files, all retained and linked where currently available.

### Candidate removals after reference audit and V2 verification

- `demo.html` (unlinked template demo).
- `css/default.css`, `css/layout.css`, `css/media-queries.css`, `css/magnific-popup.css`, `css/fonts.css`.
- `css/font-awesome/`, `css/fontello/`, and legacy font families if no V2 file references them.
- `js/` legacy libraries and `compressed/JS/` duplicates.
- `images/bg.jpg`, `overlay-bg.png`, `overlay-zoom.png`, and `loader.gif` if unreferenced by V2.
- `.htaccess`, since GitHub Pages does not apply Apache rules; retain only if an explicit non-GitHub deployment requirement emerges.

No removal occurs until `rg` reference checks cover HTML, CSS, JS, documentation, and bibliography links, followed by a local browser/static validation.

## 13. Dependencies to remove / retain

### Remove

- jQuery 1.10.2 and jQuery 3.4.1 CDN loading.
- jQuery Migrate 1.2.1.
- Modernizr 2.8.3.
- FlexSlider, Magnific Popup, FitText, Waypoints.
- Facebook SDK, Google Analytics/gtag, X/Twitter widgets, and Academicons CDN.
- Their unused template CSS, image, and font dependencies after the reference audit.

### Retain

- No JavaScript/CSS runtime dependency.
- The browser platform: CSS feature queries, `IntersectionObserver` when present, native anchors, `matchMedia`, and `localStorage` guarded by fallbacks.
- Existing external content links (DOI, institutional/project pages, GitHub repositories, media, and the approved social profiles), because they are content references rather than application dependencies.

## 14. Verified content inventory

The following is verified directly from the current `index.html`; counts deliberately correct the earlier high-level inventory where necessary.

### Identity, biography, contact, and profiles

- Pietro Biondi; Ph.D. and Master’s Degree in Network and Security Systems at University of Catania (UNICT).
- Born in Catania (CT) in 1994; Computer Science enrollment in 2014; Bachelor’s in 2017; Master’s in 2019, 110/110 cum laude; PhD in Computer Science in 2023.
- Listed languages: Python, C, C++, Ruby, PHP, JavaScript, SQL, Java, HTML.
- Profiles to retain exactly: Twitter/X (`Pietro_Biondi94`), LinkedIn, GitHub, Google Scholar, DBLP, ResearchGate, ORCID, and `mailto:pietro.biondi@phd.unict.it`.

### Currently

Only one current item is supported by the repository: **Ministero della Salute (MdS), February 2023–present**. V2 should render this as a small, easily editable data-like block in `index.html`; it must not infer a job title or responsibilities absent from the source.

### Research areas grounded in current content

- Cybersecurity.
- Automotive security; CAN bus security; automotive privacy and safety.
- Privacy.
- IoT security and penetration testing.
- Network security, including printers and VoIP.
- Functional Safety.
- Security, safety, privacy, and trust.

### Experience — 7 records

1. Ministero della Salute (MdS), February 2023–present.
2. High school Professor, MIUR, September 2022–June 2023.
3. PON project external expert, IISS “Ven. Ignazio Capizzi” Bronte, May–June 2022; course “Internet and safe surfing on the net”; project “Apprendimento e socialità”, module “Sperimentando”, code 10.2.2A-FSEPON-SI-2021-403, CUP H93D21000720006.
4. Internship Functional Safety, Huawei–Evidence, April–October 2021, remote; research and development in Functional Safety.
5. Researcher Cybersecurity & Privacy, National Research Council (IIT–CNR), February 2018–November 2019, Pisa; Automotive Security; project managers Dr. Gianpiero Costantino and Dott.ssa Ilaria Matteucci.
6. Cloud computing technician, cloud security, National Institute of Nuclear Physics (INFN), June–July 2017, Catania; OpenStack, networking, security.
7. Organizational secretariat, Google Developer Group Catania, December 2016–July 2017, Catania; mailing, contacts, event-service-provider relationships.

### Education — 8 records

1. Università di Catania, Ph.D. XXXV Cycle, Grant UNICT, 31/10/2019–13/03/2023; thesis “Automotive 2.0: Security, privacy and safety in today’s automotive domain”; supervisor Prof. Giampaolo Bella.
2. Università di Catania, Master’s degree, Network and Security Systems, 110/110 cum laude, 2018–26/07/2019.
3. International Summer School on Forensics (IFOSS 2022), July 2022.
4. CISPA Helmholtz Center for Information Security, Security Convention for Young Researchers (SeCon 2020), August 2020.
5. University Residential Center of Bertinoro, 19th International School on Foundations of Security Analysis and Design (FOSAD 2019), August 2019.
6. Sheffield Hallam University, Erasmus+, 2018–2019.
7. University of Graz, European Summer School on Information Science (ESSIS 2018), July 2018.
8. Università di Catania, Bachelor’s degree in Computer Science, 2014–29/09/2017.

### Publications — **17 verified records**

Initially visible in the current site (13):

1. *PETIoT: PEnetration Testing the Internet of Things* — Giampaolo Bella, Pietro Biondi, Stefano Bognanni, Sergio Esposito; Elsevier Journal Internet of Things; DOI 10.1016/j.iot.2023.100707.
2. *Designing and implementing an AUTOSAR-based Basic Software Module for enhanced security* — Giampaolo Bella, Pietro Biondi, Gianpiero Costantino, Ilaria Matteucci; Elsevier Journal Computer Networks; DOI 10.1016/j.comnet.2022.109377.
3. *A double assessment of privacy risks aboard top-selling cars* — Giampaolo Bella, Pietro Biondi, Giuseppe Tudisco; Springer Journal Automotive Innovation; DOI text 10.1007/s42154-022-00203-2 (current href is broken and must be corrected to its DOI URL).
4. *Multi-service threats: Attacking and protecting network printers and VoIP phones alike* — Giampaolo Bella, Pietro Biondi, Stefano Bognanni; Elsevier Journal Internet of Things; DOI 10.1016/j.iot.2022.100507; BibTeX `journalElsevierIoTbibtex.bib`.
5. *Papyrus-Based Safety Analysis Automatization* — Pietro Biondi, Fabrizio Tronci, Giampaolo Bella; International Conference on System Reliability and Science (ICSRS 2022); DOI 10.1109/ICSRS56243.2022.10067259.
6. *Vulnerability Assessment and Penetration Testing on IP camera* — Pietro Biondi, Stefano Bognanni, Giampaolo Bella; IOTSMS 2021; pp. 136–143; DOI 10.1109/IOTSMS53705.2021.9704890; BibTeX `IOTSMS21bibtex.bib`.
7. *Privacy and modern cars through a dual lens* — Giampaolo Bella, Pietro Biondi, Marco De Vincenzi, Giuseppe Tudisco; STRIVE21; pp. 136–143; DOI 10.1109/EuroSPW54576.2021.00022; BibTeX `STRIVE21bibtex.bib`.
8. *Car drivers’ privacy concerns and trust perceptions* — Giampaolo Bella, Pietro Biondi, Giuseppe Tudisco; TrustBUS 2021; pp. 143–154; DOI 10.1007/978-3-030-86586-3_10; BibTeX `TRUSTBUS21bibtex.bib`.
9. *Towards the COSCA framework for “COnseptualing Secure CArs”* — Giampaolo Bella, Pietro Biondi, Gianpiero Costantino, Ilaria Matteucci, Mirco Marchetti; OID2021; pp. 37–46; handle 20.500.12116/36500; BibTeX `OID21bibtex.bib`.
10. *CINNAMON: A Module for AUTOSAR Secure Onboard Communication* — Giampaolo Bella, Pietro Biondi, Gianpiero Costantino, Ilaria Matteucci; EDCC2020; pp. 103–110; DOI 10.1109/EDCC51268.2020.00026; BibTeX `edcc2020bibtex.bib`.
11. *VoIP Can Still Be Exploited-Badly* — Pietro Biondi, Stefano Bognanni, Giampaolo Bella; FMEC 2020; pp. 237–243; DOI 10.1109/FMEC49853.2020.9144875; BibTeX `10.1109FMEC49853.20209144875.bib`.
12. *You overtrust your printer* — Giampaolo Bella, Pietro Biondi; SAFECOMP 2019, LNCS vol. 11699, pp. 264–274; DOI 10.1007/978-3-030-26250-1_21; BibTeX `10.1007_978-3-030-26250-1_21.bib`.
13. *TOUCAN A proTocol tO secUre Controller Area Network* — Giampaolo Bella, Pietro Biondi, Gianpiero Costantino, Ilaria Matteucci; AutoSec 2019; pp. 3–8; DOI 10.1145/3309171.3309175; BibTeX `Bella-2019-TPS-3309171-3309175.bib`.

Initially disclosed by “Read more” (4):

14. *Implementing CAN bus security by TOUCAN* — Pietro Biondi, Giampaolo Bella, Gianpiero Costantino, Ilaria Matteucci; MobiHoc 2019; pp. 399–400; DOI 10.1145/3323679.3326614; BibTeX `Biondi-2019-IBS-3323679-3326614.bib`.
15. *Poster: Are you secure in your car?* — Giampaolo Bella, Pietro Biondi, Gianpiero Costantino, Ilaria Matteucci; WiSec 2019; pp. 308–309; DOI 10.1145/3317549.3326305; BibTeX `Bella-2019-YSY-3317549-3326305.bib`.
16. *A MapReduce based tool for the analysis and discovery of novel therapeutic targets* — Giuseppe Parasiliti, Marzio Pennisi, Pietro Biondi, Giuseppe Sgroi, Giulia Russo, Christian Napoli, Francesco Pappalardo; PDP 2019; pp. 323–328; DOI 10.1109/EMPDP.2019.8671609; BibTeX `pdpmapreduce.bib`.
17. *Towards an Integrated Penetration Testing Environment for the CAN Protocol* — Giampaolo Bella, Pietro Biondi; SAFECOMP 2018, LNCS vol. 11094, pp. 344–352; DOI 10.1007/978-3-319-99229-7_29; BibTeX `10.1007_978-3-319-99229-7_29.bib`.

### Projects — **11 verified records**

Initially visible in the current site (5):

1. COnceptualising Secure CArs (COSCA) — H2020 N 825618, NGI_TRUST 2nd Open Call, 2019002; security, safety, privacy, trust in automotive; project website.
2. CyberChallenge.IT 2020, 2021, 2022 — organizer; cybersecurity training for high school and university students; project website.
3. Thesis: “Study, design and implementation of a security protocol on CAN bus” — supervisor Prof. Giampaolo Bella; advisors Dr. Gianpiero Costantino and Dott.ssa Ilaria Matteucci.
4. Thesis: “HTTP Strict Transport Security attacks on modern browsers: a comparative analysis” — HSTS and SSLStrip; supervisor Prof. Giampaolo Bella.
5. CAN Flood post exploitation for CAN on Metasploit-Framework — configurable CAN-interface/frame-list flooding module; Rapid7 Metasploit pull request.

Initially disclosed by “Read more” (6):

6. Crazy Tachymeter — CAN-Bus ECU mapping-frame flooding exploit; GitHub repository.
7. Distributed dictionary attack — Java vulnerable server with incremental ban system and RabbitMQ clients; GitHub repository.
8. Capture The Flag — UNICT 2017 — attack/defend competition; website and GitHub repository.
9. Food-Classification — UNICT Social Media Management project that classifies images as food/non-food; GitHub repository.
10. Linear Regression Tool — linear regression with statistical parameters; GitHub repository.
11. Zeppelin-Slim-GDGCatania — single-page slim version of Project Zeppelin for GDG Catania; website and GitHub repository.

### Talks — 4 records

1. Hardening Six “The AvA event” — “Printjack and Phonejack attacks”, 25 May 2022; Hardening link.
2. NGIoT e-workshop on ETSI IoT Standard — “Security of modern vehicles in the IoT world”, 24 May 2019; NGIoT link.
3. GNU/Linux Day 2019 — Metasploit overview and Automotive Crazy-Tachymeter application, 23 Nov 2019; Linux Day link.
4. WSF19 — The 2019 Workshop on Security Frameworks — “Metasploiting 4U”, 4 Dec 2019; WSF19 link.

### Media — 8 records

1. Rai TGR Sicilia — “Hacker all’attacco di Alexa, la scoperta a Catania”.
2. Rai TGR Sicilia — “Catania, il team che studia gli attacchi hacker e come difendersi”.
3. TechRadar — “Mischievous hackers could use a simple trick to send printers berserk”.
4. BleepingComputer — “Researchers warn of severe risks from ‘Printjack’ printer attacks”.
5. Heimdal Security — “‘Printjack’ Printer Attacks Pose a Serious Threat, Researchers Warn”.
6. Bollettino UNICT — “Cybersecurity, a rischio la sicurezza dei dati veicolati tramite le stampanti”.
7. Bollettino UNICT — CyberChallenge local final/team selection, 2020.
8. Bollettino UNICT — CyberChallenge etnea winners, 2021.

## 15. Content-conservation checklist

- [ ] Reconcile every one of the 17 publication cards with the inventory; retain authors, venue, year/date information, page details, DOI/handle, and BibTeX actions exactly when available.
- [ ] Reconcile every one of the 11 project cards and every source link.
- [ ] Retain all 7 experience and 8 education records, including dates, supervisors/advisors, descriptions, institutions, course/project identifiers, and existing institutional links.
- [ ] Retain all 4 talks, 8 media references, the biography, listed languages, and all 8 approved contact/social endpoints.
- [ ] Preserve the profile image, favicon, 13 BibTeX files, and any V2-used visual asset.
- [ ] Correct broken/insecure links only after directly verifying the intended canonical target; do not silently replace content.
- [ ] Confirm no CV affordance, new social profile, invented technology/category, or unverified role is introduced.
- [ ] Test disclosure/search behavior with and without JavaScript; hidden content must remain reachable.

## 16. Progressive implementation plan

1. Reconfirm branch and clean worktree; snapshot content inventory against the source page.
2. Create the new semantic `index.html` skeleton and migrate all verified content into the V2 architecture before deleting any legacy file.
3. Implement local CSS tokens, dark default/light theme, responsive layout, hero, timelines, cards, and focus/reduced-motion styles.
4. Add the small deferred vanilla script for theme, menu, navigation state, disclosures, and optional publication filtering.
5. Rebuild SEO metadata, Person/WebSite JSON-LD, `robots.txt`, and deduplicated sitemap.
6. Replace external social widgets and analytics with ordinary profile links; remove old runtime dependencies.
7. Run reference audits, static checks, keyboard/no-JS/reduced-motion/responsive validation, and inspect network requests/layout stability.
8. Remove only assets and template files proven unreferenced; re-run the audit and verify the published static-file assumptions.
9. Present a change summary and verification results before any merge/push decision.
