'use client';

import React from 'react';

interface ResetButtonProps {
  onClick: () => void;
}

function ResetButton(props: ResetButtonProps) {
  const classNames = 'button resetButton';
  return (
    <div className={classNames} onClick={props.onClick}>
      Reset
    </div>
  );
}

interface EvidenceButtonProps {
  name: string;
  state: string;
  onClick: () => void;
}

function EvidenceButton(props: EvidenceButtonProps) {
  const classNames = 'evidenceButton button ' + props.state;
  return (
    <li
      className={classNames}
      onClick={props.onClick}
      data-testid="evidence-button"
    >
      {props.name}
    </li>
  );
}

interface ObservationListProps {
  observed_evidence: Map<string, string>;
  handleEvidenceClick: (evidence: string) => void;
  handleResetClick: () => void;
}

interface ObservationListState {
  observed_evidence: Map<string, string>;
}

class ObservationList extends React.Component<
  ObservationListProps,
  ObservationListState
> {
  constructor(props: ObservationListProps) {
    super(props);
    this.state = {
      observed_evidence: props.observed_evidence,
    };
  }

  renderEvidenceButton = (value: [string, string]) => {
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
  };

  render() {
    return (
      <section className="observations">
        <h1>My observations</h1>
        <ul className="observationList">
          {Array.from(this.state.observed_evidence.entries()).map(
            this.renderEvidenceButton
          )}
        </ul>
        <ResetButton onClick={() => this.props.handleResetClick()} />
      </section>
    );
  }
}

export default ObservationList;
