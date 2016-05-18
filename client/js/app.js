import React from 'react';
import ReactDOM from 'react-dom';

var HelloWorld = React.createClass({
    render: function() {
            return (<div>Hello, world!</div>);
        }
});

ReactDOM.render(React.createElement(HelloWorld), document.getElementById('root'));
