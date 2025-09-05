'use client'

import React from 'react';

import Ghost from '../components/Ghost';
import ghost_data_map from '../lib/ghost_data_map.json';

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
        const fake_evidence_list = value[1]["fake_evidence_list"];
        return (
            <Ghost
                name={name}
                evidence_list={evidence_list}
                fake_evidence_list={fake_evidence_list}
                key={name}
            />
        )
    }

    /** Return a map of Ghost names to their evidences and candidate scores. */
    getVisibleGhosts() {
        const ghosts = new Map();
        for (const [ghost_name, score] of this.state.candidate_scores) {
            if (score >= 0) {
                ghosts.set(ghost_name,
                    {
                        "evidence_list":
                            ghost_data_map[0][ghost_name]["evidence_list"],
                        "fake_evidence_list":
                            ghost_data_map[0][ghost_name]["fake_evidence_list"],
                        "score": 0
                    }
                )
            }
        }
        return ghosts;
    }

    render() {
        const total_ghost_count = Object.keys(ghost_data_map[0]).length;
        if (this.getVisibleGhosts().size < total_ghost_count
            && this.getVisibleGhosts().size > 0) {
            return (
                <section className="candidates">
                    <h1> Possible ghosts</h1>
                    <div className="candidateList">
                        {Array.from(this.getVisibleGhosts().entries())
                            .map(this.renderGhostEntry)}
                    </div></section >

            );
        } else {
            return (
                <section className="candidates">
                    <h1> Possible ghosts</h1>
                    <div className="candidateList">
                        <div>No ghosts match the selected evidence.</div>
                    </div></section >

            );
        }
    }

}

export default CandidateList;