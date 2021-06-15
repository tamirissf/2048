/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import {
  getInitialGame,
  updateBoardFunc,
  sortBlocksByAxis,
  getBlockColor
} from './helper';
import { BoardWrapper } from './styles';

import { Wrapper } from '../Square/styles';

const SIZE = 4;

function Board({ pressedKeyEvent }) {
  const [board, updateBoard] = useState(getInitialGame(SIZE));

  useEffect(() => {
    if (pressedKeyEvent) {
      updateBoard(sortBlocksByAxis(board.blocks, pressedKeyEvent.key))
    }
  }, [pressedKeyEvent]);

  useEffect(() => {
    if (!board.isUpdated) {
      updateBoard(updateBoardFunc(SIZE, board.blocks, pressedKeyEvent.key));
    }
  }, [board]);

  return (
    <BoardWrapper>
      <TransitionGroup component={null}>
        {
          board.blocks.map(item => (
            <CSSTransition
              key={item.id}
              timeout={150}
              classNames="block"
            >
              <Wrapper
                blockColor={getBlockColor(item.value)}
                row={item.y}
                column={item.x}
              >
                {item.value}
              </Wrapper>
            </CSSTransition>
          ))
        }
      </TransitionGroup>
    </BoardWrapper>
  )
}

export default Board;
