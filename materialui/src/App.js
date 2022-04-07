import './App.css';
import Home from "./components/home/Home";
import React from "react";
import Login from "./components/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import Bot from './components/bot/Bot';

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newUser: true,
    };
  }

  render() {
  return (
    <div>
    <Bot />
    <Router>
      <Routes>
        <Route path="/" caseSensitive={false} element={<Login />} />
        <Route path="/login" caseSensitive={false} element={<Login />} />
        <Route path="/home" caseSensitive={false} element={<Home />} />
      </Routes>
    </Router>
    </div>
  );
}
}

export default App;