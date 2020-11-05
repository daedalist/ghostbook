import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { evidence } from './ghost';
import ghost_data_map from './ghost_data_map.json';
import ObservationList, { evidence_state } from './observation_list';
import CandidateList from './candidate_list';

function Header(props) {
    return (
        <header>
            <h1>Phasmophobia Ghostbook</h1>
        </header >
    );
}

class Ghostbook extends React.Component {
    constructor(props) {
        super(props);

        // Initialize evidence.
        const observed_evidence = new Map();
        Object.values(evidence).forEach((e) => {
            observed_evidence.set(
                e, evidence_state.NOT_SELECTED);
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

    handleEvidenceClick(clicked_evidence) {
        // TODO: I don't know why I can't make this immutable with a new Map().
        const observed_evidence = this.state.observed_evidence;
        const current_status = observed_evidence.get(clicked_evidence);
        const candidate_scores = this.state.candidate_scores;

        switch (current_status) {
            case evidence_state.NOT_SELECTED:
                observed_evidence.set(clicked_evidence,
                    evidence_state.SELECTED);
                break;

            case evidence_state.SELECTED:
                observed_evidence.set(clicked_evidence,
                    evidence_state.NOT_SELECTED);
                break;

            case evidence_state.DISABLED:
                break; // User cannot directly change if it is disabled.
            default:
                break;
        }

        // Recalculate candidate scores.
        for (const ghost_name of candidate_scores.keys()) {
            let score = 0;
            const evidence_list =
                Array.from(ghost_data_map[0][ghost_name]['evidence_list']);
            for (const [evidence_name, status] of observed_evidence) {
                if (status === evidence_state.SELECTED) {
                    if (evidence_list.includes(evidence_name)) {
                        score += 10;
                    } else {
                        score = 0;
                        break;
                    }
                }
            }
            candidate_scores.set(ghost_name, score);
        }

        // Disable evidence that can be ruled out.
        const possible_evidence = new Set();
        for (const [ghost_name, score] of candidate_scores.entries()) {
            if (score > 0) {
                const evidence_list = Array.from(
                    ghost_data_map[0][ghost_name]['evidence_list']);
                evidence_list.forEach((v) => possible_evidence.add(v));
            }
        }
        if (possible_evidence.size > 0) {
            for (const [ev, st] of observed_evidence) {
                if (!possible_evidence.has(ev)
                    && st === evidence_state.NOT_SELECTED) {
                    observed_evidence.set(ev, evidence_state.DISABLED);
                } else if (possible_evidence.has(ev)
                    && st === evidence_state.DISABLED) {
                    observed_evidence.set(ev, evidence_state.NOT_SELECTED);
                }
            }
        }

        this.setState({
            observed_evidence: observed_evidence,
            candidate_scores: candidate_scores
        });
    }

    handleResetClick() {
        const observed_evidence = this.state.observed_evidence;
        for (const key of observed_evidence.keys()) {
            observed_evidence.set(key, evidence_state.NOT_SELECTED);
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
            <div className="ghostBook" >
                <Header />
                <section className="content">
                    <ObservationList
                        observed_evidence={this.state.observed_evidence}
                        handleEvidenceClick={e => this.handleEvidenceClick(e)}
                        handleResetClick={() => this.handleResetClick()}
                    />
                    <CandidateList
                        candidate_scores={this.state.candidate_scores}
                    />
                </section>
            </div >
        );
    }
}

// === Run the app ===
ReactDOM.render(
    <Ghostbook />,
    document.getElementById('root')
);
