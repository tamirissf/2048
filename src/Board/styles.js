import styled from 'styled-components';
import { colors } from '../colors';

const { lightGreen, mediumGray } = colors;

export const BoardWrapper = styled.div`
  padding: 1px;
  background-color: ${lightGreen};
  height: 500px;
  width: 500px;
  position: relative;

  .block-enter {
    opacity: 0;
  }
  .block-enter-active {
    opacity: 1;
    transition: opacity 150ms ease-in;
  }
  .block-exit {
    opacity: 1;
  }
  .block-exit-active {
    opacity: 0;
    transition: opacity 150ms ease-in;
  }
`;

export const Block = styled.div`
  background-color: ${props => props.blockColor};
  border: solid 2px ${lightGreen};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${mediumGray};
  font-size: xx-large;
  font-weight: 600;
  box-sizing: border-box;
  position: absolute;
  top: ${props => props.row * 125 + 'px'};
  left: ${props => props.column * 125 + 'px'};
  width: 125px;
  height: 125px;
  transition: 150ms;
`;