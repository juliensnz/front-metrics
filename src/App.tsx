import {Switch, Route, HashRouter} from 'react-router-dom';
import {NodeReport} from './components/NodeReport';

const report = require('./reports/report.json');

const App = () => {
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/:path+/">
          <NodeReport report={report} />
        </Route>
        <Route exact path="/">
          <NodeReport report={report} />
        </Route>
      </Switch>
    </HashRouter>
  );
};

export default App;
