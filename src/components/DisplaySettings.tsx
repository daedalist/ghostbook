'use client';

import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'ghostbook:legible';

/** Read the saved preference, falling back to the OS accessibility settings. */
function getInitialLegible(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'on') return true;
    if (saved === 'off') return false;
  } catch {
    // localStorage can throw (private mode, disabled) — ignore and use defaults.
  }

  // No explicit choice yet: honour the system's contrast/color preferences.
  if (typeof window.matchMedia === 'function') {
    return (
      window.matchMedia('(prefers-contrast: more)').matches ||
      window.matchMedia('(forced-colors: active)').matches
    );
  }

  return false;
}

function applyLegible(on: boolean): void {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-legible', on ? 'on' : 'off');
  }
}

/**
 * A single "high-legibility mode" toggle. When on, CSS keyed off the
 * `data-legible` attribute drops the CRT effects (glow, scanlines, flicker)
 * and raises text contrast. The choice is saved to localStorage and defaults
 * to the reader's OS accessibility settings.
 */
export default function DisplaySettings() {
  const [legible, setLegible] = useState(false);

  useEffect(() => {
    const initial = getInitialLegible();
    setLegible(initial);
    applyLegible(initial);
  }, []);

  const toggle = () => {
    const next = !legible;
    setLegible(next);
    applyLegible(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? 'on' : 'off');
    } catch {
      // Ignore storage failures; the in-session toggle still works.
    }
  };

  return (
    <div className="displaySettings">
      <button
        type="button"
        className="button legibleToggle"
        onClick={toggle}
        aria-pressed={legible}
      >
        <span aria-hidden="true">{legible ? '[x]' : '[ ]'}</span>{' '}
        High-legibility mode
      </button>
    </div>
  );
}
