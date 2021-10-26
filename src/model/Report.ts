type ReportMetric = {
  typescript: number;
  typescriptLOC: number;
  javascript: number;
  javascriptLOC: number;
  requireInJavascript: number;
  requireInTypescript: number;
  defineInJavascript: number;
  reactClassComponent: number;
  bemInTypescript: number;
  reactController: number;
  backboneController: number;
};

type NodeReport = {
    directoryPath: string;
    path: string;
    name: string;
    metrics: ReportMetric;
  } & (
  | {
    type: 'directory';
    children: {
      [key: string]: NodeReport;
    };
  } | {
    type: 'file';
  }
);

type Report = {
  creationDate: number;
  nodeReport: NodeReport;
};

const getNodeReportFromPath = (report: Report, path: string): NodeReport => {
  const folders = path.split('/');

  return getReportFromFolder(report.nodeReport, folders);
}

const getReportFromFolder = (report: NodeReport, folders: string[]): NodeReport => {
  if (0 === folders.length || folders.every(folder => folder === '')) {
    return report;
  }

  const [currentFolder, ...otherFolders] = folders;
  if ('file' === report.type || undefined === currentFolder) {
    return report;
  }

  return getReportFromFolder(report.children[currentFolder], otherFolders);
};

export {getNodeReportFromPath, getReportFromFolder};
export type {Report, NodeReport, ReportMetric};
