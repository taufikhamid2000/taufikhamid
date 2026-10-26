/**
 * Offline evaluation of EN -> BM translation pairs. Never calls the API and
 * needs no ANTHROPIC_API_KEY.
 *
 *   npm run eval:translations                       # self-check on the fixture set
 *   npm run eval:translations -- path/to/pairs.json # check your own pairs
 *
 * Input JSON: { "pairs": [{ "id"?, "source", "translated", "expect"? }] } or a
 * bare array of the same. If a pair has `expect` (list of issue codes) the run
 * passes only when the raised codes match exactly (used for the fixtures, which
 * contain deliberately bad pairs). Without `expect`, any issue is a failure.
 * Exit code 1 if any pair fails.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { checkTranslation, type TranslationPair } from '../lib/translation-eval.ts';

interface EvalPair extends TranslationPair {
  id?: string;
  expect?: string[];
}

const fixturePath = fileURLToPath(new URL('./fixtures/translation-pairs.json', import.meta.url));
const file = process.argv[2] ?? fixturePath;

const raw = JSON.parse(readFileSync(file, 'utf8')) as { pairs?: EvalPair[] } | EvalPair[];
const pairs = Array.isArray(raw) ? raw : (raw.pairs ?? []);
if (!pairs.length) {
  console.error(`No pairs found in ${file}`);
  process.exit(1);
}

let failed = 0;
pairs.forEach((p, i) => {
  const label = p.id ?? `#${i + 1}`;
  const { issues } = checkTranslation(p.source, p.translated);
  const codes = issues.map((x) => x.code).sort();
  const pass = p.expect ? JSON.stringify(codes) === JSON.stringify([...p.expect].sort()) : codes.length === 0;
  if (!pass) failed++;
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}${codes.length ? `  [${codes.join(', ')}]` : ''}`);
  if (!pass || !p.expect) for (const issue of issues) console.log(`        ${issue.code}: ${issue.message}`);
  if (!pass && p.expect) console.log(`        expected: [${p.expect.join(', ')}]`);
});

console.log(`\n${pairs.length - failed}/${pairs.length} pairs as expected`);
process.exit(failed ? 1 : 0);
