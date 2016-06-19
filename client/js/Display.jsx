import React, { Component } from 'react';
import {observer} from 'mobx-react';
import AceEditor from 'react-ace';

class Display extends Component {
    render() {
        return (
            <AceEditor
                name="Equation"
                maxLines={1}
                highlightActiveLine={false}
                showGutter={false}
                enableLiveAutocompletion={true}
                width="100%"
            />
        )
    }
}

export default Display;


