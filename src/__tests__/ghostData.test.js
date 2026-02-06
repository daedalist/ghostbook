import { describe, it, expect } from 'vitest';
import ghost_data_map from '../lib/ghost_data_map.json';
import evidence from '../lib/evidence';

const ghosts = ghost_data_map[0];
const validEvidenceNames = Object.values(evidence);

describe('ghost data map', () => {
  it('is a non-empty array with one entry', () => {
    expect(Array.isArray(ghost_data_map)).toBe(true);
    expect(ghost_data_map).toHaveLength(1);
  });

  it('contains at least one ghost', () => {
    expect(Object.keys(ghosts).length).toBeGreaterThan(0);
  });

  describe('each ghost entry', () => {
    Object.entries(ghosts).forEach(([name, data]) => {
      describe(name, () => {
        it('has an evidence_list array', () => {
          expect(Array.isArray(data.evidence_list)).toBe(true);
        });

        it('has a fake_evidence_list array', () => {
          expect(Array.isArray(data.fake_evidence_list)).toBe(true);
        });

        it('has a strength string', () => {
          expect(typeof data.strength).toBe('string');
          expect(data.strength.length).toBeGreaterThan(0);
        });

        it('has a weakness string', () => {
          expect(typeof data.weakness).toBe('string');
          expect(data.weakness.length).toBeGreaterThan(0);
        });

        it('has exactly 3 primary evidence items', () => {
          expect(data.evidence_list).toHaveLength(3);
        });

        it('only references valid evidence names in evidence_list', () => {
          data.evidence_list.forEach((ev) => {
            expect(validEvidenceNames).toContain(ev);
          });
        });

        it('only references valid evidence names in fake_evidence_list', () => {
          data.fake_evidence_list.forEach((ev) => {
            expect(validEvidenceNames).toContain(ev);
          });
        });

        it('has no overlap between evidence_list and fake_evidence_list', () => {
          const overlap = data.evidence_list.filter((e) =>
            data.fake_evidence_list.includes(e)
          );
          expect(overlap).toHaveLength(0);
        });
      });
    });
  });
});
