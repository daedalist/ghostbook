'use client'

import React from 'react';

import Ghost from '../lib/ghost';
import ghost_data_map from '../lib/ghost_data_map.json';
import evidenceState from '../lib/evidenceState';

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
        const remainingCount = value[1]["remainingCount"];
        
        return (
            <Ghost
                name={name}
                evidence_list={evidence_list}
                fake_evidence_list={fake_evidence_list}
                observed_evidence={this.props.observed_evidence}
                remainingCount={remainingCount}
                key={name}
            />
        )
    }

    /** Return a map of Ghost names to their evidences and candidate scores. */
    getVisibleGhosts() {
        const ghosts = new Map();
        for (const [ghost_name, score] of this.state.candidate_scores) {
            if (score >= 0) {
                const evidence_list = ghost_data_map[0][ghost_name]["evidence_list"];
                
                // Calculate remaining evidence count
                const remainingCount = evidence_list.filter(evidence => {
                    const status = this.props.observed_evidence.get(evidence);
                    return status !== evidenceState.SELECTED;
                }).length;
                
                ghosts.set(ghost_name, {
                    "evidence_list": evidence_list,
                    "fake_evidence_list": ghost_data_map[0][ghost_name]["fake_evidence_list"],
                    "score": score,
                    "remainingCount": remainingCount
                });
            }
        }
        return ghosts;
    }

    render() {
        const total_ghost_count = Object.keys(ghost_data_map[0]).length;
        const visibleGhosts = this.getVisibleGhosts();
        
        if (visibleGhosts.size < total_ghost_count && visibleGhosts.size > 0) {
            // Sort ghosts by remaining evidence count (ascending - fewer remaining = higher priority)
            const sortedGhosts = Array.from(visibleGhosts.entries())
                .sort((a, b) => a[1].remainingCount - b[1].remainingCount);

            // Quick picks - ghosts that need 1 or 0 evidence
            const quickPicks = sortedGhosts.filter(ghost => ghost[1].remainingCount <= 1);

            return (
                <section className="candidates">
                    <h1>Possible ghosts</h1>
                    
                    {quickPicks.length > 0 && (
                        <div className="quickPicks">
                            <h3>🎯 Most Likely</h3>
                            {quickPicks.map(ghost => (
                                <div key={ghost[0]} className="quickPick">
                                    <strong>{ghost[0]}</strong> - 
                                    {ghost[1].remainingCount === 0 ? 
                                        " All evidence found!" : 
                                        ` Only ${ghost[1].remainingCount} evidence needed`}
                                </div>
                            ))}
                        </div>
                    )}
                    
                    <div className="candidateList">
                        {sortedGhosts.map(this.renderGhostEntry)}
                    </div>
                </section>
            );
        } else {
            return (
                <section className="candidates">
                    <h1>Possible ghosts</h1>
                    <div className="candidateList">
                        <div>No ghosts match the selected evidence.</div>
                    </div>
                </section>
            );
        }
    }
}

export default CandidateList;