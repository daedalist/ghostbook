import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import Ghost, { evidence } from './ghost';
import data from './ghost_data.json';

function EvidenceButton(props) {
    return (
        <li className="evidenceButton" onClick={props.onClick}>
            {props.evidence}
        </li>
    );
}

class ObservationList extends React.Component {
    renderEvidenceButton(evidence) {
        return (
            <EvidenceButton
                evidence={evidence}
                onClick={() => this.props.onClick(evidence)}
            />
        );
    }

    render() {
        return (
            <section className="observations">
                <h1>My observations</h1>
                <ul className="observationList">
                    {Object.values(evidence).map(this.renderEvidenceButton)}
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
    render() {
        return (
            <div class="ghostBook">
                <ObservationList />
                <CandidateList />
            </div>
        );
    }
}

// === Run the app ===
ReactDOM.render(
    <Ghostbook />,
    document.getElementById('root')
);
