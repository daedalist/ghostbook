import React from 'react';
import ReactDOM from 'react-dom';

import Ghost, { evidence } from './ghost';

class Ghostbook extends React.Component {
    render() {
        return (
            <Ghost
                name='Demon'
                evidence_list={[evidence.GHOST_WRITING, evidence.SPIRIT_BOX, evidence.FREEZING]}
            />
        );
    }

}

// === Run the app ===
ReactDOM.render(
    <Ghostbook />,
    document.getElementById('root')
);
