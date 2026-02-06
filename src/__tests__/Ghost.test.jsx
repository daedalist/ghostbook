import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Ghost from '../components/Ghost';

const bansheeProps = {
  name: 'Banshee',
  evidence_list: ['Fingerprints', 'Ghost orb', 'D.O.T.S projector'],
  fake_evidence_list: [],
};

const mimicProps = {
  name: 'The Mimic',
  evidence_list: ['Spirit box', 'Fingerprints', 'Freezing temperatures'],
  fake_evidence_list: ['Ghost orb'],
};

describe('Ghost component', () => {
  it('renders the ghost name', () => {
    render(<Ghost {...bansheeProps} />);
    expect(screen.getByText('Banshee')).toBeInTheDocument();
  });

  it('renders all primary evidence items', () => {
    render(<Ghost {...bansheeProps} />);
    expect(screen.getByText('Fingerprints')).toBeInTheDocument();
    expect(screen.getByText('Ghost orb')).toBeInTheDocument();
    expect(screen.getByText('D.O.T.S projector')).toBeInTheDocument();
  });

  it('renders fake evidence with the fakeEvidence CSS class', () => {
    render(<Ghost {...mimicProps} />);
    const fakeItem = screen.getByText('Ghost orb');
    expect(fakeItem).toHaveClass('fakeEvidence');
  });

  it('does not apply fakeEvidence class to primary evidence', () => {
    render(<Ghost {...mimicProps} />);
    const primaryItem = screen.getByText('Spirit box');
    expect(primaryItem).not.toHaveClass('fakeEvidence');
  });

  it('shows a details toggle button', () => {
    render(<Ghost {...bansheeProps} />);
    expect(screen.getByText(/details/i)).toBeInTheDocument();
  });

  it('hides details by default', () => {
    render(<Ghost {...bansheeProps} />);
    const detailsContainer = document.querySelector('.ghostDetailsHidden');
    expect(detailsContainer).toBeInTheDocument();
  });

  it('shows details when the toggle button is clicked', async () => {
    const user = userEvent.setup();
    render(<Ghost {...bansheeProps} />);

    await user.click(screen.getByText(/details/i));

    const detailsContainer = document.querySelector('.ghostDetailsShown');
    expect(detailsContainer).toBeInTheDocument();
    expect(document.querySelector('.ghostDetailsHidden')).toBeNull();
  });

  it('hides details again when toggle is clicked twice', async () => {
    const user = userEvent.setup();
    render(<Ghost {...bansheeProps} />);

    const toggle = screen.getByText(/details/i);
    await user.click(toggle);
    await user.click(toggle);

    expect(document.querySelector('.ghostDetailsHidden')).toBeInTheDocument();
    expect(document.querySelector('.ghostDetailsShown')).toBeNull();
  });
});
