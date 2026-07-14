/**
 * ArenaIQ AI Service — Comprehensive Unit Tests
 *
 * Tests keyword matching, language detection, fallback behaviour,
 * streaming simulation, edge cases, and injection-resistant query handling.
 */

import { describe, it, expect, vi } from 'vitest';
import { generateAIResponse } from './aiService';

// ─────────────────────── Helpers ────────────────────────────────────────────

/**
 * Runs generateAIResponse with the mock service and collects the full
 * streamed output via the onChunk callback.
 * @param {string} query
 * @returns {Promise<string>}
 */
async function runQuery(query) {
  let result = '';
  const onChunk = vi.fn((chunk) => { result += chunk; });
  await generateAIResponse(query, { service: 'mock' }, onChunk);
  return result;
}

// ─────────────────────── Prohibited Items ───────────────────────────────────
describe('Prohibited items keyword matching', () => {
  it('responds to "backpack" with prohibited items list', async () => {
    const text = await runQuery('Can I bring a backpack inside?');
    expect(text).toContain('prohibited inside FIFA World Cup 2026 stadiums');
    expect(text).toContain('backpacks');
  });

  it('responds to "camera" with prohibited items list', async () => {
    const text = await runQuery('Are cameras allowed?');
    expect(text).toContain('Professional cameras');
  });

  it('responds to "bag" keyword', async () => {
    const text = await runQuery('what bags are not allowed?');
    expect(text).toContain('prohibited');
  });

  it('responds to Spanish keyword "prohibido"', async () => {
    const text = await runQuery('¿Qué está prohibido traer?');
    // Language detected as Spanish → Spanish prohibited items list
    expect(text).toContain('prohibidos');
    expect(text).toContain('Copa Mundial');
  });

  it('responds to French keyword "interdit"', async () => {
    const text = await runQuery('Qu\'est-ce qui est interdit?');
    // Language detected as French → French prohibited items list
    expect(text).toContain('interdits');
    expect(text).toContain('Coupe du Monde');
  });
});

// ─────────────────────── Accessibility ──────────────────────────────────────
describe('Accessibility keyword matching', () => {
  it('responds to "wheelchair" query in English', async () => {
    const text = await runQuery('Where are wheelchair seats?');
    expect(text).toContain('Wheelchair');
  });

  it('responds to "accessibility" query', async () => {
    const text = await runQuery('What accessibility features are available?');
    expect(text).toContain('Sensory');
  });

  it('responds to "disabled" query', async () => {
    const text = await runQuery('I have a disabled companion, what services exist?');
    expect(text).toContain('ramps');
  });

  it('responds to Spanish "silla de ruedas" query', async () => {
    const text = await runQuery('silla de ruedas donde?');
    expect(text).toContain('ruedas');
  });
});

// ─────────────────────── Transport ──────────────────────────────────────────
describe('Transport keyword matching', () => {
  it('responds to "metro" with transport info', async () => {
    const text = await runQuery('hola, como llegar en metro?');
    expect(text).toContain('Estación Central');
    expect(text).toContain('Lote E');
  });

  it('responds to "train" with transit info', async () => {
    const text = await runQuery('How do I get there by train?');
    expect(text).toContain('Stadium Express');
  });

  it('responds to "parking" with parking info', async () => {
    const text = await runQuery('Where can I park my car near the stadium?');
    expect(text).toContain('FIFA App');
  });

  it('responds to "shuttle" with shuttle info', async () => {
    const text = await runQuery('Are there shuttles to the stadium?');
    expect(text).toContain('shuttle');
  });

  it('responds to "uber" with rideshare info', async () => {
    const text = await runQuery('Can I take Uber to the stadium?');
    expect(text).toContain('Lot E');
  });
});

