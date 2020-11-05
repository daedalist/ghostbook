import React from 'react';

import Ghost from './ghost';
import ghost_data_map from './ghost_data_map.json';

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
                        <div>No ghosts match the selected evidence.</div>
                    </div></section >

            );
        }
    }

}

export default CandidateList;