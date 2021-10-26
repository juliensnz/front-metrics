#!/usr/bin/env node
import yargs from 'yargs';
import fetch from 'node-fetch';
import fs from 'fs';
import {computeReport} from '../src/cli/computeReport.js';

const {_: commandName, folderToAnalyze, reportName, $0: binaryPath} = yargs
  .command('report:generate [folderToAnalyze] [reportName]', 'Generate a new report to be anlyzed', yargs => {
    yargs.positional('folderToAnalyze', {
      describe: 'The folder you want to analyze',
      require: true,
    }).positional('reportName', {
      describe: 'The report name you want',
      default: 'report',
      require: false,
    });
  })
  .check((argv) => {
    switch (argv._[0]) {
      case 'report:generate':
        if (undefined === argv.folderToAnalyze) {
          throw new Error('The folderToAnalyze argument is required');
        }

        if (!fs.existsSync(argv.folderToAnalyze)) {
          throw new Error(`Folder "${argv.folderToAnalyze}" does not exists`);
        }
        break;
      default:
        break;
    }

    return true;
  })
  .help('h')
  .alias('h', 'help')
  .demandCommand(2).argv;


const aggregateReports = (path) => {
  const files = fs.readdirSync(path);

  const aggregatedReports = files.filter(path => path.includes('.json')).map(file => {
    const fileContent = fs.readFileSync(`${path}${file}`);
    const report = JSON.parse(fileContent);

    delete report.children;

    return report;
  });

  fs.writeFileSync(`${path}../reports.json`, JSON.stringify(aggregatedReports));
}


(async () => {
  try {
    switch (commandName[0]) {
      case 'report:generate':
        if (process.env.CI === 'true') {
          const response = await fetch('https://api.github.com/repos/juliensnz/front-metrics/contents/reports?ref=gh-pages');
          const reportResponse = await response.json();

          const reportFiles = reportResponse.filter((report) => !['.gitkeep', 'reports.json'].includes(report.name));
          await Promise.all(reportFiles.map(async (reportFile) => {
            const reportContent = await fetch(reportFile.download_url);

            fs.writeFileSync(`./public/reports/${reportFile.name}`, await reportContent.text());
          }));
        }

        const report = computeReport(folderToAnalyze, reportName);
        fs.writeFileSync(`./public/reports/${reportName}.json`, JSON.stringify(report))

        aggregateReports('./public/reports/');

        break;

      default:
        console.error(`Command "${commandName[0]}" does not exist`)
        break;
    }
  } catch (e) {
    console.error(e);
  }
})();
