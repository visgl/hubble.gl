import React from 'react';
import {render} from 'react-dom';
import App from './app';

document.body.style.height = '100vh';
document.body.style.margin = '0';
const root = document.body.appendChild(document.createElement('div'));
root.style.height = '100%';

render(<App />, root);
