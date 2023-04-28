import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter as Router} from 'react-router-dom'

import "./index.css";

import App from './App';
import reportWebVitals from './reportWebVitals';
import { StateProvider } from './context/StateProvider';
import { initialState } from './context/initialState';
import reducer from './context/reducer';
import { ThemeProvider } from "@material-tailwind/react";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <Router>
          <StateProvider initialState={initialState} reducer={reducer}>
            <ThemeProvider>
            <App />
            </ThemeProvider>
          </StateProvider>
        </Router>
    </React.StrictMode>
  );

reportWebVitals();