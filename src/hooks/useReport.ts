import {useEffect, useState} from 'react';
import {Report} from '../model/Report';

const useReport = () => {
  const [currentReportName, setCurrentReportName] = useState<string | null>(null);
  const [currentReport, setCurrentReport] = useState<Report | null>(null);
  const [reports, setReports] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const response = await fetch('./reports/reports.json');
      const reports = await response.json();

      setReports(reports);
      setCurrentReportName(reports[0]);
    })();
  }, []);

  useEffect(() => {
    if (!currentReportName) return;

    (async () => {
      const response = await fetch(`./reports/${currentReportName}.json`);

      setCurrentReport(await response.json());
    })();
  }, [currentReportName]);

  return [currentReport, currentReportName, reports, setCurrentReportName] as const;
};

export {useReport};
