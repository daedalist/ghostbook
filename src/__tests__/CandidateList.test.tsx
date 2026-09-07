import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CandidateList from '../components/CandidateList';
import ghost_data_map from '../lib/ghost_data_map.json';

const ghostNames = Object.keys(ghost_data_map[0]);

function makeScores(overrides: Record<string, number> = {}) {
  const scores = new Map<string, number>();
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

  describe('with no evidence selected (all scores 0)', () => {
    function getShowAllToggle() {
      return screen.getByRole('button', { name: /show all ghosts/i });
    }

    function visibleGhostNames() {
      return Array.from(document.querySelectorAll('.ghost .ghostName')).map(
        (el) => el.textContent
      );
    }

    it('prompts for evidence instead of listing ghosts', () => {
      render(<CandidateList candidate_scores={makeScores()} />);
      expect(
        screen.getByText(/select evidence to narrow down the ghosts/i)
      ).toBeInTheDocument();
      expect(
        screen.queryByText(/no ghosts match the selected evidence/i)
      ).toBeNull();
      expect(visibleGhostNames()).toEqual([]);
    });

    it('renders the "Show all ghosts" toggle, off by default', () => {
      render(<CandidateList candidate_scores={makeScores()} />);
      expect(getShowAllToggle()).toHaveAttribute('aria-pressed', 'false');
    });

    it('shows every ghost when the toggle is switched on', async () => {
      const user = userEvent.setup();
      render(<CandidateList candidate_scores={makeScores()} />);

      await user.click(getShowAllToggle());

      expect(getShowAllToggle()).toHaveAttribute('aria-pressed', 'true');
      expect(visibleGhostNames()).toEqual(ghostNames);
    });

    it('hides the ghosts again when the toggle is switched off', async () => {
      const user = userEvent.setup();
      render(<CandidateList candidate_scores={makeScores()} />);

      await user.click(getShowAllToggle());
      await user.click(getShowAllToggle());

      expect(getShowAllToggle()).toHaveAttribute('aria-pressed', 'false');
      expect(visibleGhostNames()).toEqual([]);
    });
  });

  it('shows "No ghosts match" when all ghosts are eliminated', () => {
    const overrides: Record<string, number> = {};
    ghostNames.forEach((name) => {
      overrides[name] = -10;
    });
    const scores = makeScores(overrides);
    render(<CandidateList candidate_scores={scores} />);
    expect(
      screen.getByText(/no ghosts match the selected evidence/i)
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /show all ghosts/i })
    ).toBeNull();
  });

  it('does not offer the "Show all ghosts" toggle once evidence is selected', () => {
    const scores = makeScores({ Banshee: 10, Demon: -10 });
    render(<CandidateList candidate_scores={scores} />);
    expect(
      screen.queryByRole('button', { name: /show all ghosts/i })
    ).toBeNull();
  });

  it('renders matching ghosts when some have positive scores', () => {
    const scores = makeScores({ Banshee: 10, Demon: -10 });
    render(<CandidateList candidate_scores={scores} />);
    expect(screen.getByText('Banshee')).toBeInTheDocument();
  });

  it('does not render eliminated ghosts', () => {
    // Give one ghost a positive score and eliminate all others.
    const overrides: Record<string, number> = {};
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
    const overrides: Record<string, number> = {};
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
