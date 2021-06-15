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

const getFixedAxis = axis => (
  axis === 'x' ? 'y' : 'x'
);

export const getInitialGame = size => (
  {
    blocks: [
      {
        id: uuidv4(),
        value: 2,
        x: 0,
        y: 0,
      }
    ],
    isUpdated: true,
    isGameOver: false,
  }
);

const updateRow = (size, row, pressedKey) => {
  const { readFromEnd, moveAlongAxis } = pressedKey;
  
  const rowSize = row.length;
  const newLine = [];
  let reference = null;

  for (let i = 0; i < rowSize; i++)
  {
    const index = readFromEnd ? rowSize - 1 - i : i;
    const block = row[index];

    if (!reference)
    {
      reference = block;
      if (i === rowSize - 1) {
        newLine.push({
          ...block,
          [moveAlongAxis]: readFromEnd ? size - 1 - newLine.length : newLine.length,
        });
      }
    }
    else if (block.value === reference.value)
    {
      newLine.push({
        ...block,
        value: block.value * 2,
        [moveAlongAxis]: readFromEnd ? size - 1 - newLine.length : newLine.length,
      });
      reference = null;
    }
    else {
      newLine.push({
        ...reference,
        [moveAlongAxis]: readFromEnd ? size - 1 - newLine.length : newLine.length,
      });
      reference = block;
      if (i === rowSize - 1) {
        newLine.push({
          ...block,
          [moveAlongAxis]: readFromEnd ? size - 1 - newLine.length : newLine.length,
        });
      }
    }
  }

  return readFromEnd ? _.reverse(newLine) : newLine;
}

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
    value: Math.random() > 0.2 ? 2 : 4,
  }
}

export const updateBoardFunc = (size, currentBoard, pressedKeyStr) => {
  const pressedKey = keys[pressedKeyStr];
  const newBoard = [];
  const emptySpaces = [];

  const rows = _.groupBy(currentBoard, getFixedAxis(pressedKey.moveAlongAxis));
  for (let i = 0; i < size; i++)
  {
    if (rows[i]) {
      const newRow = updateRow(size, rows[i], pressedKey);
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

  if (newBoard.length === size * size) {
    // TODO:
    // Check if it's possible a new move
  }

  return ({ isUpdated: true, isGameOver: false, blocks: newBoard });
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
