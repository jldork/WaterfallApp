import React from 'react';
import Header from './Header.jsx';
import Upload from './Upload.jsx';
import { render } from 'react-dom';

render(
    <div>
        <Header/>
        <Upload/>
    </div>
    , document.getElementById('root')
);