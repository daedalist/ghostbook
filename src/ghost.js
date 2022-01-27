import React from 'react';

import ghost_data_map from './ghost_data_map.json';

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
                <a
                    className="detailsButton"
                    onClick={this.handleDetailsClick}>
                    {this.state.showDetails ? "-" : "+"} details</a>
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
        const strength = ghost_data_map[0][this.props.name]["strength"];
        const weakness = ghost_data_map[0][this.props.name]["weakness"];

        return (
            <div className="ghost">
                <div className="ghostName">{this.props.name}</div>
                <GhostDetails
                    strength={strength}
                    weakness={weakness}
                />
                <ul className="evidenceList">
                    {evidences}
                    {fake_evidences}
                </ul>
            </div>
        );
    }
}

export default Ghost;