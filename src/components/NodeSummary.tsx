import {
  ActivityIcon,
  AkeneoThemedProps,
  AssociateIcon,
  AttributeLinkIcon,
  ComponentIcon,
  EntityMultiIcon,
  FactoryIcon,
  getColorForLevel,
  IconCard,
  Level,
  RefreshIcon,
} from 'akeneo-design-system';
import {NodeReport} from '../model/Report';
import styled from 'styled-components';
import {getLevelForRatio} from './ColorCell';

const NodeSummaryContainer = styled.div`
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
`;

const ColoredIconCard = styled(IconCard)<{color: [Level, number]} & AkeneoThemedProps>`
  & > div:nth-child(2) > div:nth-child(1),
  svg {
    color: ${({color: [level, gradient]}) => getColorForLevel(level, gradient + 40)};
  }
`;

type NodeSummaryProps = {
  nodeReport: NodeReport;
};

const NodeSummary = ({nodeReport}: NodeSummaryProps) => {
  const percentFormatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
  });

  return (
    <NodeSummaryContainer>
      <ColoredIconCard
        color={getLevelForRatio(nodeReport.metrics.typescript / (nodeReport.metrics.javascript + nodeReport.metrics.typescript))}
        label={percentFormatter.format(
          nodeReport.metrics.typescript / (nodeReport.metrics.javascript + nodeReport.metrics.typescript)
        )}
        icon={<ActivityIcon />}
        content="Typescript ratio"
      />
      <ColoredIconCard
        color={getLevelForRatio(
          nodeReport.metrics.typescriptLOC / (nodeReport.metrics.javascriptLOC + nodeReport.metrics.typescriptLOC)
        )}
        label={nodeReport.metrics.requireInTypescript.toString()}
        icon={<AttributeLinkIcon />}
        content="Require in typescript"
      />
      <ColoredIconCard
        color={[0 < nodeReport.metrics.requireInTypescript ? 'danger' : 'primary', 60]}
        label={nodeReport.metrics.defineInJavascript.toString()}
        icon={<AssociateIcon />}
        content="Number of legacy files"
      />
      <ColoredIconCard
        color={[0 < nodeReport.metrics.requireInTypescript ? 'danger' : 'primary', 60]}
        label={nodeReport.metrics.reactClassComponent.toString()}
        icon={<RefreshIcon />}
        content="React classes"
      />
      <ColoredIconCard
        color={[0 < nodeReport.metrics.bemInTypescript ? 'danger' : 'primary', 60]}
        label={nodeReport.metrics.bemInTypescript.toString()}
        icon={<EntityMultiIcon />}
        content="BEM in typescript"
      />
      <ColoredIconCard
        color={[0 < nodeReport.metrics.reactController ? 'danger' : 'primary', 60]}
        label={nodeReport.metrics.reactController.toString()}
        icon={<FactoryIcon />}
        content="Legacy bridges"
      />
      <ColoredIconCard
        color={[0 < nodeReport.metrics.backboneController ? 'danger' : 'primary', 60]}
        label={nodeReport.metrics.backboneController.toString()}
        icon={<ComponentIcon />}
        content="Backbone controllers"
      />
    </NodeSummaryContainer>
  );
};

export {NodeSummary};
