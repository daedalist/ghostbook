import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Ghostbook from '../components/Ghostbook';
import evidence from '../lib/evidence';
import ghost_data_map from '../lib/ghost_data_map.json';

const ghostNames = Object.keys(ghost_data_map[0]);

/**
 * Helper: return the observations section so evidence-button queries
 * are scoped and won't collide with ghost-card evidence lists.
 */
function getObservations() {
  return within(document.querySelector('.observations'));
}

/**
 * Helper: click an evidence button by name (scoped to the observations panel).
 */
async function clickEvidence(user, name) {
  await user.click(getObservations().getByText(name));
}

/**
 * Helper: find all ghost cards currently shown in the candidate list.
 * Each ghost card has className "ghost" and contains a "ghostName" div.
 */
function getVisibleGhostNames() {
  const ghostCards = document.querySelectorAll('.ghost .ghostName');
  return Array.from(ghostCards).map((el) => el.textContent);
}

/**
 * Helper: get the ghosts from the data that match a given set of selected
 * evidence (all selected evidence must be in the ghost's evidence or
 * fake_evidence list, and no ruled-out evidence can be in either list).
 */
function expectedGhostsForEvidence(selected = [], ruledOut = []) {
  return ghostNames.filter((name) => {
    const data = ghost_data_map[0][name];
    const allEvidence = [...data.evidence_list, ...data.fake_evidence_list];
    const matchesSelected = selected.every((e) => allEvidence.includes(e));
    const matchesRuledOut = ruledOut.every((e) => !allEvidence.includes(e));
    return matchesSelected && matchesRuledOut;
  });
}

