import React from 'react';
import ReactDOM from 'react-dom';

import Ghost, { evidence } from './ghost';
import data from './ghost_data.json';

class Ghostbook extends React.Component {
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
            this.read_ghost_data()
        );
    }

}

// === Run the app ===
ReactDOM.render(
    <Ghostbook />,
    document.getElementById('root')
);
