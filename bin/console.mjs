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

(async () => {
  try {
    switch (commandName[0]) {
      case 'report:generate':
        const report = computeReport(folderToAnalyze);
        fs.writeFileSync(`./public/reports/${reportName}.json`, JSON.stringify(report))
        if (true) {
//      if (process.env.CI === 'true') {
          const response = await fetch('https://api.github.com/repos/juliensnz/front-metrics/contents/reports?ref=gh-pages');
          const reportResponse = await response.json();

          const reportFiles = reportResponse.filter((report) => !['.gitkeep', 'reports.json'].includes(report.name));
          await Promise.all(reportFiles.map(async (reportFile) => {
            const reportContent = await fetch(reportFile.download_url);

            fs.writeFileSync(`./public/reports/${reportFile.name}`, await reportContent.text());
          }));
        }

          // Aggregé les données dans reports.json
          //date +%F
        const files = fs.readdirSync('./public/reports/');
        fs.writeFileSync(`./public/reports/reports.json`, JSON.stringify(
          files.filter(path => path.includes('.json') && path !== 'reports.json')
            .map(path => path.replace('.json', ''))
          ))
        break;

      default:
        console.error(`Command "${commandName[0]}" does not exist`)
        break;
    }
  } catch (e) {
    console.error(e);
  }
})();
