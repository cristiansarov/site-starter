import 'babel-polyfill';
import App from 'core/config/app';
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

// render the app
axios.get('/api/config/getData').then(response=>{
  ReactDOM.render(<App initialData={response.data} />, document.getElementById('app'));
});