import React from 'react';

import { Wrapper, RestartButton } from './styles';

function Warning({ message, resetGame }) {
  return (
    <Wrapper>
      {message}
      <RestartButton onClick={resetGame}>RESTART</RestartButton>
    </Wrapper>
  )
}

export default Warning;

