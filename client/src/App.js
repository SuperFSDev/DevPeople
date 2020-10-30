import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import login from './components/auth/Login';
import register from './components/auth/Register';

const App = () => {
  return (
    <Router>
      <Fragment>
        <Navbar />
        <Route exact path="/" component={Landing} />
        <div className="container">
          <Switch>
            <Route exact path="/register" component={register} />
            <Route exact path="/login" component={login} />
          </Switch>
        </div>
      </Fragment>
    </Router>
  );
};

export default App;
