import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import {NodeReport} from './components/NodeReport';

const report = require('./reports/report.json');

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/:path+/">
          <NodeReport report={report} />
        </Route>
        <Route exact path="/">
          <NodeReport report={report} />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
