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
import { BoardWrapper, Block } from './styles';

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
      /*
        Because of the way React identifies itens contained in an array, the array needs
        to, primarily, be sorted considering the axis which the movement will accour along.
        After that, the board can be appropriately updated with the blocks new values
        and positions
      */
      updateBoard(sortBlocksByAxis(blocks, pressedKeyEvent.key))
    }
  }, [pressedKeyEvent]);

  useEffect(() => {
    if (!isUpdated && !isGameOver && !isGameWon) {
      /*
        Board will be updated considering the key that was pressed and the
        current position and value of the blocks
      */
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
              <Block
                blockColor={getBlockColor(item.value)}
                row={item.y}
                column={item.x}
              >
                {item.value}
              </Block>
            </CSSTransition>
          ))
        }
      </TransitionGroup>
      {
        isGameOver || isGameWon
          ? (
            <Warning
              message={isGameOver ? 'GAME OVER!' : 'CONGRATS!'}
              resetGame={resetGame}
            />
          )
          : null
      }
    </BoardWrapper>
  )
}

export default Board;
