import './App.css';
import { InitiativeList } from './components/InitiativeList';
import { LoginHandler } from './components/LoginHandler';
import { LogoutHandler } from './components/LogoutHandler';
import { Router, Switch, Route } from "react-router";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

function App() {
  return (
      <Router history={history}>
        <Switch>
          <Route path="/login" component={LoginHandler} />
          <Route path="/logout" component={LogoutHandler} />
          <Route path="*" component={InitiativeList} />
        </Switch>
      </Router>
  );
}

export default App;
