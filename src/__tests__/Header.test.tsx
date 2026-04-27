import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from '../components/Header';

describe('Header component', () => {
  it('renders the application title', () => {
    render(<Header />);
    expect(screen.getByText('Phasmophobia Ghostbook')).toBeInTheDocument();
  });

  it('renders a description paragraph', () => {
    render(<Header />);
    expect(screen.getByText(/keep track of evidence/i)).toBeInTheDocument();
  });

  it('uses a header element', () => {
    render(<Header />);
    expect(document.querySelector('header')).toBeInTheDocument();
  });
});
