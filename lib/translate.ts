import 'server-only';
import Anthropic from '@anthropic-ai/sdk';

/**
 * Translate English text to formal Bahasa Malaysia using Claude (Haiku 4.5).
 * Server-only — requires ANTHROPIC_API_KEY in the environment.
 * Project names and URLs are preserved verbatim.
 */
export async function translateToMalay(text: string): Promise<string> {
  if (!text.trim()) return text;

  const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env

  const response = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 1024,
    system:
      'You are a professional translator for a Malaysian civic-technology website. ' +
      'Translate the user\'s English text into clear, formal Bahasa Malaysia (Bahasa Melayu). ' +
      'Keep product names, brand names, and URLs exactly as written (e.g. JomBeelajar, BilikSewa, JomDuit). ' +
      'Preserve the meaning and tone. Return ONLY the translation, with no preamble, quotes, or notes.',
    messages: [{ role: 'user', content: text }],
  });

  const out = response.content.find((b) => b.type === 'text');
  return out && out.type === 'text' ? out.text.trim() : text;
}
