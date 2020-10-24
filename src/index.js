import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import Ghost, { evidence } from './ghost';
import data from './ghost_data.json';

class ObservationList extends React.Component {
    render() {
        return (
            <section className="observations">
                <h1>My observations</h1>
                <div className="observationList">
                    Observations
            </div></section >
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
