// Generates content/companies.data.ts and content/resources.data.ts from the
// research tables in docs/research/01 and 07, so no row is transcribed by hand.
// Run: pnpm build:research-data

import { readFileSync, writeFileSync } from "node:fs";
const root = process.argv[2] ?? process.cwd();
const links = (cell) => [...cell.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)].map((m) => ({ label: m[1].trim(), url: m[2].trim() }));
const strip = (s) => s.replace(/\*\*/g, "").trim();
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const rows = (lines) => lines.filter((l) => l.startsWith("|") && !/^\|\s*-+/.test(l)).map((l) => l.slice(1, -1).split("|").map((c) => c.trim()));

// Companies: the launches table in 01.
const l01 = readFileSync(`${root}/docs/research/01-gcc-landscape.md`, "utf8").split(/\r?\n/);
const start = l01.findIndex((l) => l.startsWith("## Recent launches"));
const table = [];
for (let i = start + 1; i < l01.length; i++) { if (l01[i].startsWith("|")) table.push(l01[i]); else if (table.length) break; }
const companies = rows(table).slice(1).map(([company, city, when, scale, focus, source]) => {
  const m = strip(company).match(/^(.*?)\s*(?:\((.*)\))?$/);
  const src = links(source)[0];
  return {
    id: slug(m[1]), name: m[1].trim(), note: m[2] ?? null,
    cities: city.split(",").map((c) => c.trim()),
    when: when.replace(/\s*\(ann\.\)/, ""), announced: /\(ann\.\)/.test(when),
    scale, focus, sourceLabel: `Source: ${src.label}`, sourceUrl: src.url, checkedOn: "2026-10-20", verified: false,
  };
});

// Resources: every table in 07, grouped by its ## heading.
const l07 = readFileSync(`${root}/docs/research/07-resource-library.md`, "utf8").split(/\r?\n/);
const resources = []; let section = null; let buf = [];
const flush = () => { if (!buf.length) return; for (const [res, type, why] of rows(buf).slice(1)) { const [main, ...more] = links(res); resources.push({ id: slug(`${section}-${main.label}`).slice(0, 60), section, title: main.label, url: main.url, moreLinks: more, type, why, checkedOn: "2026-10-20" }); } buf = []; };
for (const line of l07) {
  if (line.startsWith("## ")) { flush(); section = line.slice(3).replace(/^[^A-Za-z]+/, "").trim(); }
  else if (line.startsWith("|")) buf.push(line); else flush();
}
flush();

const header = (src, what) => `// GENERATED from ${src} (${what}).
// Do not edit by hand: change the research doc and run pnpm build:research-data.
// Research as of 2026-10-20.
`;
writeFileSync(`${root}/content/companies.data.ts`, `${header("docs/research/01-gcc-landscape.md", "Recent launches and expansions")}//\n// TODO(verify): the research warns that trackers mix launched and announced\n// centres, so every entry is unverified until confirmed against its source.\n\nimport type { Company } from "@/types/domain";\n\nexport const companies: Company[] = ${JSON.stringify(companies, null, 2)};\n`);
writeFileSync(`${root}/content/resources.data.ts`, `${header("docs/research/07-resource-library.md", "every table")}\nimport type { Resource } from "@/types/domain";\n\nexport const resources: Resource[] = ${JSON.stringify(resources, null, 2)};\n`);
console.log(companies.length, "companies;", resources.length, "resources;", new Set(resources.map(r=>r.id)).size, "unique ids");
