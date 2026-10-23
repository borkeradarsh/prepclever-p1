# India GCC Map: Rebuild Spec (for Claude Code)

Read `CLAUDE.md` first. Save this file as `docs/india-map-spec.md`. Work on the existing branch `feat/landing-page`.

## 1. What is wrong today (from a screenshot of the current map)

| # | Problem | Detail |
| --- | --- | --- |
| 1 | **Rough outline** | The coastline was built by smoothing a curve through a few hand-picked lon/lat points, so edges look crude |
| 2 | **Northern boundary looks incomplete** | The north does not appear to show the full official extent of Jammu and Kashmir and Ladakh |
| 3 | **Island groups are rough** | Andaman and Nicobar and Lakshadweep appear as loose ovals and dots |
| 4 | **City dots collide** | Mumbai and Pune overlap heavily; Bengaluru and Chennai are crowded |
| 5 | **Map is small inside its card** | Large empty margins, and the leader lines are long and cross over land |
| 6 | **Weak accessibility and mobile story** | No text alternative, and two columns of labels cannot fit at 375 px |

## 2. Boundary rule (the most important requirement)

This product serves users in India, so the map must show **India's official boundary as published by the Survey of India**: the whole of Jammu and Kashmir including Gilgit-Baltistan (Pakistan-occupied Kashmir), Ladakh including Aksai Chin, and Arunachal Pradesh, plus the full coastline and island territories.

- **Do not hand-draw or reconstruct the outline from remembered coordinates.** Use an authoritative boundary dataset.
- **Source order of preference:** (1) the official Survey of India outline map of India, (2) a boundary dataset whose licence permits use and whose India outline matches the Survey of India depiction. Look for it online yourself. If you cannot download one, stop and tell me exactly which file to download and where to put it (`data/source/`); do not substitute a global dataset (Natural Earth, OpenStreetMap, etc.), because those depict the northern boundary differently.
- Record the source name, URL, licence, download date and any processing steps in `docs/research/map-source.md` and in a header comment of the generated file.
- Simplify geometry only as far as needed for file size (target under about 40 KB of path data). Never simplify so much that the northern boundary changes shape visibly.

## 3. Build approach

1. **One-off build script** `scripts/build-india-map.ts` (Node only; if a helper tool is needed, run it with `pnpm dlx` and do **not** add it to `package.json`). It reads the boundary file, projects it, simplifies it, and writes `components/graphics/india-map.paths.ts` containing precomputed SVG path strings, the viewBox, and projection parameters. The runtime component has **no geo dependencies**.
2. **Projection:** a conic projection if you can implement it simply (Albers or Lambert, centre about 22°N 82°E, standard parallels about 12°N and 28°N); otherwise equirectangular with longitude scaled by cos(22°). One `project(lon, lat)` function, exported from the paths file, is used for **both** the outline and the city dots, so they can never drift apart.
3. **Islands:** draw Andaman and Nicobar and Lakshadweep from the same dataset. If at true positions they leave the map mostly empty, show them as labelled boxed insets at the lower right, scaled consistently, and say so in the caption.

## 4. Boundary tests (`components/graphics/india-map.test.ts`)

Point-in-polygon checks against the generated outline. Each point must be **inside** the outline. Coordinates are approximate and chosen well inside each area; if a test fails because of simplification, reduce simplification, not the test.

| Place | Approx lat, lon |
| --- | --- |
| Muzaffarabad (Pakistan-occupied Kashmir) | 34.37, 73.47 |
| Gilgit (Gilgit-Baltistan) | 35.92, 74.31 |
| Leh (Ladakh) | 34.15, 77.58 |
| Aksai Chin (central) | 35.0, 79.5 |
| Itanagar (Arunachal Pradesh) | 27.08, 93.61 |
| Kanyakumari | 8.09, 77.55 |
| Port Blair (Andaman) | 11.62, 92.73 |
| Kavaratti (Lakshadweep) | 10.57, 72.64 |

Also test: every city dot falls inside the mainland outline; no two dots are closer than the minimum separation in section 5; path data under 60 KB.

## 5. Cities and dots

Data in the existing landing config (shares from foundit, H1 2026). Approximate coordinates, lat and lon:

| City | Lat, lon | Share |
| --- | --- | --- |
| Bengaluru | 12.97, 77.59 | 30% |
| Hyderabad | 17.39, 78.49 | 15% |
| Pune | 18.52, 73.86 | 12% |
| Mumbai | 19.08, 72.88 | 11% |
| Chennai | 13.08, 80.27 | 9% |
| Delhi NCR | 28.61, 77.21 | 8% |
| Ahmedabad, Indore, Coimbatore, Kochi | 23.03, 72.58 / 22.72, 75.86 / 11.02, 76.96 / 9.93, 76.27 | tier 2 (the research gives 15% for tier-2 cities combined, not per city) |

- **Dot size:** area proportional to share. Tier-2 cities are small hollow dots with a note that the 15% is the combined tier-2 share.
- **Collisions:** Mumbai and Pune are about 9 units apart. Give dots a 1.5 px light stroke so overlaps stay readable, cap the largest radius, and let labels move apart on leader lines. Add a unit test for a minimum visual separation after label placement.
- **Labels:** two columns (west and east), ordered by latitude to avoid crossing leader lines. Leader lines are 1 px, stay mostly over the sea or margin, and do not cross each other (test this).
- **Interaction:** hover and keyboard focus on a dot or label shows the city, share and source in a tooltip; no other animation. Respect `prefers-reduced-motion`.

## 6. Layout and responsiveness

- The map fills the card width, with at most 24 px padding. Land fill uses a neutral token tint; outline 1 px in a token colour; dots use the existing rose accent.
- **375 px:** hide leader-line labels. Show the map with numbered dots, and a ranked list below (city, share bar, share). The list is also the accessible alternative at every width, visible on mobile and visually hidden on desktop.
- **768 px and up:** map plus labelled columns as today.
- The SVG has `role="img"` with an `aria-labelledby` title and description summarising the data, and the list or table gives the full figures.

## 7. Caption (in the landing config)

`Share of GCC hiring by city, H1 2026. Source: foundit Insights Tracker via Business Today. Map is illustrative and not to scale; boundary as depicted by the Survey of India.` Tier-2 note as above.

## 8. Acceptance criteria

- [ ] Outline comes from the documented official source; `docs/research/map-source.md` exists with source, licence and date.
- [ ] Boundary tests in section 4 pass.
- [ ] Coastline and islands look clean at 1280 px, with no jagged edges.
- [ ] No overlapping dots or crossing leader lines at 768 and 1280 px.
- [ ] At 375 px the map and ranked list fit with no horizontal scroll.
- [ ] Dots and outline both use the same `project()` function.
- [ ] No new runtime or dev dependencies; typecheck, lint and tests pass.
- [ ] Screenshots at 375, 768 and 1280 px reviewed and attached to the report.

## 9. Owner to-do

Confirm the licence terms of whichever boundary file is used. If the product will later serve users outside India, decide whether to show the same boundary there; boundary depiction is contested and varies by country. This spec follows the Survey of India standard for an Indian audience. This is not legal advice; check with a lawyer before launch if in doubt.
