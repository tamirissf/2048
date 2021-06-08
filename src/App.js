import React, { useState, useEffect } from 'react';
import Board from './Board/Board';

import { Content } from './styles';

const MOVE_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

function App() {
  const [pressedKeyEvent, setPressedKeyEvent] = useState(null);

  useEffect(() => {
    window.addEventListener('keydown', event => {
      const { key, timeStamp } = event;
      if (MOVE_KEYS.includes(key)) {
        setPressedKeyEvent({ key, timeStamp });
      }
    })
  }, []);

  return (
    <Content>
      <Board pressedKeyEvent={pressedKeyEvent} />
    </Content>
  );
}

export default App;
