import {
  Badge,
  Breadcrumb,
  CopyIcon,
  Dropdown,
  FileIcon,
  FolderIcon,
  IconButton,
  SwitcherButton,
  Table,
  useBooleanState,
} from 'akeneo-design-system';
import {Link, useRouteMatch} from 'react-router-dom';
import styled from 'styled-components';
import {getNodeReportFromPath, Report} from '../model/Report';
import {NodeSummary} from './NodeSummary';
import {ColoredCell, getLevelForRatio} from './ColorCell';
import {useSortedChildren} from '../hooks/useSortedChildren';
import {NodeCharts} from "./NodeCharts";

const Header = styled.div`
  display: flex;
`;

const canCopyToClipboard = (): boolean => 'clipboard' in navigator;

const copyToClipboard = (text: string) => canCopyToClipboard() && navigator.clipboard.writeText(text);

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
  reportName: string | null;
  reports: Report[];
  reportNames: string[];
  onReportChange: (newReport: string) => void;
};

const NodeReport = ({report, reportName, reports, reportNames, onReportChange}: NodeReportProps) => {
  const {url} = useRouteMatch();
  const path = url.substring(1);
  const folders = path.split('/');
  const currentNode = getNodeReportFromPath(report, path);
  const [sortedChildren, computeDirection, handleDirectionChange] = useSortedChildren(
    'file' === currentNode.type ? [] : Object.values(currentNode.children)
  );
  const [isDropdownOpen, openDropdown, closeDropdown] = useBooleanState();

  if ('file' === currentNode.type) {
    return null;
  }

  return (
    <>
      <Header>
        <Breadcrumb>
          <Breadcrumb.Step href="#/">Root</Breadcrumb.Step>
          {folders.map(name => (
            <Breadcrumb.Step key={name} href={`#${url.substring(0, url.indexOf(name))}${name}`}>
              {name}
            </Breadcrumb.Step>
          ))}
        </Breadcrumb>
        <Spacer />
        <Dropdown>
          <SwitcherButton label="Report" onClick={openDropdown}>
            {reportName}
          </SwitcherButton>
          {isDropdownOpen && (
            <Dropdown.Overlay verticalPosition="down" onClose={closeDropdown}>
              <Dropdown.Header>
                <Dropdown.Title>Reports</Dropdown.Title>
              </Dropdown.Header>
              <Dropdown.ItemCollection>
                {reportNames.map(reportName => (
                  <Dropdown.Item
                    key={reportName}
                    onClick={() => {
                      onReportChange(reportName);
                      closeDropdown();
                    }}
                  >
                    {reportName}
                  </Dropdown.Item>
                ))}
              </Dropdown.ItemCollection>
            </Dropdown.Overlay>
          )}
        </Dropdown>
      </Header>
      <NodeSummary nodeReport={currentNode} />
      <Table>
        <Table.Header sticky={0}>
          <Table.HeaderCell
            isSortable={true}
            onDirectionChange={handleDirectionChange('name')}
            sortDirection={computeDirection('name')}
          >
            Name
          </Table.HeaderCell>
          <Table.HeaderCell>Typescript ratio (File)</Table.HeaderCell>
          <Table.HeaderCell>Typescript ratio (LOC)</Table.HeaderCell>
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
                  {'directory' === child.type && (
                    <Badge>
                      {child.metrics.javascriptLOC + child.metrics.typescriptLOC} |{' '}
                      {child.metrics.javascript + child.metrics.typescript}
                    </Badge>
                  )}
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
                <ColoredCell
                  color={getLevelForRatio(
                    child.metrics.typescriptLOC / (child.metrics.javascriptLOC + child.metrics.typescriptLOC)
                  )}
                  title={`${child.metrics.typescriptLOC} / ${
                    child.metrics.javascriptLOC + child.metrics.typescriptLOC
                  }`}
                >
                  {percentFormatter.format(
                    child.metrics.typescriptLOC / (child.metrics.javascriptLOC + child.metrics.typescriptLOC)
                  )}{' '}
                  ({child.metrics.javascriptLOC} javascript LOC)
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
      <NodeCharts reports={reports} path={path} />
    </>
  );
};

export {NodeReport};
