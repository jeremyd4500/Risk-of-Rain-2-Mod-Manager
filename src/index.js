import React from 'react';
import ReactDOM from 'react-dom';
import Main from './react/Main';
import * as serviceWorker from './serviceWorker';
import { modHandler } from './api/modHandler';

import './styles/index.css';

const fsAPI = new modHandler();
fsAPI.start();

ReactDOM.render(<Main />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
