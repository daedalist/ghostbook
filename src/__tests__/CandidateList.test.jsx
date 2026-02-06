import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CandidateList from '../components/CandidateList';
import ghost_data_map from '../lib/ghost_data_map.json';

const ghostNames = Object.keys(ghost_data_map[0]);

function makeScores(overrides = {}) {
  const scores = new Map();
  ghostNames.forEach((name) => {
    scores.set(name, overrides[name] ?? 0);
  });
  return scores;
}

describe('CandidateList component', () => {
  it('renders the section heading', () => {
    const scores = makeScores();
    render(<CandidateList candidate_scores={scores} />);
    expect(screen.getByText(/possible ghosts/i)).toBeInTheDocument();
  });

  it('shows "No ghosts match" when all ghosts have score 0 (initial state)', () => {
    const scores = makeScores();
    render(<CandidateList candidate_scores={scores} />);
    expect(
      screen.getByText(/no ghosts match the selected evidence/i)
    ).toBeInTheDocument();
  });

  it('shows "No ghosts match" when all ghosts are eliminated', () => {
    const overrides = {};
    ghostNames.forEach((name) => {
      overrides[name] = -10;
    });
    const scores = makeScores(overrides);
    render(<CandidateList candidate_scores={scores} />);
    expect(
      screen.getByText(/no ghosts match the selected evidence/i)
    ).toBeInTheDocument();
  });

  it('renders matching ghosts when some have positive scores', () => {
    const scores = makeScores({ Banshee: 10, Demon: -10 });
    render(<CandidateList candidate_scores={scores} />);
    expect(screen.getByText('Banshee')).toBeInTheDocument();
  });

  it('does not render eliminated ghosts', () => {
    // Give one ghost a positive score and eliminate all others.
    const overrides = {};
    ghostNames.forEach((name) => {
      overrides[name] = -10;
    });
    overrides['Banshee'] = 10;
    const scores = makeScores(overrides);
    render(<CandidateList candidate_scores={scores} />);

    expect(screen.getByText('Banshee')).toBeInTheDocument();
    expect(screen.queryByText('Demon')).toBeNull();
  });

  it('renders multiple matching ghosts', () => {
    const overrides = {};
    ghostNames.forEach((name) => {
      overrides[name] = -10;
    });
    overrides['Banshee'] = 10;
    overrides['Phantom'] = 10;
    overrides['Goryo'] = 10;
    const scores = makeScores(overrides);
    render(<CandidateList candidate_scores={scores} />);

    expect(screen.getByText('Banshee')).toBeInTheDocument();
    expect(screen.getByText('Phantom')).toBeInTheDocument();
    expect(screen.getByText('Goryo')).toBeInTheDocument();
  });
});
