import React from 'react';
import {
  Router,
  Switch,
  Route,
} from "react-router-dom";
import Login from "./components/pages/login";
import Index from './components/pages';
import { NotFound } from "./components/pages/notfound";
import { PrivateRoute } from "./components/privateroute";
import './style.css';
import history from "./components/history";
import { SelectPatient } from "./components/pages/select-patient";
import { Prescriptions } from "./components/pages/prescriptions";
import { Patient } from "./components/pages/patient";
import { Visits } from "./components/pages/visits";
import { Devices } from "./components/pages/devices";
import { Institution } from "./components/pages/institution";
import { Employee } from "./components/pages/employee";
import { Help } from "./components/pages/help";
import { Settings } from "./components/pages/settings";
import { authentication } from "./components/authentication";
import { Config } from "./config";

class App extends React.Component {
  refreshToken = () => {
    if (authentication.currentUserValue) {
      const token = JSON.parse(localStorage.getItem('currentUser')).token;
      const refresh_token = JSON.parse(localStorage.getItem('currentUser')).refresh_token;

      return fetch(`${Config.url}user/refresh_token`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ 'token': token, 'refresh_token': refresh_token }) })
          .then(authentication.handleResponse)
          .then((data) => {
            console.log('Refreshing token...');
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            currentUser.token = data.new_token;
            currentUser.refresh_token = data.new_refresh_token;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
          });
    }
  };

  componentDidMount() {
    this.timer = setInterval(() => this.refreshToken(),300000);
  };

  render() {
    return (
        <div className="App">
          <Router history={history}>
            <Switch>
              <PrivateRoute exact path="/" component={Index}/>
              <PrivateRoute exact path="/select-patient" component={SelectPatient}/>
              <PrivateRoute exact path="/prescriptions" component={Prescriptions}/>
              <PrivateRoute exact path="/patient" component={Patient}/>
              <PrivateRoute exact path="/visits" component={Visits}/>
              <PrivateRoute exact path="/devices" component={Devices}/>
              <PrivateRoute exact path="/institution" component={Institution}/>
              <PrivateRoute exact path="/employee" component={Employee}/>
              <PrivateRoute exact path="/help" component={Help}/>
              <PrivateRoute exact path="/settings" component={Settings}/>
              <Route path="/login" component={Login}/>
              <Route path="*" component={NotFound}/>
            </Switch>
          </Router>
        </div>
    );
  }
}

export default App;
