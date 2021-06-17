import React from 'react';

import { Wrapper } from './styles';

function Warning({ message }) {
  return (
    <Wrapper>
      {message}
    </Wrapper>
  )
}

export default Warning;
