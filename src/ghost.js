import React from 'react';

export const evidence = {
    GHOST_ORB: 'Ghost orb',
    SPIRIT_BOX: 'Spirit box',
    FINGERPRINTS: 'Fingerprints',
    EMF_5: 'EMF Level 5',
    FREEZING: 'Freezing temperatures',
    GHOST_WRITING: 'Ghost writing',
    DOTS_PROJECTOR: 'D.O.T.S projector',
}

class Ghost extends React.Component {
    render() {
        const evidences = this.props.evidence_list.map(
            (e) => {
                return (<li key={e}>{e}</li>);
            }
        );
        const fake_evidences = this.props.fake_evidence_list.map(
            (e) => {
                return (<li className="fakeEvidence" key={e}>{e}</li>);
            }
        )
        return (
            <div className="ghost">
                <div className="name">{this.props.name}</div>
                <ul className="evidenceList">
                    {evidences}
                    {fake_evidences}
                </ul>
            </div>
        );
    }
}

export default Ghost;