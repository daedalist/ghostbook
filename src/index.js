import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import Ghost, { evidence } from './ghost';
import ghost_data_map from './ghost_data_map.json';

const evidence_state = {
    SELECTED: 'evidenceSelected',
    NOT_SELECTED: 'evidenceNotSelected',
    DISABLED: 'evidenceDisabled'
}

function EvidenceButton(props) {
    const classNames = "evidenceButton " + props.state;
    return (
        <li className={classNames} onClick={props.onClick}>
            {props.name}
        </li>
    )
}

class ObservationList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            observed_evidence: props.observed_evidence,
        }
    }

    renderEvidenceButton = (value) => {
        const evidence_name = value[0];
        const evidence_state = value[1];
        return (
            <EvidenceButton
                name={evidence_name}
                state={evidence_state}
                onClick={() => this.props.handleEvidenceClick(evidence_name)}
                key={evidence_name}
            />
        );
    }

    render() {
        return (
            <section className="observations">
                <h1>My observations</h1>
                <ul className="observationList">
                    {Array.from(this.state.observed_evidence.entries())
                        .map(this.renderEvidenceButton)}
                </ul></section>
        );
    }
}

class CandidateList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            candidate_scores: props.candidate_scores
        }
    }

    renderGhostEntry = (value) => {
        const name = value[0];
        const evidence_list = value[1]["evidence_list"];
        return (
            <Ghost
                name={name}
                evidence_list={evidence_list}
                key={name}
            />
        )
    }

    get_visible_ghosts() {
        const ghosts = new Map();
        for (const [ghost_name, score] of this.state.candidate_scores) {
            if (score > 0) {
                ghosts.set(ghost_name,
                    {
                        "evidence_list":
                            ghost_data_map[0][ghost_name]["evidence_list"],
                        "score": 0
                    }
                )
            }
        }
        return ghosts;
    }

    render() {
        if (this.get_visible_ghosts().size > 0) {
            return (
                <section className="candidates">
                    <h1> Possible ghosts</h1>
                    <div className="candidateList">
                        {Array.from(this.get_visible_ghosts().entries())
                            .map(this.renderGhostEntry)}
                    </div></section >

            );
        } else {
            return (
                <section className="candidates">
                    <h1> Possible ghosts</h1>
                    <div className="candidateList">
                        <p>No ghosts match the selected evidence.</p>
                    </div></section >

            );
        }
    }

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

            this.setState({
                observed_evidence: observed_evidence,
                candidate_scores: candidate_scores
            });
        }
    }

    render() {
        return (
            <div className="ghostBook" >
                <ObservationList
                    observed_evidence={this.state.observed_evidence}
                    handleEvidenceClick={e => this.handleEvidenceClick(e)}
                />
                <CandidateList
                    candidate_scores={this.state.candidate_scores}
                />
            </div >
        );
    }
}

// === Run the app ===
ReactDOM.render(
    <Ghostbook />,
    document.getElementById('root')
);
