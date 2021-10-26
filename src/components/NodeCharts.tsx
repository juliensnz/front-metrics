import React from "react";
import {Report, ReportMetric} from "../model/Report";
import {NodeChart} from "./NodeChart";
import styled from "styled-components";

const NodeChartsContainer = styled.div`
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px;
`;

type NodeChartsProps = {
  reports: Report[];
  path: string;
};

const NodeCharts = ({reports, path}: NodeChartsProps) => {
  const metrics: (keyof ReportMetric)[] = [
    'typescriptLOC',
    'javascriptLOC',
    'requireInJavascript',
    'requireInTypescript',
    'defineInJavascript',
    'reactClassComponent',
    'bemInTypescript',
    'reactController',
    'backboneController',
  ];

  return (
    <NodeChartsContainer>
      {metrics.map((metric) => (
        <NodeChart metric={metric} reports={reports} path={path} key={metric}/>
      ))}
    </NodeChartsContainer>
  )
};

export {NodeCharts};
