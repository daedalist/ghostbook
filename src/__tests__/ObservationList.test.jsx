import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ObservationList from '../components/ObservationList';
import evidence from '../lib/evidence';
import evidenceState from '../lib/evidenceState';

function makeObservedEvidence(overrides = {}) {
  const observed = new Map();
  Object.values(evidence).forEach((e) => {
    observed.set(e, overrides[e] || evidenceState.NOT_SELECTED);
  });
  return observed;
}

describe('ObservationList component', () => {
  it('renders all seven evidence buttons', () => {
    const observed = makeObservedEvidence();
    render(
      <ObservationList
        observed_evidence={observed}
        handleEvidenceClick={() => {}}
        handleResetClick={() => {}}
      />
    );

    Object.values(evidence).forEach((name) => {
      expect(screen.getByText(name)).toBeInTheDocument();
    });
  });

  it('renders a reset button', () => {
    const observed = makeObservedEvidence();
    render(
      <ObservationList
        observed_evidence={observed}
        handleEvidenceClick={() => {}}
        handleResetClick={() => {}}
      />
    );

    expect(screen.getByText('Reset')).toBeInTheDocument();
  });

  it('renders the section heading', () => {
    const observed = makeObservedEvidence();
    render(
      <ObservationList
        observed_evidence={observed}
        handleEvidenceClick={() => {}}
        handleResetClick={() => {}}
      />
    );

    expect(screen.getByText('My observations')).toBeInTheDocument();
  });

  it('calls handleEvidenceClick with the evidence name when a button is clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    const observed = makeObservedEvidence();

    render(
      <ObservationList
        observed_evidence={observed}
        handleEvidenceClick={handleClick}
        handleResetClick={() => {}}
      />
    );

    await user.click(screen.getByText('Ghost orb'));
    expect(handleClick).toHaveBeenCalledWith('Ghost orb');
  });

  it('calls handleResetClick when the reset button is clicked', async () => {
    const user = userEvent.setup();
    const handleReset = vi.fn();
    const observed = makeObservedEvidence();

    render(
      <ObservationList
        observed_evidence={observed}
        handleEvidenceClick={() => {}}
        handleResetClick={handleReset}
      />
    );

    await user.click(screen.getByText('Reset'));
    expect(handleReset).toHaveBeenCalledOnce();
  });

  it('applies the correct CSS class for each evidence state', () => {
    const observed = makeObservedEvidence({
      'Ghost orb': evidenceState.SELECTED,
      'Spirit box': evidenceState.RULED_OUT,
      'Fingerprints': evidenceState.DISABLED,
    });

    render(
      <ObservationList
        observed_evidence={observed}
        handleEvidenceClick={() => {}}
        handleResetClick={() => {}}
      />
    );

    expect(screen.getByText('Ghost orb')).toHaveClass(
      evidenceState.SELECTED
    );
    expect(screen.getByText('Spirit box')).toHaveClass(
      evidenceState.RULED_OUT
    );
    expect(screen.getByText('Fingerprints')).toHaveClass(
      evidenceState.DISABLED
    );
    expect(screen.getByText('EMF Level 5')).toHaveClass(
      evidenceState.NOT_SELECTED
    );
  });
});
