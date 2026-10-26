/**
 * Pure, offline checks for EN -> BM translations produced by `translateToMalay`
 * (lib/translate.ts). No network, no API key, no Next.js imports, so it runs
 * under plain Node (scripts/eval-translations.ts, lib/translation-eval.test.ts).
 *
 * These are structural guards, not a quality score. They catch output that is
 * mechanically wrong (dropped URL, changed number, empty, untranslated,
 * truncated or padded) and say nothing about whether the Malay reads well;
 * that is what the human review step is for.
 */

export type IssueCode =
  | 'empty_output'
  | 'identical_to_source'
  | 'url_mismatch'
  | 'placeholder_mismatch'
  | 'markup_mismatch'
  | 'number_mismatch'
  | 'protected_term_missing'
  | 'length_drift'
  | 'wrapper_text';

export interface Issue {
  code: IssueCode;
  message: string;
}

export interface CheckOptions {
  /** Extra terms that must survive verbatim when present in the source. */
  protectedTerms?: string[];
  /** Flag when translated/source length ratio falls outside [min, max]. */
  minLengthRatio?: number;
  maxLengthRatio?: number;
  /** Sources shorter than this skip the length check (ratios are noisy). */
  minSourceLengthForRatio?: number;
}

export interface TranslationPair {
  source: string;
  translated: string;
}

export interface CheckResult {
  ok: boolean;
  issues: Issue[];
}

// Heuristic bounds, not measured values. English -> Malay is usually close to
// 1:1 in length; a wide band keeps false positives low while still catching
// truncation (max_tokens) and runaway output.
const DEFAULTS = {
  minLengthRatio: 0.5,
  maxLengthRatio: 2.0,
  minSourceLengthForRatio: 20,
};

