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
import {Report} from '../model/Report';
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
  report: Report;
};

const NodeSummary = ({report}: NodeSummaryProps) => {
  const percentFormatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
  });

  return (
    <NodeSummaryContainer>
      <ColoredIconCard
        color={getLevelForRatio(report.metrics.typescript / (report.metrics.javascript + report.metrics.typescript))}
        label={percentFormatter.format(
          report.metrics.typescript / (report.metrics.javascript + report.metrics.typescript)
        )}
        icon={<ActivityIcon />}
        content="Typescript ratio"
      />
      <ColoredIconCard
        color={getLevelForRatio(
          report.metrics.typescriptLOC / (report.metrics.javascriptLOC + report.metrics.typescriptLOC)
        )}
        label={report.metrics.requireInTypescript.toString()}
        icon={<AttributeLinkIcon />}
        content="Require in typescript"
      />
      <ColoredIconCard
        color={[0 < report.metrics.requireInTypescript ? 'danger' : 'primary', 60]}
        label={report.metrics.defineInJavascript.toString()}
        icon={<AssociateIcon />}
        content="Number of legacy files"
      />
      <ColoredIconCard
        color={[0 < report.metrics.requireInTypescript ? 'danger' : 'primary', 60]}
        label={report.metrics.reactClassComponent.toString()}
        icon={<RefreshIcon />}
        content="React classes"
      />
      <ColoredIconCard
        color={[0 < report.metrics.bemInTypescript ? 'danger' : 'primary', 60]}
        label={report.metrics.bemInTypescript.toString()}
        icon={<EntityMultiIcon />}
        content="BEM in typescript"
      />
      <ColoredIconCard
        color={[0 < report.metrics.reactController ? 'danger' : 'primary', 60]}
        label={report.metrics.reactController.toString()}
        icon={<FactoryIcon />}
        content="Legacy bridges"
      />
      <ColoredIconCard
        color={[0 < report.metrics.backboneController ? 'danger' : 'primary', 60]}
        label={report.metrics.backboneController.toString()}
        icon={<ComponentIcon />}
        content="Backbone controllers"
      />
    </NodeSummaryContainer>
  );
};

export {NodeSummary};
