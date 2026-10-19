/**
 * Rebuild public/cedict.txt.gz from a CC-CEDICT UTF-8 export.
 * Usage: node scripts/build-cedict.mjs /path/to/cedict_ts.u8
 * The export is CC BY-SA 4.0. Keep public/CEDICT-LICENSE.txt with the file.
 */
import fs from "fs";
import zlib from "zlib";

const srcPath = process.argv[2];
if (!srcPath) {
  console.error("Usage: node scripts/build-cedict.mjs <cedict_ts.u8>");
  process.exit(1);
}

const MARKS = {
  a: "āáǎàa",
  e: "ēéěèe",
  i: "īíǐìi",
  o: "ōóǒòo",
  u: "ūúǔùu",
  ü: "ǖǘǚǜü",
};

function applyTone(syllable) {
  const match = syllable.match(/^([A-Za-z:üÜ]+)(\d)$/);
  if (!match) return syllable.replaceAll("u:", "ü").replaceAll("v", "ü");
  const body = match[1].replaceAll("u:", "ü").replaceAll("U:", "Ü").replaceAll("v", "ü").replaceAll("V", "ü");
  const tone = Number(match[2]);
  const index = tone >= 1 && tone <= 5 ? tone - 1 : 4;
  const chars = [...body];
  const lower = chars.map((char) => char.toLowerCase()).join("");
  let pos = -1;
  if (lower.includes("a")) pos = lower.indexOf("a");
  else if (lower.includes("e")) pos = lower.indexOf("e");
  else if (lower.includes("ou")) pos = lower.indexOf("o");
  else {
    for (let i = chars.length - 1; i >= 0; i -= 1) {
      if ("aeiouü".includes(chars[i].toLowerCase())) {
        pos = i;
        break;
      }
    }
  }
  if (pos < 0) return body;
  const marked = MARKS[chars[pos].toLowerCase()]?.[index] ?? chars[pos];
  chars[pos] = chars[pos] === chars[pos].toUpperCase() ? marked.toUpperCase() : marked;
  return chars.join("");
}

function convertPinyin(raw) {
  return raw.split(/\s+/).map(applyTone).join(" ");
}

const text = fs.readFileSync(srcPath, "utf8");
const seen = new Set();
const lines = [];
const pattern = /^(\S+)\s+(\S+)\s+\[([^\]]+)\]\s+\/(.+)\/$/;
for (const line of text.split("\n")) {
  if (!line || line.startsWith("#")) continue;
  const match = line.match(pattern);
  if (!match) continue;
  const simplified = match[2];
  if (seen.has(simplified)) continue;
  seen.add(simplified);
  let gloss = match[4].split("/")[0].replace(/\s+/g, " ").trim();
  if (gloss.length > 160) gloss = `${gloss.slice(0, 157)}...`;
  lines.push(`${simplified}\t${convertPinyin(match[3])}\t${gloss.replaceAll("\t", " ")}`);
}

const gz = zlib.gzipSync(Buffer.from(lines.join("\n")), { level: 9 });
fs.writeFileSync(new URL("../public/cedict.txt.gz", import.meta.url), gz);
console.log(`Wrote ${lines.length} entries, ${gz.length} bytes gzipped`);
