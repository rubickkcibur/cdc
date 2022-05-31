import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import Report from "./Report";
import Overview from "./Overview";

function App() {
  return (
    <div className="App">
      <Router>
      <Switch>
        <Route path="/report">
          <Report />
        </Route>
        <Route path="/overview">
          <Overview />
        </Route>
      </Switch>
      </Router>

      
    </div>
  );
}

export default App;
