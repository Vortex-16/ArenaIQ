# ArenaIQ — FIFA World Cup 2026 Smart Stadium Command & Fan Guide

**ArenaIQ** is a GenAI-enabled stadium operations and fan experience platform built for the FIFA World Cup 2026. It provides a dual-portal interface for **fans** and **stadium staff**, integrating real Firebase Authentication, a hybrid GenAI engine, and a hardened security layer into a beautiful Claymorphism-styled React application.

---

## 🌟 Chosen Vertical
**[Challenge 4] Smart Stadiums & Tournament Operations**

ArenaIQ targets three key personas: **Fans** (navigation, sustainability, chatbot), **Venue Staff** (crowd heatmaps, incident dispatch, AI decision support), and **Organizers** (report generation, resource management).

---

## 🏗️ Architecture & Approach

```
ArenaIQ/
├── src/
│   ├── components/         # Reusable UI: AIChat (streaming), MapCanvas (Canvas), StatsCard, Sidebar
│   ├── portals/            # Role-gated views: LandingPage, FanPortal, StaffPortal
│   ├── services/           # Business logic: aiService, authService, firebase, mockData
│   │   ├── aiService.js    # Hybrid GenAI engine (Gemini / Groq / Local fallback)
│   │   ├── authService.js  # Firebase Auth + local JWT fallback
│   │   ├── firebase.js     # Firebase SDK initialisation
│   │   └── mockData.js     # Structured stadium, incident, crew, and knowledge-base data
│   └── utils/
│       └── sanitize.js     # XSS prevention, input validation, rate limiting
```

### Logic Flow
1. User authenticates via Firebase Auth (or local JWT fallback if Firebase Auth is not enabled)
2. Email domain maps to role: `staff@fifa.com` → Staff Command Portal; all others → Fan Portal
3. Fan Portal: Interactive Canvas map navigation, live wait-time panels, eco-reward tracker, multilingual chatbot
4. Staff Portal: Live crowd-density heatmap, matchday incident board, crew dispatch, AI operations advisor, report download
5. GenAI Engine: queries route to Gemini 2.5 Flash → Groq Llama 3 → local streaming simulator with keyword matching

---

## 🤖 GenAI Support Mechanics

The **Hybrid AI Engine** (`src/services/aiService.js`) supports three modes:

| Mode | Description |
|---|---|
| **Gemini 2.5 Flash** | Real-time streaming via Google Generative Language API |
| **Groq Llama 3.3** | Real-time streaming via Groq OpenAI-compatible endpoint |
| **Local Simulator** | Keyword-matched context-aware responses in 🇬🇧 English, 🇪🇸 Spanish, 🇫🇷 French |

Topic coverage includes: prohibited items, accessibility, transport, sustainability, crowd/emergency operations decision support.

---

## 🔒 Security Implementation

Security-first engineering, addressing common web vulnerabilities:

| Layer | Implementation |
|---|---|
| **Input Sanitization** | `sanitize.js` strips HTML tags, encodes `<>'"`, removes `javascript:` and event handler injections |
| **Input Length Limits** | Chat queries capped at 500 chars; passwords limited to 128 chars; emails to 254 chars |
| **Client-side Validation** | Email format (RFC-5322), password strength, and field presence validated before any network call |
| **Rate Limiting** | `RateLimiter` class (in-memory, rolling window) prevents burst AI requests — max 15/min per chat session |
| **API Key Safety** | Keys held only in React state (in-memory); never written to `localStorage`, cookies, or any persisted storage |
| **Crypto IDs** | `crypto.randomUUID()` used for message IDs instead of `Math.random()` |
| **ARIA / Accessible Alerts** | Rate-limit messages use `role="alert"` + `aria-live="assertive"` for screen reader announcement |

---

## 🧪 Test Coverage

Comprehensive Vitest unit tests across **4 test files** and **100+ test cases**:

| Test File | Tests | Coverage |
|---|---|---|
| `sanitize.test.js` | ~32 tests | XSS stripping, length validation, rate limiter, email/password validators |
| `aiService.test.js` | ~35 tests | All topic branches (prohibited/accessibility/transport/sustainability/ops), language detection (EN/ES/FR), streaming, security edge cases |
| `authService.test.js` | ~20 tests | Role assignment, JWT structure, session persistence, sign-out, input guards |
| `mockData.test.js` | ~71 tests | Full schema validation for all stadiums, incidents, crews, and knowledge base entries |

```bash
npm test        # runs all tests
```

---

## ♿ Accessibility (a11y)

- Semantic HTML (`<main>`, `<header>`, `<nav>`, `<form>`, `<dialog>`)
- All interactive elements have unique `id` attributes and descriptive `aria-label`
- `role="log"` + `aria-live="polite"` on the chat message window for screen readers
- `role="alert"` + `aria-live="assertive"` on rate-limit warnings
- Keyboard-navigable: `*:focus-visible` outline on all interactive elements
- High-contrast Claymorphism palette (WCAG AA compliant contrast ratios)
- Responsive layout collapses to single column on ≤900px viewport

---

## ⚡ Efficiency

- **Bundle Size**: Production build is ~400 KB (well under 10 MB repo limit)
- **Zero external CSS frameworks**: Pure Vanilla CSS with CSS custom properties
- **Streaming UX**: AI responses stream word-by-word for perceived instant feedback
- **Canvas rendering**: Stadium map uses native HTML5 Canvas (no third-party map library)
- **useMemo**: `RateLimiter` instance is memoized per AIChat component to prevent re-creation on re-renders
- **Debounce via maxLength**: Input field truncates at `MAX_QUERY_LENGTH` inline instead of on-submit

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 (Vite) |
| Styling | Vanilla CSS — Claymorphism design system |
| Auth | Firebase Authentication v12 + local JWT fallback |
| AI | Google Gemini 2.5 Flash / Groq Llama 3.3 / Local simulator |
| Icons | Lucide React (SVG-only, no emoji) |
| Testing | Vitest |
| Linting | Oxlint |

---

## 🚀 Setup & Local Launch

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev

# 3. Run all tests
npm test

# 4. Build production bundle
npm run build
```

### Quick Demo Credentials

On the login screen, click the quick-fill buttons or use:
| Role | Email | Password |
|---|---|---|
| **Staff Admin** | `staff@fifa.com` | any (≥6 chars) |
| **Fan User** | any email | any (≥6 chars) |

> Logging in as `staff@fifa.com` opens the **Operations Command Center**.  
> Any other email opens the **Fan Guide**.

---

## 📋 Assumptions

- Firebase Auth Email/Password provider may be disabled in the project console; a local JWT simulation fallback is provided automatically
- Live AI (Gemini/Groq) requires the user to supply their own API key via the Settings panel
- Stadium map paths and wait-times are simulated matchday data (no live IoT feeds)
- The multilingual local AI covers EN, ES, FR; Gemini/Groq support all languages natively
