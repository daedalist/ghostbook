import React from 'react';

export const evidence_state = {
    SELECTED: 'evidenceSelected',
    NOT_SELECTED: 'evidenceNotSelected',
    DISABLED: 'evidenceDisabled',
    RULED_OUT: 'evidenceRuledOut'
}

function ResetButton(props) {
    const classNames = "button resetButton"
    return (<div className={classNames} onClick={props.onClick}>Reset</div>)
}

function EvidenceButton(props) {
    const classNames = "evidenceButton button " + props.state;
    return (
        <li className={classNames} onClick={props.onClick}>
            {props.name}
        </li>
    )
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
            <EvidenceButton
                name={evidence_name}
                state={evidence_state}
                onClick={() => this.props.handleEvidenceClick(evidence_name)}
                key={evidence_name}
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
                </ul>
                <ResetButton
                    onClick={() => this.props.handleResetClick()}
                />
            </section>
        );
    }
}

export default ObservationList;