// ─────────────────────── Sustainability ─────────────────────────────────────
describe('Sustainability keyword matching', () => {
  it('responds to "recycle" query', async () => {
    const text = await runQuery('How do I recycle at the stadium?');
    expect(text).toContain('Green Bins');
  });

  it('responds to "eco" keyword', async () => {
    const text = await runQuery('What eco friendly options are there?');
    expect(text).toContain('Water Station');
  });

  it('responds to "green" keyword', async () => {
    const text = await runQuery('Tell me about green initiatives');
    expect(text).toContain('reusable');
  });
});

// ─────────────────────── Operations / Staff ─────────────────────────────────
describe('Operations decision support responses', () => {
  it('responds to "congestion" with a detailed plan', async () => {
    const text = await runQuery('There is serious congestion at Gate C');
    expect(text).toContain('Gate C');
    expect(text).toContain('Gate B');
  });

  it('responds to "spill" with safety protocol', async () => {
    const text = await runQuery('There is a liquid spill on Concourse 102');
    expect(text).toContain('Janitorial');
  });

  it('responds to "emergency" keyword', async () => {
    const text = await runQuery('We have an emergency incident!');
    expect(text.length).toBeGreaterThan(20);
  });

  it('responds to "incident" keyword', async () => {
    const text = await runQuery('Incident at turnstile 5');
    expect(text.length).toBeGreaterThan(20);
  });
});

// ─────────────────────── Default Fallback ───────────────────────────────────
describe('Default fallback response', () => {
  it('returns the default gates-open message for unrecognized queries', async () => {
    const text = await runQuery('What is the weather like today?');
    expect(text).toContain('gates open 3 hours before kick-off');
  });

  it('returns a non-empty string for empty-ish queries', async () => {
    const text = await runQuery('hmm');
    expect(text.length).toBeGreaterThan(10);
  });
});

// ─────────────────────── Language Detection ─────────────────────────────────
describe('Language detection logic', () => {
  it('detects Spanish via "hola" keyword', async () => {
    const text = await runQuery('hola, puerta acceso?');
    // Spanish notfound contains Spanish text
    expect(text).toContain('Mundial');
  });

  it('detects French via "bonjour" keyword', async () => {
    const text = await runQuery('bonjour quel est le billet?');
    expect(text).toContain('Coupe du Monde');
  });

  it('defaults to English for unrecognized language markers', async () => {
    // Use a query that has no topic keyword → falls to default
    const text = await runQuery('just wondering about the weather today');
    expect(text).toContain('gates open 3 hours before kick-off');
  });
});

// ─────────────────────── Streaming Behaviour ─────────────────────────────────
describe('Streaming chunk behaviour', () => {
  it('calls onChunk at least once per query', async () => {
    const onChunk = vi.fn();
    await generateAIResponse('Where is Gate A?', { service: 'mock' }, onChunk);
    expect(onChunk).toHaveBeenCalled();
  });

  it('progressively builds up a non-empty result from chunks', async () => {
    const chunks = [];
    await generateAIResponse('How do I recycle?', { service: 'mock' }, (c) => chunks.push(c));
    const combined = chunks.join('');
    expect(combined.length).toBeGreaterThan(30);
  });
});

// ─────────────────────── Security / Edge Cases ───────────────────────────────
describe('Security and edge case handling', () => {
  it('handles a very long query without crashing', async () => {
    const longQuery = 'tell me about transport '.repeat(50);
    const text = await runQuery(longQuery);
    expect(text.length).toBeGreaterThan(0);
  });

  it('handles queries with HTML injection characters safely', async () => {
    const text = await runQuery('<script>alert(1)</script> where is parking?');
    expect(text.length).toBeGreaterThan(0);
  });

  it('handles numeric-only query without crashing', async () => {
    const text = await runQuery('1234567890');
    expect(text.length).toBeGreaterThan(0);
  });

  it('handles query with only symbols without crashing', async () => {
    const text = await runQuery('!@#$%^&*()');
    expect(text.length).toBeGreaterThan(0);
  });
});
