import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

const keys = {
  'ArrowLeft': {
    moveAlongAxis: 'x',
    readFromEnd: false,
  },
  'ArrowRight': {
    moveAlongAxis: 'x',
    readFromEnd: true,
  },
  'ArrowDown': {
    moveAlongAxis: 'y',
    readFromEnd: true,
  },
  'ArrowUp': {
    moveAlongAxis: 'y',
    readFromEnd: false,
  }
}

/*
  If block will move along an axis, the other one is the fixed one.
*/
const getFixedAxis = moveAlongAxis => (
  moveAlongAxis === 'x' ? 'y' : 'x'
);

const updateRow = (size, row, pressedKey) => {
  const { readFromEnd, moveAlongAxis } = pressedKey;
  
  const rowLastPos = row.length - 1;
  const updatedRow = [];

  let reference = null;
  let isGameWon = false;

  const pushBlockToNewRow = (block, newValue) => (
    updatedRow.push({
      ...block,
      value: newValue || block.value,
      [moveAlongAxis]: readFromEnd ? size - 1 - updatedRow.length : updatedRow.length
    })
  )

  /*
    Each block will be pushed into the updated row with a new position based on the
    direction of the movement along the axis and the amount of blocks that are already
    there. In case of a merge, only one of them is going to be maintained only with its
    value updated (multiplied by 2). A reference block is used to keep on track the last
    value evaluated, being possible to know if it's case to merge.

    Blocks' ids need to be maintained so animations can work properly.
  */
  for (let i = 0; i <= rowLastPos; i++)
  {
    const block = row[readFromEnd ? rowLastPos - i : i];

    if (!reference)
    {
      reference = block;
      if (i === rowLastPos) { pushBlockToNewRow(block) }
    }
    else if (block.value === reference.value)
    {
      const newValue = block.value * 2;
      pushBlockToNewRow(block, newValue);
      reference = null;

      if (newValue === 2048) { isGameWon = true; }
    }
    else {
      pushBlockToNewRow(reference);
      reference = block;
      if (i === rowLastPos) { pushBlockToNewRow(block); }
    }
  }

  return {
    isGameWon,
    row: readFromEnd ? _.reverse(updatedRow) : updatedRow,
  };
}

/*
  Generates a new block based on remaining empty spaces
*/
const generateNewRandomBlock = (size, emptySpaces) => {
  const randomRow = emptySpaces[Math.floor(Math.random() * emptySpaces.length)];
  const randomPos = Math.floor(Math.random() * randomRow.amount);
  const moveAlongAxis = randomRow.pressedKey.moveAlongAxis;

  return {
    [moveAlongAxis]: randomRow.pressedKey.readFromEnd
      ? randomPos
      : randomPos + size - randomRow.amount,
    [getFixedAxis(moveAlongAxis)]: randomRow.index,
    id: uuidv4(),
    value: Math.random() > 0.1 ? 2 : 4,
  }
}

const isBoardFull = (board, size) => board.length === size * size;

export const getInitialGame = size => (
  {
    blocks: [
      {
        id: uuidv4(),
        value: 2,
        x: Math.floor(Math.random() * size),
        y: Math.floor(Math.random() * size),
      }
    ],
    isUpdated: true,
    isGameOver: false,
    isGameWon: false,
  }
);

export const updateBoardFunc = (size, currentBoard, pressedKeyStr) => {
  const pressedKey = keys[pressedKeyStr];
  const newBoard = [];
  const emptySpaces = [];
  let hasWon = false;

  // Creates rows based on the move-along axis.
  const rows = _.groupBy(currentBoard, getFixedAxis(pressedKey.moveAlongAxis));

  for (let i = 0; i < size; i++)
  {
    if (rows[i]) {
      const { isGameWon, row: newRow } = updateRow(size, rows[i], pressedKey);
      hasWon = isGameWon || hasWon;
      newBoard.push(...newRow);

      const emptySpacesAmount = size - newRow.length;
      if (emptySpacesAmount > 0) {
        emptySpaces.push({ pressedKey, amount: emptySpacesAmount, index: i });
      }
    } else {
      emptySpaces.push({ pressedKey, amount: size, index: i });
    }
  }

  if (!_.isEqual(currentBoard, newBoard)){
    newBoard.push(generateNewRandomBlock(size, emptySpaces));
  }

  return ({
    isUpdated: true,
    isGameWon: hasWon,
    isGameOver: isBoardFull(newBoard, size) && noMoviesLeft(newBoard, pressedKey.moveAlongAxis),
    blocks: newBoard
  });
}

/*
  Checks if there is at least one possible movement when the board
  has no more empty spaces.
*/
export const noMoviesLeft = (newBoard, moveAlongAxis) => {
  const fixedAxis = getFixedAxis(moveAlongAxis);
  const sortedBoard = _.sortBy(newBoard, [fixedAxis, moveAlongAxis]);
  for (let i = 1; i < sortedBoard.length; i++) {
    const currBlock = sortedBoard[i];
    const prevBlock = sortedBoard[i-1];
    if (prevBlock[fixedAxis] === currBlock[fixedAxis] && prevBlock.value === currBlock.value) {
      return false;
    }
  }
  const transposedBoard = _.sortBy(newBoard, [moveAlongAxis, fixedAxis]);
  for (let i = 1; i < transposedBoard.length; i++) {
    const currBlock = transposedBoard[i];
    const prevBlock = transposedBoard[i-1];
    if (prevBlock[moveAlongAxis] === currBlock[moveAlongAxis] && prevBlock.value === currBlock.value) {
      return false;
    }
  }
  return true;
}

export const sortBlocksByAxis = (currentBoard, pressedKeyStr) => (
  {
    isUpdated: false,
    blocks: _.sortBy(
      currentBoard,
      [getFixedAxis(keys[pressedKeyStr].moveAlongAxis), keys[pressedKeyStr].moveAlongAxis]
    ),
  }
);

export const getBlockColor = value => {
  switch(value)
  {
    case 2:
      return '#282c34';
    case 4:
      return '#253049';
    case 8:
      return '#1e3769';
    case 16:
      return '#1a3e86';
    case 32:
      return '#16429b';
    case 64:
      return '#1048b8';
    case 128:
      return '#0748cb';
    case 256:
      return '#2566e9';
    case 512:
      return '#5287f1';
    case 1024:
      return '#73a0f9';
    case 2048: 
      return '#88aaf0'
    default:
      return ''
  }
}

export default null;
