import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import login from './components/auth/Login';
import register from './components/auth/Register';
import store from './store';
import Alert from './components/layout/Alert';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path='/' component={Landing} />
          <div className='container'>
            <Alert />
            <Switch>
              <Route exact path='/register' component={register} />
              <Route exact path='/login' component={login} />
            </Switch>
          </div>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
