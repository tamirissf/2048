/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import Warning from '../Warning';

import {
  getInitialGame,
  updateBoardFunc,
  sortBlocksByAxis,
  getBlockColor,
} from './helper';
import { BoardWrapper } from './styles';

import { Wrapper } from '../Square/styles';

const SIZE = 4;

function Board({ pressedKeyEvent }) {
  const [board, updateBoard] = useState(getInitialGame(SIZE));

  const {
    isUpdated,
    isGameWon,
    isGameOver,
    blocks,
  } = board;

  const resetGame = useCallback(() => {
    updateBoard(getInitialGame());
  })

  useEffect(() => {
    if (pressedKeyEvent && !isGameOver && !isGameWon) {
      updateBoard(sortBlocksByAxis(blocks, pressedKeyEvent.key))
    }
  }, [pressedKeyEvent]);

  useEffect(() => {
    if (!isUpdated && !isGameOver && !isGameWon) {
      updateBoard(updateBoardFunc(SIZE, blocks, pressedKeyEvent.key));
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
      {
        isGameOver || isGameWon
          ? <Warning message={isGameOver ? 'GAME OVER!' : 'CONGRATS!'} resetGame={resetGame} />
          : null
      }
    </BoardWrapper>
  )
}

export default Board;
