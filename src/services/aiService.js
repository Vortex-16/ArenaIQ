// ArenaIQ Hybrid AI Engine
import { LOCAL_KNOWLEDGE } from './mockData';

// System prompt to guide the AI model (used for Gemini and Groq calls)
const STADIUM_SYSTEM_PROMPT = `
You are ArenaIQ, an intelligent, operations assistant for the FIFA World Cup 2026.
Your role is to help stadium fans, volunteers, and staff with real-time stadium operations, crowd safety, navigation, transport, sustainability, accessibility, and general stadium guidelines.
Be helpful, concise, and professional. 
Support the language of the user (e.g., English, Spanish, French, Portuguese, Arabic, German).
If the user asks about specific stadiums, refer to MetLife Stadium (NY/NJ), SoFi Stadium (Los Angeles), or Mercedes-Benz Stadium (Atlanta).
Always prioritize safety, crowd flow optimization, and ecological sustainability in your answers.
`;

/**
 * Streams or generates a response from a real or mock LLM.
 * @param {string} query - The user or staff prompt.
 * @param {object} apiConfig - { service: 'mock'|'gemini'|'groq', key: '...' }
 * @param {function} onChunk - Callback for streaming text chunks.
 */
export async function generateAIResponse(query, apiConfig, onChunk) {
  const service = apiConfig?.service || 'mock';
  const key = apiConfig?.key || '';

  if (service === 'gemini' && key) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?key=${key}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${STADIUM_SYSTEM_PROMPT}\n\nUser Query: ${query}` }]
              }
            ],
            generationConfig: {
              maxOutputTokens: 800,
              temperature: 0.2,
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API Error: Status ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        // Parse lines of SSE stream
        const lines = buffer.split('\n');
        buffer = lines.pop(); // keep last incomplete line in buffer

        for (const line of lines) {
          if (line.trim().startsWith('data: ') || line.trim()) {
            try {
              // Gemini streaming responds with JSON array chunks or SSE lines
              const cleanLine = line.replace(/^\s*\[?data:\s*/, '').replace(/\]?\s*$/, '').trim();
              if (!cleanLine) continue;
              
              const json = JSON.parse(cleanLine);
              const textChunk = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
              if (textChunk) {
                onChunk(textChunk);
              }
            } catch (e) {
              // Ignore partial parse errors during streaming
            }
          }
        }
      }
      return;
    } catch (error) {
      console.error('Gemini API call failed, falling back to local model:', error);
      onChunk(`*(Note: Gemini API request failed. Falling back to local AI engine)*\n\n`);
      // Fall through to mock
    }
  }

  if (service === 'groq' && key) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-specdec', // default fast Groq model
          messages: [
            { role: 'system', content: STADIUM_SYSTEM_PROMPT },
            { role: 'user', content: query }
          ],
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error(`Groq API Error: Status ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          const cleanLine = line.trim();
          if (cleanLine.startsWith('data: ')) {
            const dataStr = cleanLine.substring(6);
            if (dataStr === '[DONE]') break;
            try {
              const parsed = JSON.parse(dataStr);
              const textChunk = parsed.choices?.[0]?.delta?.content || '';
              if (textChunk) {
                onChunk(textChunk);
              }
            } catch (e) {
              // Ignore parsing errors of partial streams
            }
          }
        }
      }
      return;
    } catch (error) {
      console.error('Groq API call failed, falling back to local model:', error);
      onChunk(`*(Note: Groq API request failed. Falling back to local AI engine)*\n\n`);
      // Fall through to mock
    }
  }

  // --- LOCAL FALLBACK SIMULATOR (STREAMING) ---
  const normalizedQuery = query.toLowerCase().trim();
  let lang = 'en';

  // Detect language
  if (
    normalizedQuery.includes('hola') || 
    normalizedQuery.includes('puerta') || 
    normalizedQuery.includes('boleto') || 
    normalizedQuery.includes('silla de ruedas') ||
    normalizedQuery.includes('sustentabilidad') ||
    normalizedQuery.includes('comida')
  ) {
    lang = 'es';
  } else if (
    normalizedQuery.includes('bonjour') || 
    normalizedQuery.includes('porte') || 
    normalizedQuery.includes('billet') || 
    normalizedQuery.includes('recyclage') || 
    normalizedQuery.includes('fauteuil')
  ) {
    lang = 'fr';
  }

  let matchedText = '';

  // Match keyword topics
  if (normalizedQuery.includes('prohibit') || normalizedQuery.includes('bring') || normalizedQuery.includes('bag') || normalizedQuery.includes('camera') || normalizedQuery.includes('traer') || normalizedQuery.includes('prohibido') || normalizedQuery.includes('interdit')) {
    matchedText = LOCAL_KNOWLEDGE[lang].prohibited;
  } else if (normalizedQuery.includes('access') || normalizedQuery.includes('wheelchair') || normalizedQuery.includes('disabled') || normalizedQuery.includes('sensory') || normalizedQuery.includes('silla') || normalizedQuery.includes('fauteuil') || normalizedQuery.includes('handicap')) {
    matchedText = LOCAL_KNOWLEDGE[lang].accessibility;
  } else if (normalizedQuery.includes('transport') || normalizedQuery.includes('uber') || normalizedQuery.includes('train') || normalizedQuery.includes('parking') || normalizedQuery.includes('bus') || normalizedQuery.includes('shuttle') || normalizedQuery.includes('estacionamiento') || normalizedQuery.includes('metro')) {
    matchedText = LOCAL_KNOWLEDGE[lang].transport;
  } else if (normalizedQuery.includes('sustainability') || normalizedQuery.includes('recycle') || normalizedQuery.includes('green') || normalizedQuery.includes('eco') || normalizedQuery.includes('sustentable') || normalizedQuery.includes('reciclaje')) {
    matchedText = LOCAL_KNOWLEDGE[lang].sustainability;
  } else if (normalizedQuery.includes('congest') || normalizedQuery.includes('bottleneck') || normalizedQuery.includes('gate c') || normalizedQuery.includes('redirect') || normalizedQuery.includes('incident') || normalizedQuery.includes('spill') || normalizedQuery.includes('emergency')) {
    // Operations & Redirect specific local responses
    matchedText = `**ArenaIQ Operations Decision Support Report:**

1. **Gate C / Crowd Congestion Protocol**:
   - **Recommendation**: Redirect Section 100-112 ticket holders arriving at Gate C to **Gate B (East)**. The current walk is 4 minutes.
   - **Action Items**: 
     - Update digital concourse screens at South Approach to point to Gate B.
     - Dispatch 4 volunteers from the Gate A info pool to assist with manual ticketing lines at Gate B.
     - Open Turnstiles 5-8 at Gate B immediately.

2. **Liquid Spill / Concourse 102 Safety Protocol**:
   - **Recommendation**: Deploy **Janitorial Rapid Response** to Section 102 with wet-floor barriers.
   - **Action Items**: 
     - Instruct security personnel at Section 102 to guide fans around the spill zone.
     - Dispatch cleaning crew immediately (estimated travel time: 2 minutes).

3. **General Resource Dispatching**:
   - Dynamic allocations are based on current incident severity. High-priority incidents (like turnstile failures) automatically receive priority queueing for technician dispatch.`;
  } else {
    // Default reply
    matchedText = LOCAL_KNOWLEDGE[lang].notfound;
  }

  // Simulate streaming output word-by-word
  const words = matchedText.split(' ');
  for (let i = 0; i < words.length; i++) {
    onChunk(words[i] + ' ');
    await new Promise((resolve) => setTimeout(resolve, Math.min(30, 1500 / words.length)));
  }
}
