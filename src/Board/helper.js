import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

const keys = {
  'ArrowLeft': {
    groupByField: 'y',
    sortByField: 'x',
    reverse: false,
  },
  'ArrowRight': {
    groupByField: 'y',
    sortByField: 'x',
    reverse: true,
  },
  'ArrowDown': {
    groupByField: 'x',
    sortByField: 'y',
    reverse: true,
  },
  'ArrowUp': {
    groupByField: 'x',
    sortByField: 'y',
    reverse: false,
  }
}

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
  }
);

export const updateRow = (size, sortedRow, pressedKey) => {
  const { reverse, sortByField } = pressedKey;
  
  const theRow = reverse ? _.reverse(sortedRow) : sortedRow;
  const rowSize = theRow.length;
  const newLine = [];
  let reference = null;

  for (let i = 0; i < rowSize; i++)
  {
    const block = theRow[i];

    if (!reference)
    {
      reference = block;
      if (i === rowSize - 1) {
        newLine.push({
          ...block,
          [sortByField]: reverse ? size - 1 - newLine.length : newLine.length,
        });
      }
      continue;
    }
    if (block.value === reference.value)
    {
      newLine.push({
        ...block,
        value: block.value * 2,
        [sortByField]: reverse ? size - 1 - newLine.length : newLine.length,
      });
      reference = null;
    } else {
      newLine.push({
        ...reference,
        [sortByField]: reverse ? size - 1 - newLine.length : newLine.length,
      });
      reference = block;
      if (i === rowSize - 1) {
        newLine.push({
          ...block,
          [sortByField]: reverse ? size - 1 - newLine.length : newLine.length,
        });
      }
    }
  }

  return reverse ? _.reverse(newLine) : newLine;
}

export const updateBoardFunc = (size, currentBoard, pressedKeyStr) => {
  const pressedKey = keys[pressedKeyStr];
  const newBoard = [];
  const emptySpaces = [];

  const rows = _.groupBy(currentBoard, pressedKey.groupByField);
  for (let i = 0; i < size; i++)
  {
    if (rows[i]) {
      const orderedRow = _.sortBy(rows[i], [pressedKey.sortByField]);
      const newRow = updateRow(size, orderedRow, pressedKey);
      newBoard.push(...newRow);

      const emptySpacesAmount = size - newRow.length;
      if (emptySpacesAmount > 0) {
        emptySpaces.push({ pressedKey, amount: emptySpacesAmount, index: i });
      }
    } else {
      emptySpaces.push({ pressedKey, amount: size, index: i });
    }
  }

  const randomRow = emptySpaces[Math.floor(Math.random() * emptySpaces.length)];
  const randomPos = Math.floor(Math.random() * randomRow.amount);
  const newBlockPosition = {
    [randomRow.pressedKey.sortByField]: randomRow.pressedKey.reverse ? randomPos : randomPos + size - randomRow.amount,
    [randomRow.pressedKey.groupByField]: randomRow.index,
  }

  newBoard.push({
    ...newBlockPosition,
    id: uuidv4(),
    value: 2,
  })
  
  return ({ isUpdated: true, blocks: newBoard });
}

export const sortBlocksByAxis = (currentBoard, pressedKeyStr) => (
  {
    isUpdated: false,
    blocks: _.sortBy(currentBoard, [keys[pressedKeyStr].groupByField, keys[pressedKeyStr].sortByField]),
  }
);

export default null;
