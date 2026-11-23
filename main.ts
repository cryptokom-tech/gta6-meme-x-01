// gta6-meme-x-01 entry: "Post a GTA 6 meme on X".
//
// The entry itself is the X post: an AI-made GTA 6 meme (meme.png) whose
// picture carries the make.fun ghost, posted from a public X account with
// make.fun (a link or written out) and/or @makefunai plus our play code in
// its text. POST.json at the repo root names that post's address.
//
// This program does exactly one thing: it copies POST.json from the
// repository into the output directory, where the gate reads it. The house
// then reads the post from X itself and builds the dossier the judge sees,
// so nothing written here is judged.
//
// Run it the way the grader does (from the repository root):
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Validate POST.json before copying: the gate reads the copied file, so a
// malformed address file must fail loudly here instead of passing silently.
const postPath = join(botDir, "POST.json");
let post: unknown;
try {
  post = JSON.parse(readFileSync(postPath, "utf8"));
} catch (err) {
  console.error(`POST.json could not be read from ${botDir}: ${(err as Error).message}`);
  process.exit(1);
}
if (typeof post !== "object" || post === null || typeof (post as { url?: unknown }).url !== "string" || !(post as { url: string }).url) {
  console.error(`POST.json in ${botDir} must name the post address as a "url" string`);
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });
try {
  copyFileSync(postPath, join(outputDir, "POST.json"));
} catch (err) {
  console.error(`POST.json could not be copied from ${botDir}: ${(err as Error).message}`);
  process.exit(1);
}
