import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DisplaySettings from '../components/DisplaySettings';

const STORAGE_KEY = 'ghostbook:legible';

// jsdom in this project doesn't expose localStorage; provide an in-memory one
// so the component's persistence path is exercised.
const store: Record<string, string> = {};
const localStorageMock = {
  getItem: (k: string) => (k in store ? store[k] : null),
  setItem: (k: string, v: string) => {
    store[k] = v;
  },
  removeItem: (k: string) => {
    delete store[k];
  },
  clear: () => {
    for (const k of Object.keys(store)) delete store[k];
  },
};

beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    configurable: true,
    writable: true,
  });
  localStorageMock.clear();
  document.documentElement.removeAttribute('data-legible');
});

describe('DisplaySettings', () => {
  it('renders the high-legibility toggle, off by default', () => {
    render(<DisplaySettings />);
    const toggle = screen.getByRole('button', {
      name: /high-legibility mode/i,
    });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    expect(document.documentElement.getAttribute('data-legible')).toBe('off');
  });

  it('enables legible mode on click and persists it', async () => {
    const user = userEvent.setup();
    render(<DisplaySettings />);
    const toggle = screen.getByRole('button', {
      name: /high-legibility mode/i,
    });

    await user.click(toggle);

    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(document.documentElement.getAttribute('data-legible')).toBe('on');
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('on');
  });

  it('restores a saved "on" preference on mount', () => {
    window.localStorage.setItem(STORAGE_KEY, 'on');
    render(<DisplaySettings />);
    const toggle = screen.getByRole('button', {
      name: /high-legibility mode/i,
    });
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(document.documentElement.getAttribute('data-legible')).toBe('on');
  });

  it('toggles back off and persists that too', async () => {
    window.localStorage.setItem(STORAGE_KEY, 'on');
    const user = userEvent.setup();
    render(<DisplaySettings />);
    const toggle = screen.getByRole('button', {
      name: /high-legibility mode/i,
    });

    await user.click(toggle);

    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    expect(document.documentElement.getAttribute('data-legible')).toBe('off');
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe('off');
  });
});
