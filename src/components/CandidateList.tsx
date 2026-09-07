'use client';

import React, { useState } from 'react';

import Ghost from '../components/Ghost';
import ghost_data_map from '../lib/ghost_data_map.json';
import type { GhostDataMap } from '../lib/types';

const ghosts: GhostDataMap = ghost_data_map[0];

interface CandidateListProps {
  candidate_scores: Map<string, number>;
}

/** Names of the ghosts that have not been ruled out (score >= 0). */
function getCandidateNames(candidate_scores: Map<string, number>): string[] {
  const names: string[] = [];
  for (const [ghost_name, score] of candidate_scores) {
    if (score >= 0) names.push(ghost_name);
  }
  return names;
}

/**
 * True when no evidence has been selected or ruled out. A selected evidence
 * gives every ghost a non-zero score, and a ruled-out evidence eliminates at
 * least one ghost, so "all scores are zero" is exactly the untouched state.
 */
function hasNoEvidence(candidate_scores: Map<string, number>): boolean {
  for (const score of candidate_scores.values()) {
    if (score !== 0) return false;
  }
  return true;
}

function renderGhostEntry(name: string) {
  return (
    <Ghost
      name={name}
      evidence_list={ghosts[name]['evidence_list']}
      fake_evidence_list={ghosts[name]['fake_evidence_list']}
      key={name}
    />
  );
}

/**
 * The "Possible ghosts" panel. With evidence selected it lists the ghosts
 * still in play. With none selected it prompts for evidence and offers a
 * "Show all ghosts" toggle, hidden by default and not persisted, so a fresh
 * load always starts with the list collapsed.
 */
export default function CandidateList({
  candidate_scores,
}: CandidateListProps) {
  const [showAll, setShowAll] = useState(false);

  const candidates = getCandidateNames(candidate_scores);
  const noEvidence = hasNoEvidence(candidate_scores);

  let body: React.ReactNode;
  if (noEvidence) {
    body = (
      <>
        <div className="candidatePrompt">
          <span>Select evidence to narrow down the ghosts.</span>
          <button
            type="button"
            className="button settingsToggle showAllToggle"
            onClick={() => setShowAll((prev) => !prev)}
            aria-pressed={showAll}
          >
            <span aria-hidden="true">{showAll ? '[x]' : '[ ]'}</span> Show all
            ghosts
          </button>
        </div>
        {showAll && candidates.map(renderGhostEntry)}
      </>
    );
  } else if (candidates.length === 0) {
    body = <div>No ghosts match the selected evidence.</div>;
  } else {
    body = candidates.map(renderGhostEntry);
  }

  return (
    <section className="candidates">
      <h1> Possible ghosts</h1>
      <div className="candidateList">{body}</div>
    </section>
  );
}
