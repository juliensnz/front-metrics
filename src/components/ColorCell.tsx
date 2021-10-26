import {Level, Table, AkeneoThemedProps, getColorForLevel} from 'akeneo-design-system';
import styled from 'styled-components';

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

export {ColoredCell, getLevelForRatio};
