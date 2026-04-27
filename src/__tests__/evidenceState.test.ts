import { describe, it, expect } from 'vitest';
import evidenceState from '../lib/evidenceState';

describe('evidenceState constants', () => {
  it('defines all four evidence states', () => {
    expect(Object.keys(evidenceState)).toHaveLength(4);
  });

  it('contains SELECTED, NOT_SELECTED, DISABLED, and RULED_OUT', () => {
    expect(evidenceState).toHaveProperty('SELECTED');
    expect(evidenceState).toHaveProperty('NOT_SELECTED');
    expect(evidenceState).toHaveProperty('DISABLED');
    expect(evidenceState).toHaveProperty('RULED_OUT');
  });

  it('state values are strings usable as CSS class names', () => {
    Object.values(evidenceState).forEach((value) => {
      expect(typeof value).toBe('string');
      expect(value).toMatch(/^[a-zA-Z][a-zA-Z0-9]*$/);
    });
  });

  it('has unique state values', () => {
    const values = Object.values(evidenceState);
    const uniqueValues = new Set(values);
    expect(uniqueValues.size).toBe(values.length);
  });
});
