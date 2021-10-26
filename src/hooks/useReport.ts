import {useEffect, useState} from 'react';
import {Report} from '../model/Report';

const useReport = () => {
  const [currentReportName, setCurrentReportName] = useState<string | null>(null);
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [reportNames, setReportNames] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const response = await fetch('./reports/reports.json');
      const reportNames = await response.json();

      setReportNames(reportNames);
      setCurrentReportName(reportNames[0]);
    })();
  }, []);

  useEffect(() => {
    if (!currentReportName) return;

    (async () => {
      const response = await fetch(`./reports/${currentReportName}.json`);

      setCurrentReport(await response.json());
    })();
  }, [currentReportName]);


  useEffect(() => {
    if (0 === reportNames.length) return;

    (async () => {
      const reports = await Promise.all<Report>(reportNames.map(reportName =>
        fetch(`./reports/${reportName}.json`).then(resp => resp.json())
      ));

      setReports(reports);
    })();
  }, [reportNames]);

  return [currentReport, currentReportName, reportNames, reports, setCurrentReportName] as const;
};

export {useReport};
