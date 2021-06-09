import './App.css';
import React from 'react';
import { InitiativeList } from './components/InitiativeList';
import { LoginHandler } from './components/LoginHandler';
import { LogoutHandler } from './components/LogoutHandler';
import { Router, Switch, Route } from "react-router";
import { createBrowserHistory } from "history";
import { ConfirmProvider } from 'material-ui-confirm';
import { Alert } from "./components/alerts";
import { SessionContext } from './components/context'


const history = createBrowserHistory();

function App() {
  const [state, setState] = React.useState({
    alert: {
      display: false,
      severity: 0,
      msg: ''
    }
  })

  const _alert = (severity, msg) => {
    setState({
      alert: {
        display: true,
        severity: severity,
        msg: msg,
      },
    });
  }

  const _closeAlert = () => {
    setState({
      alert: {
        display: false,
        severity: 0,
        msg: ''
      }
    });
  };

  history.location.state = {
    alert: _alert
  }

  return (
      <SessionContext.Provider value={{alert: _alert}}>
        <ConfirmProvider>
          {state.alert.display &&
              Alert(
                state.alert.severity,
                state.alert.msg,
                _closeAlert
          )}
          <Router history={history} >
            <Switch>
              <Route path="/login" component={LoginHandler} />
              <Route path="/logout" component={LogoutHandler} />
              <Route path="*" component={InitiativeList} />
            </Switch>
          </Router>
        </ConfirmProvider>
      </SessionContext.Provider>
  );
}

export default App;
