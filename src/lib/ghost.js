'use client'

import React from 'react';

import ghost_data_map from './ghost_data_map.json';
import evidenceState from './evidenceState';

export const evidence = {
    GHOST_ORB: 'Ghost orb',
    SPIRIT_BOX: 'Spirit box',
    FINGERPRINTS: 'Fingerprints',
    EMF_5: 'EMF Level 5',
    FREEZING: 'Freezing temperatures',
    GHOST_WRITING: 'Ghost writing',
    DOTS_PROJECTOR: 'D.O.T.S projector',
}

class GhostDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = { showDetails: false }
        this.handleDetailsClick = this.handleDetailsClick.bind(this);
    }

    handleDetailsClick() {
        this.setState(prevState => ({
            showDetails: !prevState.showDetails
        }));
    }

    render() {
        return (
            <div>
                <button
                    className="detailsButton"
                    onClick={this.handleDetailsClick}>
                    {this.state.showDetails ? "-" : "+"} details</button>
                <div
                    className={this.state.showDetails ? "ghostDetailsShown" : "ghostDetailsHidden"}>
                    <p>{this.props.strength}</p>
                    <p>{this.props.weakness}</p>
                </div>
            </div>
        );
    }
}

class Ghost extends React.Component {
    render() {
        const strength = ghost_data_map[0][this.props.name]["strength"];
        const weakness = ghost_data_map[0][this.props.name]["weakness"];

        // Categorize evidence by status if observed_evidence is provided
        let evidenceByStatus = {
            selected: [],
            needed: [],
            ruledOut: []
        };

        if (this.props.observed_evidence) {
            this.props.evidence_list.forEach(evidence => {
                const status = this.props.observed_evidence.get(evidence);
                if (status === evidenceState.SELECTED) {
                    evidenceByStatus.selected.push(evidence);
                } else if (status === evidenceState.RULED_OUT) {
                    evidenceByStatus.ruledOut.push(evidence);
                } else {
                    evidenceByStatus.needed.push(evidence);
                }
            });
        } else {
            // Fallback to original behavior if no evidence state provided
            evidenceByStatus.needed = [...this.props.evidence_list];
        }

        // Create fake evidence elements
        const fake_evidences = this.props.fake_evidence_list.map(
            (e) => {
                return (<li className="fakeEvidence" key={e}>{e}</li>);
            }
        );

        // Determine priority class based on remaining evidence
        const remainingCount = this.props.remainingCount || evidenceByStatus.needed.length;
        let priorityClass = '';
        if (remainingCount === 0) {
            priorityClass = 'highPriority';
        } else if (remainingCount === 1) {
            priorityClass = 'mediumPriority';
        }

        return (
            <div className={`ghost ${priorityClass}`}>
                <div className="ghostName">
                    {this.props.name}
                    {remainingCount > 0 && (
                        <span className="remainingCounter">
                            {remainingCount}
                        </span>
                    )}
                    {remainingCount === 0 && (
                        <span className="completedBadge">✓</span>
                    )}
                </div>
                
                <GhostDetails
                    strength={strength}
                    weakness={weakness}
                />
                
                <ul className="evidenceList">
                    {/* Show needed evidence first and highlighted */}
                    {evidenceByStatus.needed.map(e => (
                        <li key={e} className="evidenceNeeded">
                            <span className="evidenceIcon">⚠️</span>
                            {e}
                        </li>
                    ))}
                    
                    {/* Then show confirmed evidence */}
                    {evidenceByStatus.selected.map(e => (
                        <li key={e} className="evidenceConfirmed">
                            <span className="evidenceIcon">✓</span>
                            {e}
                        </li>
                    ))}
                    
                    {/* Show fake evidence */}
                    {fake_evidences}
                    
                    {/* Show conflicting evidence last (if any) */}
                    {evidenceByStatus.ruledOut.map(e => (
                        <li key={e} className="evidenceConflict">
                            <span className="evidenceIcon">✗</span>
                            {e}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default Ghost;