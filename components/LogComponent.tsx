import Ansi from 'ansi-to-react';
import React from 'react';

export default props => (
    <div style={{ backgroundColor: '#1e1e1e', color: 'white', width: '100%', padding: 8 }}>
        {props.log.map((logLine, index) => (
            <div key={index} style={{ marginLeft: 8 }}>
                <Ansi>{logLine}</Ansi>
            </div>
        ))}
    </div>
    /* <h4 dangerouslySetInnerHTML={{ __html: props.log.split('\n').join('<br/>') }}></h4> */
);
