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

type Report = {
  directoryPath: string;
  path: string;
  name: string;
  metrics: {
    typescript: number;
    javascript: number;
    requireInJavascript: number;
    requireInTypescript: number;
    defineInJavascript: number;
    reactClassComponent: number;
    bemInTypescript: number;
    reactController: number;
    backboneController: number;
  };
} & (
  | {
      type: 'directory';
      children: {
        [key: string]: Report;
      };
    }
  | {
      type: 'file';
    }
);

const getNode = (report: Report, folders: string[]): Report => {
  if (0 === folders.length) {
    return report;
  }

  const firstFolder = folders.shift();

  if ('' === firstFolder) {
    return getNode(report, folders);
  }

  if ('file' === report.type || undefined === firstFolder) {
    return report;
  }

  return getNode(report.children[firstFolder], folders);
};

type NodeReportProps = {
  report: Report;
};
const NodeReport = ({report}: NodeReportProps) => {
  const {url} = useRouteMatch();
  const currentNode = getNode(report, url.split('/'));

  if ('file' === currentNode.type) {
    return null;
  }

  return (
    <>
      <Breadcrumb>
        {url.split('/').map(name =>
          '' === name ? (
            <Breadcrumb.Step key={name} href="/">
              Root
            </Breadcrumb.Step>
          ) : (
            <Breadcrumb.Step key={name} href={`${url.substring(0, url.indexOf(name))}${name}`}>
              {name}
            </Breadcrumb.Step>
          )
        )}
      </Breadcrumb>
      <Table>
        <Table.Header sticky={0}>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Typescript ratio</Table.HeaderCell>
          <Table.HeaderCell>Require in typescript</Table.HeaderCell>
          <Table.HeaderCell>Number of legacy files</Table.HeaderCell>
          <Table.HeaderCell>React classes</Table.HeaderCell>
          <Table.HeaderCell>BEM in typescript</Table.HeaderCell>
          <Table.HeaderCell>Legacy bridges</Table.HeaderCell>
          <Table.HeaderCell>Backbone controllers</Table.HeaderCell>
        </Table.Header>
        <Table.Body>
          {Object.values(currentNode.children).map(child => {
            const childUrl = '/' === url ? `/${child.name}` : `${url}/${child.name}`;
            console.log(child);
            const percentFormater = new Intl.NumberFormat('en-US', {
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
                  <Badge>{child.metrics.javascript + child.metrics.typescript}</Badge>
                </SpacedCell>
                <ColoredCell
                  color={getLevelForRatio(
                    child.metrics.typescript / (child.metrics.javascript + child.metrics.typescript)
                  )}
                  title={`${child.metrics.typescript} / ${child.metrics.javascript + child.metrics.typescript}`}
                >
                  {percentFormater.format(
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
