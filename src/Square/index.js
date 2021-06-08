import React, { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

import { Wrapper } from './styles';

function Square({ item }) {
  const { id, x, y, value } = item;
  const squareRef = useRef(null);
  return (
    <CSSTransition
      key={id}
      nodeRef={squareRef}
      timeout={300}
      classNames="block"
    >
      <Wrapper ref={squareRef} row={y} column={x}>
        {value}
      </Wrapper>
    </CSSTransition>
  )
}

export default Square;
