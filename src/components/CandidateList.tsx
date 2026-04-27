'use client';

import React from 'react';

import Ghost from '../components/Ghost';
import ghost_data_map from '../lib/ghost_data_map.json';
import type { GhostDataMap } from '../lib/types';

const ghosts: GhostDataMap = ghost_data_map[0];

interface CandidateListProps {
  candidate_scores: Map<string, number>;
}

interface CandidateListState {
  candidate_scores: Map<string, number>;
}

class CandidateList extends React.Component<
  CandidateListProps,
  CandidateListState
> {
  constructor(props: CandidateListProps) {
    super(props);
    this.state = {
      candidate_scores: props.candidate_scores,
    };
  }

  renderGhostEntry = (
    value: [string, { evidence_list: string[]; fake_evidence_list: string[] }]
  ) => {
    const name = value[0];
    const evidence_list = value[1]['evidence_list'];
    const fake_evidence_list = value[1]['fake_evidence_list'];
    return (
      <Ghost
        name={name}
        evidence_list={evidence_list}
        fake_evidence_list={fake_evidence_list}
        key={name}
      />
    );
  };

  /** Return a map of Ghost names to their evidences and candidate scores. */
  getVisibleGhosts() {
    const visible = new Map<
      string,
      { evidence_list: string[]; fake_evidence_list: string[]; score: number }
    >();
    for (const [ghost_name, score] of this.state.candidate_scores) {
      if (score >= 0) {
        visible.set(ghost_name, {
          evidence_list: ghosts[ghost_name]['evidence_list'],
          fake_evidence_list: ghosts[ghost_name]['fake_evidence_list'],
          score: 0,
        });
      }
    }
    return visible;
  }

  render() {
    const total_ghost_count = Object.keys(ghosts).length;
    if (
      this.getVisibleGhosts().size < total_ghost_count &&
      this.getVisibleGhosts().size > 0
    ) {
      return (
        <section className="candidates">
          <h1> Possible ghosts</h1>
          <div className="candidateList">
            {Array.from(this.getVisibleGhosts().entries()).map(
              this.renderGhostEntry
            )}
          </div>
        </section>
      );
    } else {
      return (
        <section className="candidates">
          <h1> Possible ghosts</h1>
          <div className="candidateList">
            <div>No ghosts match the selected evidence.</div>
          </div>
        </section>
      );
    }
  }
}

export default CandidateList;
