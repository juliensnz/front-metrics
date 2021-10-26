import React from "react";
import {ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis} from 'recharts';
import {getNodeReportFromPath, Report, ReportMetric} from "../model/Report";
import {SectionTitle} from "akeneo-design-system";
import styled from "styled-components";

const NodeChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

type NodeChartProps = {
  reports: Report[];
  path: string;
  metric: keyof ReportMetric;
};

const computeData = (reports: Report[], path: string, metric: keyof ReportMetric) => {
  return reports.map((report) => {
    const nodeReport = getNodeReportFromPath(report, path);

    return {
      value: nodeReport.metrics[metric],
      time: report.creationDate,
    };
  });
}

const NodeChart = ({reports, path, metric}: NodeChartProps) => {
  const computedData = computeData(reports, path, metric);

  return (
    <NodeChartContainer>
      <SectionTitle>
        <SectionTitle.Title>{metric}</SectionTitle.Title>
      </SectionTitle>
      <ResponsiveContainer width='95%' height={200} >
        <ScatterChart>
          <XAxis
            dataKey='time'
            domain={['auto', 'auto']}
            name='Time'
            tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString('en-US')}
            type='number'
          />
          <YAxis dataKey='value' name='Value' />
          <Tooltip />
          <Scatter
            data={computedData}
            line={{stroke: '#8884d8'}}
            lineType='joint'
            name='Values'
          />

        </ScatterChart>
      </ResponsiveContainer>
    </NodeChartContainer>
)
};

export {NodeChart};