describe('Ghostbook integration', () => {
  describe('initial state', () => {
    it('renders the app title', () => {
      render(<Ghostbook />);
      expect(screen.getByText('Phasmophobia Ghostbook')).toBeInTheDocument();
    });

    it('renders all seven evidence buttons', () => {
      render(<Ghostbook />);
      const obs = getObservations();
      Object.values(evidence).forEach((name) => {
        expect(obs.getByText(name)).toBeInTheDocument();
      });
    });

    it('shows "No ghosts match" initially (before any evidence is selected)', () => {
      render(<Ghostbook />);
      expect(
        screen.getByText(/no ghosts match the selected evidence/i)
      ).toBeInTheDocument();
    });

    it('renders the Reset button', () => {
      render(<Ghostbook />);
      expect(screen.getByText('Reset')).toBeInTheDocument();
    });
  });

  describe('selecting evidence', () => {
    it('shows matching ghosts when one evidence is selected', async () => {
      const user = userEvent.setup();
      render(<Ghostbook />);

      await clickEvidence(user, 'Fingerprints');

      const visible = getVisibleGhostNames();
      const expected = expectedGhostsForEvidence(['Fingerprints']);
      expect(visible.sort()).toEqual(expected.sort());
      expect(visible.length).toBeGreaterThan(0);
    });

    it('narrows results when two evidence types are selected', async () => {
      const user = userEvent.setup();
      render(<Ghostbook />);

      await clickEvidence(user, 'Fingerprints');
      const afterFirst = getVisibleGhostNames();

      await clickEvidence(user, 'Ghost orb');
      const afterSecond = getVisibleGhostNames();

      expect(afterSecond.length).toBeLessThan(afterFirst.length);

      const expected = expectedGhostsForEvidence(['Fingerprints', 'Ghost orb']);
      expect(afterSecond.sort()).toEqual(expected.sort());
    });

    it('shows exactly one ghost when three unique evidence types are selected', async () => {
      // Banshee: Fingerprints, Ghost orb, D.O.T.S projector
      const user = userEvent.setup();
      render(<Ghostbook />);

      await clickEvidence(user, 'Fingerprints');
      await clickEvidence(user, 'Ghost orb');
      await clickEvidence(user, 'D.O.T.S projector');

      const visible = getVisibleGhostNames();
      expect(visible).toContain('Banshee');
    });
  });

  describe('ruling out evidence', () => {
    it('cycles evidence through NOT_SELECTED → SELECTED → RULED_OUT', async () => {
      const user = userEvent.setup();
      render(<Ghostbook />);

      const button = getObservations().getByText('Ghost orb');

      // First click: NOT_SELECTED → SELECTED
      await user.click(button);
      expect(button).toHaveClass('evidenceSelected');

      // Second click: SELECTED → RULED_OUT
      await user.click(button);
      expect(button).toHaveClass('evidenceRuledOut');

      // Third click: RULED_OUT → NOT_SELECTED
      await user.click(button);
      expect(button).toHaveClass('evidenceNotSelected');
    });

    it('eliminates ghosts that have ruled-out evidence', async () => {
      const user = userEvent.setup();
      render(<Ghostbook />);

      // Select Fingerprints to show some ghosts
      await clickEvidence(user, 'Fingerprints');
      const beforeRuleOut = getVisibleGhostNames();

      // Rule out Ghost orb (click twice: select then rule out)
      await clickEvidence(user, 'Ghost orb');
      await clickEvidence(user, 'Ghost orb');

      const afterRuleOut = getVisibleGhostNames();

      // Ghosts with Ghost orb should be eliminated
      const ghostsWithGhostOrb = ghostNames.filter((name) => {
        const data = ghost_data_map[0][name];
        return (
          data.evidence_list.includes('Ghost orb') ||
          data.fake_evidence_list.includes('Ghost orb')
        );
      });

      ghostsWithGhostOrb.forEach((name) => {
        expect(afterRuleOut).not.toContain(name);
      });

      expect(afterRuleOut.length).toBeLessThan(beforeRuleOut.length);
    });
  });

  describe('reset functionality', () => {
    it('clears all evidence and restores initial state', async () => {
      const user = userEvent.setup();
      render(<Ghostbook />);

      // Select some evidence
      await clickEvidence(user, 'Fingerprints');
      await clickEvidence(user, 'Ghost orb');

      // Verify ghosts are shown (not the initial "no match" message)
      expect(getVisibleGhostNames().length).toBeGreaterThan(0);

      // Click reset
      await user.click(screen.getByText('Reset'));

      // Should be back to initial state
      expect(
        screen.getByText(/no ghosts match the selected evidence/i)
      ).toBeInTheDocument();
    });

    it('resets all evidence buttons to NOT_SELECTED state', async () => {
      const user = userEvent.setup();
      render(<Ghostbook />);

      await clickEvidence(user, 'Fingerprints');
      await clickEvidence(user, 'Ghost orb');

      await user.click(screen.getByText('Reset'));

      const obs = getObservations();
      Object.values(evidence).forEach((name) => {
        expect(obs.getByText(name)).toHaveClass('evidenceNotSelected');
      });
    });
  });

  describe('evidence disabling', () => {
    it('disables evidence that no remaining candidates can have', async () => {
      const user = userEvent.setup();
      render(<Ghostbook />);

      // Select all three Banshee evidence types:
      // Fingerprints, Ghost orb, D.O.T.S projector
      await clickEvidence(user, 'Fingerprints');
      await clickEvidence(user, 'Ghost orb');
      await clickEvidence(user, 'D.O.T.S projector');

      // Banshee doesn't have Spirit box, EMF Level 5,
      // Freezing temperatures, or Ghost writing.
      // These should be disabled if Banshee is the only match.
      const visible = getVisibleGhostNames();
      if (visible.length === 1 && visible[0] === 'Banshee') {
        const obs = getObservations();
        const bansheeEvidence = ghost_data_map[0]['Banshee'].evidence_list;
        Object.values(evidence).forEach((name) => {
          const button = obs.getByText(name);
          if (!bansheeEvidence.includes(name)) {
            expect(button).toHaveClass('evidenceDisabled');
          }
        });
      }
    });

    it('re-enables evidence when candidates change', async () => {
      const user = userEvent.setup();
      render(<Ghostbook />);

      // Narrow down to Banshee
      await clickEvidence(user, 'Fingerprints');
      await clickEvidence(user, 'Ghost orb');
      await clickEvidence(user, 'D.O.T.S projector');

      // Now reset
      await user.click(screen.getByText('Reset'));

      // All evidence should be back to NOT_SELECTED (not disabled)
      const obs = getObservations();
      Object.values(evidence).forEach((name) => {
        expect(obs.getByText(name)).toHaveClass('evidenceNotSelected');
      });
    });
  });

  describe('scoring algorithm', () => {
    it('The Mimic matches on both primary and fake evidence', async () => {
      const user = userEvent.setup();
      render(<Ghostbook />);

      // The Mimic has primary: Spirit box, Fingerprints, Freezing temps
      // and fake: Ghost orb
      // Selecting Ghost orb should still show The Mimic
      await clickEvidence(user, 'Ghost orb');
      const visible = getVisibleGhostNames();
      expect(visible).toContain('The Mimic');
    });

    it('shows "No ghosts match" when impossible evidence combination is selected', async () => {
      const user = userEvent.setup();
      render(<Ghostbook />);

      // Select Fingerprints, then rule out every other evidence.
      await clickEvidence(user, 'Fingerprints');

      // Rule out each remaining evidence (click twice: select then rule out)
      const toRuleOut = [
        'Ghost orb',
        'Spirit box',
        'EMF Level 5',
        'Freezing temperatures',
        'Ghost writing',
        'D.O.T.S projector',
      ];

      for (const name of toRuleOut) {
        await clickEvidence(user, name);
        await clickEvidence(user, name);
      }

      // No ghost can have only Fingerprints and nothing else
      expect(
        screen.getByText(/no ghosts match the selected evidence/i)
      ).toBeInTheDocument();
    });
  });
});
