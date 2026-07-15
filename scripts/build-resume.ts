#!/usr/bin/env node
import { readdir, readFile, mkdir, writeFile, stat, chmod } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { spawn } from "node:child_process";
import { join, resolve } from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { tmpdir } from "node:os";
import { parse as parseYaml } from "yaml";

const TYPST_VERSION = "0.14.2";
const PROJECT_ROOT = resolve(import.meta.dirname, "..");
const RESUME_DIR = join(PROJECT_ROOT, "src/content/resume");
const OUTPUT_PDF = join(PROJECT_ROOT, "public/resume/samuel-dillow-resume.pdf");
const CACHE_DIR = join(PROJECT_ROOT, "node_modules/.cache/typst", TYPST_VERSION);

type Entry = {
  company: string;
  role: string;
  startDate: Date;
  endDate?: Date;
  dateLabel?: string;
  summary: string;
  bullets: string[];
  tags: string[];
  emphasis: "promoted" | "normal" | "subdued";
  location?: string;
  hideFromResume: boolean;
  clientEngagements: {
    company: string;
    role: string;
    dateLabel?: string;
    summary: string;
    bullets: string[];
    tags: string[];
  }[];
};

const exists = async (path: string) => {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
};

const run = (cmd: string, args: string[]) =>
  new Promise<void>((res, rej) => {
    const child = spawn(cmd, args, { stdio: "inherit" });
    child.on("error", rej);
    child.on("exit", (code: number | null) =>
      code === 0 ? res() : rej(new Error(`${cmd} exited with code ${code}`)),
    );
  });

async function ensureTypst(): Promise<string> {
  const onPath = await new Promise<boolean>((res) => {
    const c = spawn("typst", ["--version"], { stdio: "ignore" });
    c.on("error", () => res(false));
    c.on("exit", (code: number | null) => res(code === 0));
  });
  if (onPath) return "typst";

  const cached = join(CACHE_DIR, "typst");
  if (await exists(cached)) return cached;

  const triple = pickTriple();
  const url = `https://github.com/typst/typst/releases/download/v${TYPST_VERSION}/typst-${triple}.tar.xz`;
  console.log(`Downloading typst ${TYPST_VERSION} for ${triple}...`);

  await mkdir(CACHE_DIR, { recursive: true });
  const archive = join(tmpdir(), `typst-${TYPST_VERSION}-${Date.now()}.tar.xz`);
  const res = await fetch(url);
  if (!res.ok || !res.body) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  await pipeline(Readable.fromWeb(res.body as any), createWriteStream(archive));

  await run("tar", ["-xJf", archive, "-C", CACHE_DIR, "--strip-components=1"]);
  await chmod(cached, 0o755);
  return cached;
}

function pickTriple(): string {
  const { platform, arch } = process;
  if (platform === "darwin" && arch === "arm64") return "aarch64-apple-darwin";
  if (platform === "darwin" && arch === "x64") return "x86_64-apple-darwin";
  if (platform === "linux" && arch === "x64") return "x86_64-unknown-linux-musl";
  if (platform === "linux" && arch === "arm64") return "aarch64-unknown-linux-musl";
  throw new Error(`Unsupported platform: ${platform} ${arch}`);
}

function parseFrontmatter(raw: string): Entry {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) throw new Error("No frontmatter");
  const data = parseYaml(match[1]);
  return {
    company: data.company,
    role: data.role,
    startDate: new Date(data.startDate),
    endDate: data.endDate ? new Date(data.endDate) : undefined,
    dateLabel: data.dateLabel,
    summary: data.summary,
    bullets: data.bullets ?? [],
    tags: data.tags ?? [],
    emphasis: data.emphasis ?? "normal",
    location: data.location,
    hideFromResume: data.hideFromResume ?? false,
    clientEngagements: data.clientEngagements ?? [],
  };
}

async function loadEntries(): Promise<Entry[]> {
  const files = (await readdir(RESUME_DIR)).filter((f: string) => f.endsWith(".md"));
  const entries = await Promise.all(
    files.map(async (f: string) => parseFrontmatter(await readFile(join(RESUME_DIR, f), "utf8"))),
  );
  return entries
    .filter((entry: Entry) => !entry.hideFromResume)
    .sort((a: Entry, b: Entry) => b.startDate.valueOf() - a.startDate.valueOf());
}

const formatRange = (start: Date, end?: Date) =>
  end ? `${start.getFullYear()} - ${end.getFullYear()}` : `${start.getFullYear()} - Present`;

const isCurrent = (e: Entry) => {
  if (e.emphasis === "promoted") return true;
  if (e.emphasis === "subdued") return false;
  return e.endDate === undefined;
};

