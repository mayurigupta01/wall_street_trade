import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import store from "./redux/store";
import { Provider } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

ReactDOM.render(
  
  <React.StrictMode>
    <Router><App /></Router>   
  </React.StrictMode>,
  document.getElementById('root')
);