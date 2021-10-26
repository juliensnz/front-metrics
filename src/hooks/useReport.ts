import {useEffect, useState} from 'react';
import {ReportRoot} from '../model/Report';

const useReport = () => {
  const [currentReportName, setCurrentReportName] = useState<string | null>(null);
  const [currentReport, setCurrentReport] = useState<ReportRoot | null>(null);
  const [reports, setReports] = useState<ReportRoot[]>([]);

  useEffect(() => {
    (async () => {
      const response = await fetch('./reports.json');
      const reports = await response.json();

      setReports(reports);
      setCurrentReportName(reports[0].reportName);
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
