import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header.jsx';
import Upload from './Upload.jsx';

var Waterfall = React.createClass({
    render: function () {
        return (
            <div>
                <Header/>
                <Upload/>
            </div>
        );
    }
});

ReactDOM.render(React.createElement(Waterfall), document.getElementById('root'));
