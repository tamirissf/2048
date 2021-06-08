import styled from 'styled-components';

export const BoardWrapper = styled.div`
  padding: 1px;
  background-color: #a3d00c;
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