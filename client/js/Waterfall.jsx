import React, { Component } from 'react';
import Header from './Header.jsx';
import Upload from './Upload.jsx';
import { render } from 'react-dom';
import {observer} from 'mobx-react';
import WaterfallStore from './WaterfallStore';
import Display from './Display.jsx';

const waterfallStore = new WaterfallStore();

@observer
class Waterfall extends Component {
    render() {
        var Body = waterfallStore.uploaded ? <Display/> : <Upload wfStore={waterfallStore}/>;
        return (
            <div>
                <Header/>
                {Body}
            </div>
        )
    }
}

render(<Waterfall />, document.getElementById('root'));