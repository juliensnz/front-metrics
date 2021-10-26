import {Switch, Route, HashRouter} from 'react-router-dom';
import {NodeReport} from './components/NodeReport';
import {useReport} from './hooks/useReport';

const App = () => {
  const [report, reportName, reportNames, reports, handleReportChange] = useReport();

  if (null === report) {
    return <div>Loading</div>;
  }

  return (
    <HashRouter>
      <Switch>
        <Route exact path="/:path+/">
          <NodeReport report={report} reportNames={reportNames} reports={reports} reportName={reportName} onReportChange={handleReportChange} />
        </Route>
        <Route exact path="/">
          <NodeReport report={report} reportNames={reportNames} reports={reports} reportName={reportName} onReportChange={handleReportChange} />
        </Route>
      </Switch>
    </HashRouter>
  );
};

export default App;
