import React from 'react';
import ReactDOM from 'react-dom/client';
import RootElement from './routes';
import '../src/assets/scss/styles.scss';
import 'material-icons/iconfont/material-icons.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RootElement />);