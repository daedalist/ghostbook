import { describe, it, expect } from 'vitest';
import evidence from '../lib/evidence';

describe('evidence constants', () => {
  it('defines all seven evidence types', () => {
    const types = Object.values(evidence);
    expect(types).toHaveLength(7);
  });

  it('contains the expected evidence names', () => {
    const expectedNames = [
      'Ghost orb',
      'Spirit box',
      'Fingerprints',
      'EMF Level 5',
      'Freezing temperatures',
      'Ghost writing',
      'D.O.T.S projector',
    ];
    const actualNames = Object.values(evidence);
    expect(actualNames).toEqual(expect.arrayContaining(expectedNames));
    expect(expectedNames).toEqual(expect.arrayContaining(actualNames));
  });

  it('has unique keys', () => {
    const keys = Object.keys(evidence);
    const uniqueKeys = new Set(keys);
    expect(uniqueKeys.size).toBe(keys.length);
  });

  it('has unique values', () => {
    const values = Object.values(evidence);
    const uniqueValues = new Set(values);
    expect(uniqueValues.size).toBe(values.length);
  });
});
