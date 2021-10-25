import {
  AkeneoThemedProps,
  Badge,
  Breadcrumb,
  CopyIcon,
  FileIcon,
  FolderIcon,
  getColorForLevel,
  IconButton,
  Level,
  Table,
} from 'akeneo-design-system';
import {Link, useRouteMatch} from 'react-router-dom';
import styled from 'styled-components';
import {getReportFromFolder, Report, ReportMetric} from '../model/Report';
import {NodeSummary} from './NodeSummary';
import {useMemo} from 'react';
import {useStorageState} from '../hooks/useStorageState';

const canCopyToClipboard = (): boolean => 'clipboard' in navigator;

const copyToClipboard = (text: string) => canCopyToClipboard() && navigator.clipboard.writeText(text);

const getLevelForRatio = (ratio: number): [Level, number] => {
  if (ratio < 0.4) return ['danger', 40];
  if (ratio < 0.6) return ['danger', 20];
  if (ratio < 0.8) return ['warning', 40];
  if (ratio < 0.95) return ['warning', 20];
  if (ratio < 1) return ['primary', 20];

  return ['primary', 40];
};

const ColoredCell = styled(Table.Cell)<{color: [Level, number]} & AkeneoThemedProps>`
  background-color: ${({color: [level, gradient]}) => getColorForLevel(level, gradient)};
`;

const SpacedCell = styled(Table.Cell)`
  & > div {
    display: flex;
    justify-content: space-between;
  }
`;

const Spacer = styled.div`
  flex: 1;
`;

type NodeReportProps = {
  report: Report;
};

type SortDirection = 'none' | 'ascending' | 'descending';

const NodeReport = ({report}: NodeReportProps) => {
  const {url} = useRouteMatch();
  const folders = url.split('/').slice(1);
  const currentNode = getReportFromFolder(report, folders);
  const [sortedColumn, setSortedColumn] = useStorageState<{
    columnName: keyof ReportMetric | null;
    sortDirection: SortDirection;
  }>(
    {
      columnName: null,
      sortDirection: 'none',
    },
    'sort_state'
  );

  const computeDirection = (columnName: string) => {
    if (columnName !== sortedColumn.columnName) {
      return 'none';
    }

    return sortedColumn.sortDirection;
  };

  const handleDirectionChange = (columnName: keyof ReportMetric) => (sortDirection: SortDirection) => {
    setSortedColumn({
      columnName: columnName,
      sortDirection: sortDirection,
    });
  };

  const sortChildren = (children: Report[], columnName: keyof ReportMetric | null, direction: SortDirection) => {
    if (columnName === null) {
      return children;
    }

    return [...children].sort((a, b) => {
      return direction === 'ascending'
        ? a.metrics[columnName] - b.metrics[columnName]
        : b.metrics[columnName] - a.metrics[columnName];
    });
  };

  const sortedChildren = useMemo(
    () =>
      sortChildren(
        Object.values('file' === currentNode.type ? [] : currentNode.children),
        sortedColumn.columnName,
        sortedColumn.sortDirection
      ),
    [sortedColumn, currentNode]
  );

  if ('file' === currentNode.type) {
    return null;
  }

  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Step href="#/">Root</Breadcrumb.Step>
        {folders.map(name => (
          <Breadcrumb.Step key={name} href={`#${url.substring(0, url.indexOf(name))}${name}`}>
            {name}
          </Breadcrumb.Step>
        ))}
      </Breadcrumb>
      <NodeSummary report={currentNode} />
      <Table>
        <Table.Header sticky={0}>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Typescript ratio</Table.HeaderCell>
          <Table.HeaderCell
            isSortable={true}
            onDirectionChange={handleDirectionChange('requireInTypescript')}
            sortDirection={computeDirection('requireInTypescript')}
          >
            Require in typescript
          </Table.HeaderCell>
          <Table.HeaderCell
            isSortable={true}
            onDirectionChange={handleDirectionChange('defineInJavascript')}
            sortDirection={computeDirection('defineInJavascript')}
          >
            Number of legacy files
          </Table.HeaderCell>
          <Table.HeaderCell
            isSortable={true}
            onDirectionChange={handleDirectionChange('reactClassComponent')}
            sortDirection={computeDirection('reactClassComponent')}
          >
            React classes
          </Table.HeaderCell>
          <Table.HeaderCell
            isSortable={true}
            onDirectionChange={handleDirectionChange('bemInTypescript')}
            sortDirection={computeDirection('bemInTypescript')}
          >
            BEM in typescript
          </Table.HeaderCell>
          <Table.HeaderCell
            isSortable={true}
            onDirectionChange={handleDirectionChange('reactController')}
            sortDirection={computeDirection('reactController')}
          >
            Legacy bridges
          </Table.HeaderCell>
          <Table.HeaderCell
            isSortable={true}
            onDirectionChange={handleDirectionChange('backboneController')}
            sortDirection={computeDirection('backboneController')}
          >
            Backbone controllers
          </Table.HeaderCell>
        </Table.Header>
        <Table.Body>
          {sortedChildren.map(child => {
            const childUrl = '/' === url ? `/${child.name}` : `${url}/${child.name}`;
            const percentFormatter = new Intl.NumberFormat('en-US', {
              style: 'percent',
              minimumFractionDigits: 2,
            });

            return (
              <Table.Row key={child.name}>
                <SpacedCell>
                  {'file' === child.type ? <FileIcon size={20} /> : <FolderIcon size={20} />}&nbsp;&nbsp;
                  {'file' === child.type ? child.name : <Link to={childUrl}>{child.name}</Link>}
                  <IconButton
                    size="small"
                    ghost="borderless"
                    level="tertiary"
                    icon={<CopyIcon />}
                    title="Copy to clipboard"
                    onClick={() => copyToClipboard(child.path)}
                  />
                  <Spacer />
                  {'directory' === child.type && <Badge>{child.metrics.javascript + child.metrics.typescript}</Badge>}
                </SpacedCell>
                <ColoredCell
                  color={getLevelForRatio(
                    child.metrics.typescript / (child.metrics.javascript + child.metrics.typescript)
                  )}
                  title={`${child.metrics.typescript} / ${child.metrics.javascript + child.metrics.typescript}`}
                >
                  {percentFormatter.format(
                    child.metrics.typescript / (child.metrics.javascript + child.metrics.typescript)
                  )}{' '}
                  ({child.metrics.javascript} javascript files)
                </ColoredCell>
                <ColoredCell color={[0 < child.metrics.requireInTypescript ? 'danger' : 'primary', 40]}>
                  {child.metrics.requireInTypescript}
                </ColoredCell>
                <Table.Cell>{child.metrics.defineInJavascript}</Table.Cell>
                <ColoredCell color={[0 < child.metrics.reactClassComponent ? 'danger' : 'primary', 40]}>
                  {child.metrics.reactClassComponent}
                </ColoredCell>
                <ColoredCell color={[0 < child.metrics.bemInTypescript ? 'danger' : 'primary', 40]}>
                  {child.metrics.bemInTypescript}
                </ColoredCell>
                <Table.Cell>{child.metrics.reactController}</Table.Cell>
                <Table.Cell>{child.metrics.backboneController}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </>
  );
};

export {NodeReport};
