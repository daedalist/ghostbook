import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import Ghost, { evidence } from './ghost';
import data from './ghost_data.json';

const evidence_state = {
    SELECTED: 'evidenceSelected',
    NOT_SELECTED: 'evidenceNotSelected',
    DISABLED: 'evidenceDisabled'
}

function EvidenceButton(props) {
    const classNames = "evidenceButton " + props.state;
    return (
        <li className={classNames} onClick={props.onClick} key={props.name}>
            {props.name}
        </li>)
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
            < EvidenceButton
                name={evidence_name}
                state={evidence_state}
                onClick={() => this.props.handleEvidenceClick(evidence_name)}
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
    read_ghost_data() {
        const ghosts = data.map((i) => {
            return (
                <Ghost
                    name={i.name}
                    evidence_list={i.evidence_list}
                />
            );
        });
        return ghosts;
    }

    render() {
        return (
            <section className="candidates">
                <h1> Possible ghosts</h1>
                <div className="candidateList">
                    {this.read_ghost_data()}
                </div></section >

        );
    }

}

class Ghostbook extends React.Component {
    constructor(props) {
        super(props);
        const observed_evidence = new Map();
        Object.values(evidence).forEach((e) => {
            observed_evidence.set(
                e, evidence_state.NOT_SELECTED);
        });

        this.state = {
            observed_evidence: observed_evidence,
        };
    }

    handleEvidenceClick(selected_evidence) {
        // TODO: I don't know why I can't make this immutable with a new Map().
        const observed_evidence = this.state.observed_evidence;
        const current_status = observed_evidence.get(selected_evidence);
        switch (current_status) {
            case evidence_state.NOT_SELECTED:
                observed_evidence.set(selected_evidence,
                    evidence_state.SELECTED);
                break;
            case evidence_state.SELECTED:
                observed_evidence.set(selected_evidence,
                    evidence_state.NOT_SELECTED);
                break;
            case evidence_state.DISABLED:
                break; // User cannot directly change if it is disabled.
            default:
                break;
        }
        this.setState({
            observed_evidence: observed_evidence
        });
    }

    render() {
        return (
            <div className="ghostBook" >
                <ObservationList
                    observed_evidence={this.state.observed_evidence}
                    handleEvidenceClick={e => this.handleEvidenceClick(e)}
                />
                <CandidateList />
            </div >
        );
    }
}

// === Run the app ===
ReactDOM.render(
    <Ghostbook />,
    document.getElementById('root')
);
