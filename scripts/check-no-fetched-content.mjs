/**
 * Fail if a fetched article body was written into the repo or the static export.
 * Feed addresses in source are public URLs, not article text, and are allowed.
 *
 * Optional: node scripts/check-no-fetched-content.mjs --markers /tmp/markers.txt
 * Each marker must be at least 18 characters. They are searched in the export
 * and in tracked-looking source, excluding the CC-CEDICT file.
 */
import fs from "fs";
import path from "path";

const root = process.cwd();
const skipDirs = new Set(["node_modules", ".git", ".next", ".wrangler", "relay/node_modules"]);
const args = process.argv.slice(2);
const markerFlag = args.indexOf("--markers");
const markerFile = markerFlag >= 0 ? args[markerFlag + 1] : "";

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    if (skipDirs.has(name)) continue;
    const full = path.join(dir, name);
    let stat;
    try {
      stat = fs.statSync(full);
    } catch {
      continue;
    }
    if (stat.isDirectory()) walk(full, out);
    else if (stat.isFile() && stat.size < 8_000_000 && !name.endsWith(".gz")) out.push(full);
  }
  return out;
}

const problems = [];
for (const relative of ["fixtures/live", "lib/data/live", "public/feeds"]) {
  if (fs.existsSync(path.join(root, relative))) problems.push(`unexpected path ${relative}`);
}

const files = [
  ...walk(path.join(root, "app")),
  ...walk(path.join(root, "components")),
  ...walk(path.join(root, "lib")),
  ...walk(path.join(root, "public")),
  ...walk(path.join(root, "out")),
  ...walk(path.join(root, "relay/src")),
];

const forbidden = ["ZHONGYAN_FETCHED_ARTICLE_FIXTURE"];
if (markerFile) {
  if (!fs.existsSync(markerFile)) {
    console.error(`Marker file not found: ${markerFile}`);
    process.exit(1);
  }
  for (const line of fs.readFileSync(markerFile, "utf8").split("\n")) {
    const marker = line.trim();
    if (marker.length >= 18) forbidden.push(marker);
  }
}

for (const file of files) {
  if (file.endsWith(`${path.sep}cedict.txt.gz`) || file.endsWith(`${path.sep}CEDICT-LICENSE.txt`)) continue;
  let text;
  try {
    text = fs.readFileSync(file, "utf8");
  } catch {
    continue;
  }
  for (const marker of forbidden) {
    if (text.includes(marker)) problems.push(`${path.relative(root, file)} contains fetched marker: ${marker.slice(0, 48)}`);
  }
}

if (problems.length) {
  console.error("Fetched article content leaked into the project or the static export:");
  for (const problem of problems) console.error(`- ${problem}`);
  process.exit(1);
}

console.log(`No fetched article content in ${files.length} files.`);
