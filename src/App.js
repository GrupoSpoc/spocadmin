import './App.css';
import { InitiativeList } from './components/InitiativeList';
import { LoginHandler } from './components/LoginHandler';
import { LogoutHandler } from './components/LogoutHandler';
import { Router, Switch, Route } from "react-router";
import { createBrowserHistory } from "history";
import { ConfirmProvider } from 'material-ui-confirm';

const history = createBrowserHistory();

function App() {
  return (
    
      <ConfirmProvider>
        <Router history={history}>
          <Switch>
            <Route path="/login" component={LoginHandler} />
            <Route path="/logout" component={LogoutHandler} />
            <Route path="*" component={InitiativeList} />
          </Switch>
        </Router>
      </ConfirmProvider>
  );
}

export default App;
