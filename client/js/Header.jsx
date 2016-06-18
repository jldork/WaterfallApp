import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone';

class Header extends Component {
    render() {
        return (
            <div class="header">
                <h1 class="title">Waterfall Chart Generator</h1>
                <h2 class="tagline">A way to visualize simple equations</h2>
                <a href="https://github.com/jldork/WaterfallApp" class="btn">Check it out on Github</a>
            </div>
        );
    }
}

export default Header;





