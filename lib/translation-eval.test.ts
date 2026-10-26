import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { checkTranslation, extractNumbers, extractUrls } from './translation-eval.ts';

interface Fixture {
  id: string;
  source: string;
  translated: string;
  expect: string[];
}

const { pairs } = JSON.parse(
  readFileSync(new URL('../scripts/fixtures/translation-pairs.json', import.meta.url), 'utf8'),
) as { pairs: Fixture[] };

for (const p of pairs) {
  test(`fixture ${p.id}`, () => {
    const codes = checkTranslation(p.source, p.translated).issues.map((i) => i.code).sort();
    assert.deepEqual(codes, [...p.expect].sort());
  });
}

test('blank source with blank output passes (matches translateToMalay)', () => {
  assert.equal(checkTranslation('', '').ok, true);
  assert.equal(checkTranslation('  ', '  ').ok, true);
});

test('extra protected terms are enforced', () => {
  const r = checkTranslation('Visit the Dewan Rakyat page soon.', 'Lawati halaman dewan rakyat tidak lama lagi.', {
    protectedTerms: ['Dewan Rakyat'],
  });
  assert.deepEqual(r.issues.map((i) => i.code), ['protected_term_missing']);
});

test('URL trailing punctuation does not cause a false mismatch', () => {
  assert.deepEqual(extractUrls('See https://example.com/a.'), ['https://example.com/a']);
});

test('digits inside URLs are not counted as numbers', () => {
  assert.deepEqual(extractNumbers('Go to https://example.com/v2 for 5 items'), ['5']);
});

test('length bounds are configurable', () => {
  const src = 'A reasonably long sentence about public services.';
  const out = 'Ayat.';
  assert.equal(checkTranslation(src, out, { minLengthRatio: 0.05 }).ok, true);
});