const URL_RE = /https?:\/\/[^\s<>"')\]]+/gi;
const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
const DOMAIN_RE = /\b(?:[a-z0-9-]+\.)+(?:com|my|org|net|io|dev|app|gov\.my|edu\.my)\b/gi;
// {{name}}, ${name}, {name}, %s / %d / %1$s
const PLACEHOLDER_RE = /\{\{[^}]*\}\}|\$\{[^}]*\}|\{[A-Za-z0-9_.]+\}|%\d*\$?[sdif]/g;
const TAG_RE = /<\/?[A-Za-z][^<>]*>/g;
const CODE_SPAN_RE = /`[^`\n]*`/g;
const NUMBER_RE = /\d+(?:[.,]\d+)*/g;
// JomDuit, BilikSewa, JomID ... (a capital, then lowercase/digits, then another capital)
const CAMEL_BRAND_RE = /\b[A-Z][a-z0-9]+(?:[A-Z][A-Za-z0-9]*)+\b/g;

function matches(text: string, re: RegExp): string[] {
  return text.match(re) ?? [];
}

function stripTrailingPunct(s: string): string {
  return s.replace(/[.,;:!?]+$/, '');
}

function tally(items: string[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const i of items) m.set(i, (m.get(i) ?? 0) + 1);
  return m;
}

/** Multiset difference description, or null when the two lists match. */
function diffMultiset(expected: string[], actual: string[]): string | null {
  const e = tally(expected);
  const a = tally(actual);
  const missing: string[] = [];
  const extra: string[] = [];
  for (const [k, n] of e) {
    const d = n - (a.get(k) ?? 0);
    for (let i = 0; i < d; i++) missing.push(k);
  }
  for (const [k, n] of a) {
    const d = n - (e.get(k) ?? 0);
    for (let i = 0; i < d; i++) extra.push(k);
  }
  if (!missing.length && !extra.length) return null;
  const parts: string[] = [];
  if (missing.length) parts.push(`missing ${missing.map((x) => JSON.stringify(x)).join(', ')}`);
  if (extra.length) parts.push(`unexpected ${extra.map((x) => JSON.stringify(x)).join(', ')}`);
  return parts.join('; ');
}

export function extractUrls(text: string): string[] {
  const urls = matches(text, URL_RE).map(stripTrailingPunct);
  const rest = text.replace(URL_RE, ' ');
  const emails = matches(rest, EMAIL_RE);
  const domains = matches(rest.replace(EMAIL_RE, ' '), DOMAIN_RE).map((d) => d.toLowerCase());
  return [...urls, ...emails, ...domains];
}

export function extractPlaceholders(text: string): string[] {
  return matches(text.replace(URL_RE, ' '), PLACEHOLDER_RE);
}

export function extractMarkup(text: string): string[] {
  const noUrls = text.replace(URL_RE, ' ');
  const tags = matches(noUrls, TAG_RE);
  const code = matches(noUrls, CODE_SPAN_RE);
  const bold = matches(noUrls, /\*\*/g);
  const bullets = matches(noUrls, /^\s*(?:[-*]|\d+\.)\s/gm).map(() => 'list-item');
  const headings = matches(noUrls, /^#{1,6}\s/gm).map((h) => h.trim());
  return [...tags, ...code, ...bold, ...bullets, ...headings];
}

export function extractNumbers(text: string): string[] {
  let t = text.replace(URL_RE, ' ').replace(EMAIL_RE, ' ').replace(DOMAIN_RE, ' ');
  t = t.replace(PLACEHOLDER_RE, ' ').replace(TAG_RE, ' ');
  return matches(t, NUMBER_RE);
}

export function extractProtectedTerms(source: string, extra: string[] = []): string[] {
  const generic = matches(source, CAMEL_BRAND_RE);
  const configured = extra.filter((t) => t && source.includes(t));
  return [...new Set([...generic, ...configured])];
}

const WRAPPER_RE =
  /^\s*(?:here(?:'s| is| are)\b|translation\s*:|terjemahan\s*:|berikut\s+(?:ialah|adalah)?\s*terjemahan|sure[,!]|of course[,!]|note\s*:|nota\s*:)/i;

function isWrappedInQuotes(s: string): boolean {
  const t = s.trim();
  return t.length > 1 && /^["'“‘][\s\S]*["'”’]$/.test(t);
}

export function checkTranslation(source: string, translated: string, options: CheckOptions = {}): CheckResult {
  const opt = { ...DEFAULTS, ...options };
  const issues: Issue[] = [];
  const add = (code: IssueCode, message: string) => issues.push({ code, message });

  // Mirrors translateToMalay: blank input is returned untouched, so a blank
  // source with blank output is fine and there is nothing else to check.
  if (!source.trim()) {
    if (translated !== source) add('wrapper_text', 'source is blank but output is not');
    return { ok: issues.length === 0, issues };
  }

  if (!translated.trim()) {
    add('empty_output', 'translation is empty or whitespace');
    return { ok: false, issues };
  }

  if (translated.trim() === source.trim()) {
    add('identical_to_source', 'output is identical to the source (not translated, or the call fell back to the input)');
  }

  const urlDiff = diffMultiset(extractUrls(source), extractUrls(translated));
  if (urlDiff) add('url_mismatch', `URLs/emails/domains changed: ${urlDiff}`);

  const phDiff = diffMultiset(extractPlaceholders(source), extractPlaceholders(translated));
  if (phDiff) add('placeholder_mismatch', `placeholders changed: ${phDiff}`);

  const markupDiff = diffMultiset(extractMarkup(source), extractMarkup(translated));
  if (markupDiff) add('markup_mismatch', `markup changed: ${markupDiff}`);

  const numDiff = diffMultiset(extractNumbers(source), extractNumbers(translated));
  if (numDiff) add('number_mismatch', `numbers changed: ${numDiff}`);

  const lostTerms = extractProtectedTerms(source, options.protectedTerms).filter((t) => !translated.includes(t));
  if (lostTerms.length) add('protected_term_missing', `product/brand names not kept verbatim: ${lostTerms.join(', ')}`);

  if (source.trim().length >= opt.minSourceLengthForRatio) {
    const ratio = translated.trim().length / source.trim().length;
    if (ratio < opt.minLengthRatio || ratio > opt.maxLengthRatio) {
      add(
        'length_drift',
        `length ratio ${ratio.toFixed(2)} is outside ${opt.minLengthRatio}-${opt.maxLengthRatio} (possible truncation or padding)`,
      );
    }
  }

  if (WRAPPER_RE.test(translated) && !WRAPPER_RE.test(source)) {
    add('wrapper_text', 'output starts with a preamble/label the prompt told the model not to add');
  } else if (isWrappedInQuotes(translated) && !isWrappedInQuotes(source)) {
    add('wrapper_text', 'output is wrapped in quotes the source does not have');
  }

  return { ok: issues.length === 0, issues };
}
