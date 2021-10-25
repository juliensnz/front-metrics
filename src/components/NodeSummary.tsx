import {Badge} from 'akeneo-design-system';
import {Report} from "../model/Report";
import styled from "styled-components";

const NodeSummaryContainer = styled.div`
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
`;

type NodeSummaryProps = {
  report: Report;
};

const NodeSummary = ({report}: NodeSummaryProps) => {
  const percentFormatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
  });

  return (
    <NodeSummaryContainer>
      <span>Typescript ratio: <Badge>{percentFormatter.format(report.metrics.typescript / (report.metrics.javascript + report.metrics.typescript))}</Badge></span>
      <span>Require in typescript: <Badge>{report.metrics.requireInTypescript}</Badge></span>
      <span>Number of legacy files: <Badge>{report.metrics.defineInJavascript}</Badge></span>
      <span>React classes: <Badge>{report.metrics.reactClassComponent}</Badge></span>
      <span>BEM in typescript: <Badge>{report.metrics.bemInTypescript}</Badge></span>
      <span>Legacy bridges: <Badge>{report.metrics.reactController}</Badge></span>
      <span>Backbone controllers: <Badge>{report.metrics.backboneController}</Badge></span>
    </NodeSummaryContainer>
  );
};

export {NodeSummary};
