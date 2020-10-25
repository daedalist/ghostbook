import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import Ghost, { evidence } from './ghost';
import data from './ghost_data.json';

const evidence_state = {
    SELECTED: 1,
    NOT_SELECTED: 2,
    DISABLED: 3
}

class EvidenceButton extends React.Component {
    render() {
        return (
            <li className="evidenceButton" onClick={this.props.onClick}>
                {this.props.evidence_name}
            </li>
        );
    }
}

class ObservationList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            observed_evidence: props.observed_evidence,
        }
    }

    renderEvidenceButton(value) {
        return (
            < EvidenceButton
                evidence_name={value[0]}
                evidence_state={value[1]}
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

    handleEvidenceClick(e) {
        const observed_evidence = this.state.observed_evidence;
        let selected_evidence = observed_evidence
    }

    render() {
        return (
            <div className="ghostBook" >
                <ObservationList
                    observed_evidence={this.state.observed_evidence}
                    onClick={e => this.handleEvidenceClick(e)}
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
