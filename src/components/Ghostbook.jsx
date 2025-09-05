'use client'

import React from 'react';
import { evidence } from '../lib/ghost';
import ghost_data_map from '../lib/ghost_data_map.json';
import ObservationList from './ObservationList';
import evidenceState from '../lib/evidenceState';
import CandidateList from './CandidateList';

function Header() {
    return (
        <header>
            <h1>Phasmophobia Ghostbook</h1>
        </header>
    );
}

export default class Ghostbook extends React.Component {
    constructor(props) {
        super(props);

        // Initialize evidence.
        const observed_evidence = new Map();
        Object.values(evidence).forEach((e) => {
            observed_evidence.set(
                e, evidenceState.NOT_SELECTED);
        });

        // Initialize ghosts.
        const candidate_scores = new Map();
        Object.keys(ghost_data_map[0]).forEach(
            (k) => candidate_scores.set(k, 0));

        this.state = {
            observed_evidence: observed_evidence,
            candidate_scores: candidate_scores
        };
    }

    /** When user clicks an observation, calculate which ghosts are eligible. */
    handleEvidenceClick(clicked_evidence) {
        // TODO: I don't know why I can't make this immutable with a new Map().
        const observed_evidence = this.state.observed_evidence;
        const current_status = observed_evidence.get(clicked_evidence);
        const candidate_scores = this.state.candidate_scores;

        // Change the status of the clicked evidence.
        switch (current_status) {
            case evidenceState.NOT_SELECTED:
                observed_evidence.set(clicked_evidence,
                  evidenceState.SELECTED);
                break;

            case evidenceState.SELECTED:
                observed_evidence.set(clicked_evidence,
                  evidenceState.RULED_OUT);
                break;

            case evidenceState.RULED_OUT:
                observed_evidence.set(clicked_evidence,
                  evidenceState.NOT_SELECTED)
                break;

            case evidenceState.DISABLED:
                break; // User cannot directly change if it is disabled.
            default:
                break;
        }

        // Recalculate candidate scores.
        // Score > 0: candidate is a possibility.
        // Score = 0: no evidence either way.
        // Score < 0: ruled out.
        for (const ghost_name of candidate_scores.keys()) {
            let score = 0;
            const evidence_list =
                Array.from(ghost_data_map[0][ghost_name]['evidence_list']);
            const fake_evidence_list =
                Array.from(ghost_data_map[0][ghost_name]['fake_evidence_list']);
            for (const [evidence_name, status] of observed_evidence) {
                if (status === evidenceState.SELECTED) {
                    if (evidence_list.includes(evidence_name)) {
                        score += 10;
                    } else if (fake_evidence_list.includes(evidence_name)) {
                        score += 5
                    } else {
                        score = -10;
                        break;
                    }
                } else if (status === evidenceState.RULED_OUT) {
                    if (evidence_list.includes(evidence_name)) {
                        score = -10;
                        break;
                    }
                }
            }
            candidate_scores.set(ghost_name, score);
        }

        // Disable evidence that can be ruled out.
        const possible_evidence = new Set();
        for (const [ghost_name, score] of candidate_scores.entries()) {
            if (score >= 0) {
                const evidence_list = Array.from(
                    ghost_data_map[0][ghost_name]['evidence_list']);
                evidence_list.forEach((v) => possible_evidence.add(v));
            }
        }
        if (possible_evidence.size > 0) {
            for (const [ev, st] of observed_evidence) {
                if (!possible_evidence.has(ev)
                    && st === evidenceState.NOT_SELECTED) {
                    observed_evidence.set(ev, evidenceState.DISABLED);
                } else if (possible_evidence.has(ev)
                    && st === evidenceState.DISABLED) {
                    observed_evidence.set(ev, evidenceState.NOT_SELECTED);
                }
            }
        }

        this.setState({
            observed_evidence: observed_evidence,
            candidate_scores: candidate_scores
        });
    }

    /** When user clicks the reset button, reset all observations. */
    handleResetClick() {
        const observed_evidence = this.state.observed_evidence;
        for (const key of observed_evidence.keys()) {
            observed_evidence.set(key, evidenceState.NOT_SELECTED);
        }

        const candidate_scores = this.state.candidate_scores;
        for (const key of candidate_scores.keys()) {
            candidate_scores.set(key, 0);
        }

        this.setState({
            observed_evidence: observed_evidence,
            candidate_scores: candidate_scores
        });
    }

    render() {
        return (
            <div className="ghostBook">
                <Header />
                <section className="content">
                    <ObservationList
                        observed_evidence={this.state.observed_evidence}
                        handleEvidenceClick={e => this.handleEvidenceClick(e)}
                        handleResetClick={() => this.handleResetClick()}
                    />
                    <CandidateList
                        candidate_scores={this.state.candidate_scores}
                        observed_evidence={this.state.observed_evidence}
                    />
                </section>
            </div>
        );
    }
}