// Typst content-mode escaping. Special chars: \ # * _ [ ] < > $ @ ~ `
const esc = (s: string) =>
  s.replace(/([\\#*_\[\]<>$@~`])/g, "\\$1");

function renderEntry(e: Entry): string {
  const label = e.dateLabel ?? formatRange(e.startDate, e.endDate);
  const lines: string[] = [];
  lines.push(`#block(below: 1.4em)[`);
  lines.push(`  #block(spacing: 0.55em)[`);
  lines.push(`    #text(size: 11.5pt, weight: "bold")[${esc(e.company)}] \\`);
  lines.push(`    #text(size: 9.5pt)[${esc(e.role)} #h(0.5em) | #h(0.5em) ${esc(label)}]`);
  lines.push(`  ]`);
  lines.push(``);
  lines.push(`  ${esc(e.summary)}`);
  lines.push(``);
  if (e.clientEngagements.length > 0) {
    lines.push(`  #text(size: 8.5pt, weight: "bold")[Selected client engagements]`);
    lines.push(``);
    for (const engagement of e.clientEngagements) {
      const date = engagement.dateLabel
        ? ` #h(0.45em) | #h(0.45em) ${esc(engagement.dateLabel)}`
        : "";
      lines.push(`  #block(below: 0.7em, inset: (left: 0.65em))[`);
      lines.push(`    #text(size: 9.5pt, weight: "bold")[${esc(engagement.company)}]#text(size: 8.5pt)[${date}] \\`);
      lines.push(`    #text(size: 8.5pt)[${esc(engagement.role)}] \\`);
      lines.push(`    #text(size: 9pt)[${esc(engagement.summary)}]`);
      if (engagement.bullets.length > 0) {
        lines.push(`    #list(spacing: 0.35em,`);
        for (const bullet of engagement.bullets) {
          lines.push(`      [#text(size: 8.7pt)[${esc(bullet)}]],`);
        }
        lines.push(`    )`);
      }
      if (engagement.tags.length > 0) {
        lines.push(`    #text(size: 7.7pt, fill: rgb("#555"))[Skills: ${esc(engagement.tags.join(", "))}]`);
      }
      lines.push(`  ]`);
    }
    lines.push(``);
  }
  if (e.bullets.length > 0) {
    lines.push(`  #list(spacing: 0.7em,`);
    for (const b of e.bullets) {
      lines.push(`    [${esc(b)}],`);
    }
    lines.push(`  )`);
    lines.push(``);
  }
  if (e.tags.length > 0) {
    lines.push(
      `  #text(size: 8.5pt, fill: rgb("#555"))[Skills: ${esc(e.tags.join(", "))}]`,
    );
  }
  lines.push(`]`);
  return lines.join("\n");
}

// Aggregated, categorized skill summary for the top of the resume. This is the
// block ATS and recruiters scan first, so it carries the exact standard terms.
const skillGroups: { label: string; items: string[] }[] = [
  { label: "Languages", items: ["TypeScript", "JavaScript", "C#", "C++", "Swift", "Objective-C", "Java", "Python"] },
  { label: "Frontend", items: ["React", "Next.js", "Angular", "WebGL"] },
  { label: "Backend & APIs", items: ["Node.js", ".NET", "PostgreSQL", "API Design", "Distributed Systems"] },
  { label: "Cloud & DevOps", items: ["AWS", "Docker", "Kubernetes", "CI/CD", "Observability", "Network Monitoring", "Performance Metrics"] },
  { label: "AI", items: ["Generative AI", "LangChain", "Computer Vision", "AI-assisted Software Development"] },
  { label: "Security", items: ["Cybersecurity", "OAuth2", "JSON Web Token (JWT)"] },
  { label: "Leadership & Delivery", items: ["Software Architecture", "Technical Leadership", "Team Leadership", "Mentoring", "Product Engineering", "Full-Stack Development", "SaaS", "Operational Software"] },
];

function renderSkills(): string {
  const rows = skillGroups
    .map(
      (g) =>
        `  [#text(weight: "bold")[${esc(g.label)}]], [${esc(g.items.join(", "))}],`,
    )
    .join("\n");
  return [
    `#grid(`,
    `  columns: (auto, 1fr),`,
    `  row-gutter: 0.5em,`,
    `  column-gutter: 1em,`,
    rows,
    `)`,
  ].join("\n");
}

function renderDocument(entries: Entry[]): string {
  const current = entries.filter(isCurrent);
  const earlier = entries.filter((e) => !isCurrent(e));

  const lead1 =
    "I help small teams ship practical software, AI workflows, SaaS features, automation, and infrastructure fixes without needing a full-time hire.";
  const lead2 =
    "Most useful when the work crosses product code, backend systems, hosting, and real operational constraints.";

  return `
#set page(paper: "us-letter", margin: (x: 0.85in, y: 0.85in))
#set text(font: "Libertinus Serif", size: 10pt)
#set par(leading: 0.7em, spacing: 0.9em, justify: false)
#show heading.where(level: 1): it => {
  v(1.2em)
  block[#text(size: 14pt, weight: "bold")[#it.body]]
  line(length: 100%, stroke: 0.4pt)
  v(0.6em)
}

#text(size: 22pt, weight: "bold")[Samuel Dillow] \\
#v(0.2em)
#text(size: 12pt, weight: "bold")[Senior engineer for practical systems.]

#v(0.4em)
#text(size: 9pt)[samuel\\@samueldillow.com #h(0.5em) | #h(0.5em) samueldillow.com/resume #h(0.5em) | #h(0.5em) 501-551-4868 #h(0.5em) | #h(0.5em) linkedin.com/in/samueldillow]

#v(0.9em)
${esc(lead1)}

${esc(lead2)}

= Core Skills

${renderSkills()}

= Current Work

${current.map(renderEntry).join("\n")}

= Earlier Experience

${earlier.map(renderEntry).join("\n")}
`;
}

async function main() {
  const typst = await ensureTypst();
  const entries = await loadEntries();
  const source = renderDocument(entries);

  const tmpTyp = join(tmpdir(), `resume-${Date.now()}.typ`);
  await writeFile(tmpTyp, source);
  await mkdir(join(PROJECT_ROOT, "public/resume"), { recursive: true });
  await run(typst, ["compile", tmpTyp, OUTPUT_PDF]);
  console.log(`Wrote ${OUTPUT_PDF}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
