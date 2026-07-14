import { describe, it, expect, vi } from 'vitest';
import { generateAIResponse } from './aiService';

describe('aiService Local Response Matcher', () => {
  it('should match prohibited items keywords correctly', async () => {
    let resultText = '';
    const onChunkMock = vi.fn((chunk) => {
      resultText += chunk;
    });

    const query = 'can I bring a backpack or a camera?';
    await generateAIResponse(query, { service: 'mock' }, onChunkMock);

    expect(onChunkMock).toHaveBeenCalled();
    expect(resultText).toContain('prohibited inside FIFA World Cup 2026 stadiums');
    expect(resultText).toContain('backpacks');
    expect(resultText).toContain('Professional cameras');
  });

  it('should fallback to default info when no keywords match', async () => {
    let resultText = '';
    const onChunkMock = vi.fn((chunk) => {
      resultText += chunk;
    });

    const query = 'tell me random info';
    await generateAIResponse(query, { service: 'mock' }, onChunkMock);

    expect(onChunkMock).toHaveBeenCalled();
    expect(resultText).toContain('gates open 3 hours before kick-off');
  });

  it('should support Spanish queries when keyword triggers matched', async () => {
    let resultText = '';
    const onChunkMock = vi.fn((chunk) => {
      resultText += chunk;
    });

    const query = 'hola, como llegar en metro?';
    await generateAIResponse(query, { service: 'mock' }, onChunkMock);

    expect(onChunkMock).toHaveBeenCalled();
    expect(resultText).toContain('Estación Central');
    expect(resultText).toContain('Lote E');
  });
});
