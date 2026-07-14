/**
 * ArenaIQ MockData Schema Validation Tests
 *
 * Validates that all stadium and incident data structures are correctly
 * shaped, have required fields, and contain logically valid values.
 * This protects against regressions when mock data is updated.
 */

import { describe, it, expect } from 'vitest';
import { STADIUMS, INITIAL_INCIDENTS, RESOURCE_CREWS, LOCAL_KNOWLEDGE } from './mockData';

// ───────────────────────────── STADIUMS ─────────────────────────────────────
describe('STADIUMS data structure', () => {
  const stadiumIds = ['metlife', 'sofi', 'mercedes'];

  it('exports the three expected stadium keys', () => {
    expect(Object.keys(STADIUMS)).toEqual(expect.arrayContaining(stadiumIds));
  });

  stadiumIds.forEach((id) => {
    describe(`Stadium: ${id}`, () => {
      it('has a non-empty name', () => {
        expect(typeof STADIUMS[id].name).toBe('string');
        expect(STADIUMS[id].name.length).toBeGreaterThan(0);
      });

      it('has a positive capacity', () => {
        expect(STADIUMS[id].capacity).toBeGreaterThan(0);
      });

      it('has at least one gate defined', () => {
        expect(Array.isArray(STADIUMS[id].gates)).toBe(true);
        expect(STADIUMS[id].gates.length).toBeGreaterThan(0);
      });

      it('has concessions array with required fields', () => {
        const { concessions } = STADIUMS[id].facilities;
        expect(Array.isArray(concessions)).toBe(true);
        concessions.forEach((c) => {
          expect(c).toHaveProperty('id');
          expect(c).toHaveProperty('name');
          expect(c).toHaveProperty('location');
          expect(typeof c.waitTime).toBe('number');
          expect(c.waitTime).toBeGreaterThanOrEqual(0);
        });
      });

      it('has restrooms array with valid gender labels', () => {
        const { restrooms } = STADIUMS[id].facilities;
        const validGenders = ['Men', 'Women', 'Family/All-Gender'];
        expect(Array.isArray(restrooms)).toBe(true);
        restrooms.forEach((r) => {
          expect(validGenders).toContain(r.gender);
          expect(typeof r.waitTime).toBe('number');
          expect(r.waitTime).toBeGreaterThanOrEqual(0);
        });
      });
    });
  });
});

// ───────────────────────────── INITIAL_INCIDENTS ────────────────────────────
describe('INITIAL_INCIDENTS data structure', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(INITIAL_INCIDENTS)).toBe(true);
    expect(INITIAL_INCIDENTS.length).toBeGreaterThan(0);
  });

  it('each incident has required fields', () => {
    INITIAL_INCIDENTS.forEach((inc) => {
      expect(inc).toHaveProperty('id');
      expect(inc).toHaveProperty('type');
      expect(inc).toHaveProperty('location');
      expect(inc).toHaveProperty('description');
      expect(inc).toHaveProperty('status');
      expect(inc).toHaveProperty('priority');
      expect(inc).toHaveProperty('timestamp');
    });
  });

  it('all status values are either Active or Resolved', () => {
    INITIAL_INCIDENTS.forEach((inc) => {
      expect(['Active', 'Resolved']).toContain(inc.status);
    });
  });

  it('all priority values are valid tiers', () => {
    const validPriorities = ['Low', 'Medium', 'High', 'Critical'];
    INITIAL_INCIDENTS.forEach((inc) => {
      expect(validPriorities).toContain(inc.priority);
    });
  });

  it('contains at least one Critical priority incident', () => {
    const hasCritical = INITIAL_INCIDENTS.some((i) => i.priority === 'Critical');
    expect(hasCritical).toBe(true);
  });

  it('contains at least one Resolved incident', () => {
    const hasResolved = INITIAL_INCIDENTS.some((i) => i.status === 'Resolved');
    expect(hasResolved).toBe(true);
  });

  it('resolved incidents have resolution text', () => {
    INITIAL_INCIDENTS
      .filter((i) => i.status === 'Resolved')
      .forEach((i) => {
        expect(typeof i.resolution).toBe('string');
        expect(i.resolution.length).toBeGreaterThan(0);
      });
  });

  it('incident IDs are unique', () => {
    const ids = INITIAL_INCIDENTS.map((i) => i.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

// ───────────────────────────── RESOURCE_CREWS ───────────────────────────────
describe('RESOURCE_CREWS data structure', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(RESOURCE_CREWS)).toBe(true);
    expect(RESOURCE_CREWS.length).toBeGreaterThan(0);
  });

  it('each crew has required fields', () => {
    RESOURCE_CREWS.forEach((crew) => {
      expect(crew).toHaveProperty('id');
      expect(crew).toHaveProperty('name');
      expect(crew).toHaveProperty('role');
      expect(crew).toHaveProperty('location');
      expect(crew).toHaveProperty('status');
    });
  });

  it('crew statuses are either Available or Busy', () => {
    RESOURCE_CREWS.forEach((crew) => {
      expect(['Available', 'Busy']).toContain(crew.status);
    });
  });

  it('has at least one Available crew for dispatch', () => {
    const available = RESOURCE_CREWS.filter((c) => c.status === 'Available');
    expect(available.length).toBeGreaterThan(0);
  });

  it('crew IDs are unique', () => {
    const ids = RESOURCE_CREWS.map((c) => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

// ───────────────────────────── LOCAL_KNOWLEDGE ──────────────────────────────
describe('LOCAL_KNOWLEDGE structure', () => {
  const requiredLangs = ['en', 'es', 'fr'];
  const requiredKeys = ['greetings', 'prohibited', 'accessibility', 'transport', 'sustainability', 'notfound'];

  requiredLangs.forEach((lang) => {
    describe(`Language: ${lang}`, () => {
      it('exists as a key in LOCAL_KNOWLEDGE', () => {
        expect(LOCAL_KNOWLEDGE).toHaveProperty(lang);
      });

      requiredKeys.forEach((key) => {
        it(`has the "${key}" entry`, () => {
          expect(LOCAL_KNOWLEDGE[lang]).toHaveProperty(key);
        });

        it(`"${key}" entry is a non-empty string or array`, () => {
          const val = LOCAL_KNOWLEDGE[lang][key];
          if (Array.isArray(val)) {
            expect(val.length).toBeGreaterThan(0);
          } else {
            expect(typeof val).toBe('string');
            expect(val.trim().length).toBeGreaterThan(0);
          }
        });
      });

      it('greetings is an array with at least one entry', () => {
        expect(Array.isArray(LOCAL_KNOWLEDGE[lang].greetings)).toBe(true);
        expect(LOCAL_KNOWLEDGE[lang].greetings.length).toBeGreaterThan(0);
      });
    });
  });
});
