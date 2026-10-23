# India map: boundary source

Required by section 2 of [`docs/india-map-spec.md`](../india-map-spec.md). This
records where the India outline on the landing page comes from, under what
licence, and how to reproduce it.

## Source used

| Field | Value |
| --- | --- |
| Dataset | `Country/india-soi.geojson` — "India - Admin 0 with Disputed Territories" |
| Publisher | DataMeet India community, [`datameet/maps`](https://github.com/datameet/maps) |
| File URL | <https://raw.githubusercontent.com/datameet/maps/master/Country/india-soi.geojson> |
| Upstream provenance | Dissolved from the [Census of India 2011 district boundaries / Survey of India index maps](https://github.com/datameet/maps/tree/master/Survey-of-India-Index-Maps/Boundaries) held in the same repository |
| Licence | CC-BY-SA 2.5 / ODbL (stated in [`Country/README.md`](https://github.com/datameet/maps/blob/master/Country/README.md); the repository's default data licence is [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)) |
| Downloaded | 2026-10-23 |
| Size | 12,330,591 bytes |
| SHA-256 | `e5321e2010d060c0bffa3b51a1e691af8fbf6063b848c02c123d61d4084cf820` |
| Local path | `data/source/india-soi.geojson` (git-ignored — see "Reproducing" below) |

The dataset's own feature property records its origin as
`Source: "Survey of India State Map, Datameet"`, and the folder README states
the land area is given "in accordance with the [Official boundary of India as
per the Survey of India](http://www.surveyofindia.gov.in/pages/display/190-public-awareness)".

### Attribution to carry

> [India boundaries](https://github.com/datameet/maps/blob/master/Country/india-soi.geojson)
> by [DataMeet India community](http://datameet.org/)

This attribution is reproduced in the header of the generated file
`components/graphics/india-map.paths.ts`.

## Why this file and not the alternatives

`datameet/maps` offers three India outlines. Each was downloaded and tested
against the eight point-in-polygon checks in section 4 of the spec:

| File | Provenance | Result |
| --- | --- | --- |
| **`india-soi.geojson`** | Census of India 2011 / Survey of India | **All 8 points inside. Selected.** |
| `india-composite.geojson` | LSIB (US State Dept), Pakistan admin boundaries, Natural Earth | 7 of 8 — **Kavaratti (Lakshadweep) falls outside** |
| `india-osm.geojson` | OpenStreetMap | Not tested; the spec rules out OSM-derived outlines |

`india-soi.geojson` is also the only one of the three derived from official
Indian data rather than compiled from global sources, which is the order of
preference the spec sets out.

Rejected outright, per the spec: Natural Earth and OpenStreetMap country
outlines, which depict the northern boundary differently.

## What the boundary includes

Verified by the automated tests in `components/graphics/india-map.test.ts`,
which run point-in-polygon checks against the **generated** path rather than
the source file, so over-simplification is caught in CI:

- Jammu and Kashmir in full, including Pakistan-occupied Kashmir (Muzaffarabad)
  and Gilgit-Baltistan (Gilgit)
- Ladakh including Aksai Chin
- Arunachal Pradesh (Itanagar)
- The full mainland coastline (Kanyakumari)
- Andaman and Nicobar Islands (Port Blair) and Lakshadweep (Kavaratti)

## Reproducing

The source GeoJSON is 12 MB and is **not committed**; `/data/source/` is
git-ignored. The generated path file is committed, so a normal checkout builds
and tests without downloading anything. To regenerate the map:

```sh
mkdir -p data/source
curl -sSL -o data/source/india-soi.geojson \
  https://raw.githubusercontent.com/datameet/maps/master/Country/india-soi.geojson
sha256sum data/source/india-soi.geojson   # must match the SHA-256 above
pnpm build:map
pnpm test
```

`pnpm build:map` runs `scripts/build-india-map.ts` with Node's built-in type
stripping. No dependency is added for any of this.

## Processing steps

All performed by `scripts/build-india-map.ts`:

1. **Project.** Albers equal-area conic, centre 22°N 82°E, standard parallels
   12°N and 28°N. The same `project(lon, lat)` is emitted into the generated
   file and used for the city dots, so dots and coastline cannot drift apart.
2. **Fit.** Scale and translate every ring into a 320 × 368 unit box,
   preserving aspect ratio.
3. **Simplify.** Douglas–Peucker at a 0.22 unit tolerance on the mainland and
   coastal islands. The script measures the largest deviation it actually
   introduced, reported separately for points north of 30°N, and prints both;
   at the current setting the northern boundary moves by at most 0.22 units,
   which is under one rendered pixel.
4. **Island territories.** Lakshadweep and Andaman & Nicobar are *not*
   simplified — every island there is far smaller than the tolerance, so
   simplifying would destroy their shape. The largest few by true area are kept
   and each is grown about its own centre to a minimum visible size. This is
   deliberate cartographic exaggeration: at true scale Kavaratti is roughly a
   fifth of a pixel across. The caption on the page says the map is not to
   scale.
5. **Emit.** `components/graphics/india-map.paths.ts`, currently 52 rings,
   2,749 points, 30.6 KB of path data.

## Owner to-do (spec section 9)

- [ ] Confirm the licence terms are acceptable for commercial use, and that the
      CC-BY-SA / ODbL attribution above appears somewhere a user can reach.
- [ ] Decide whether to serve the same boundary outside India. Boundary
      depiction is contested and varies by jurisdiction; this follows the
      Survey of India standard for an Indian audience.
- [ ] This is not legal advice. Check with a lawyer before launch if in doubt.
