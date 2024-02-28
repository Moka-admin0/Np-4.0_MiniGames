import { For, createEffect, createSignal } from "solid-js";

import { resetGame, useConfig } from "../../../lib/store";


import squareRed from "../../../assets/square-red.png";
import squareGreen from "../../../assets/square-green.png";
import squareBlue from "../../../assets/square-blue.png";
import { isFinshed } from "../../../lib/audio/play";
import { callback } from "../../callback";

var colors = function (palette) {
  palette.Red = "#df3232";
  palette.Green = "#4a9334";
  palette.Blue = "#139dab";
  return palette;
}(colors || {});


const colorList = [colors.Red, colors.Green, colors.Blue];


const getNeighbors = (cell, grid) => {
  const neighbors = [];
  const cellX = cell.x;
  const CellY = cell.y;
  const gridCells = grid;
  const topNeighbor = gridCells.find(_0x37a24d => _0x37a24d.x === cellX && _0x37a24d.y === CellY - 1);
  const bottomNeighbor = gridCells.find(_0x36b20b => _0x36b20b.x === cellX && _0x36b20b.y === CellY + 1);
  const leftNeighbor = gridCells.find(_0x32ef7b => _0x32ef7b.x === cellX - 1 && _0x32ef7b.y === CellY);
  const rightNeighbor = gridCells.find(_0x6d74b8 => _0x6d74b8.x === cellX + 1 && _0x6d74b8.y === CellY);
  
  if (topNeighbor) {
    neighbors.push(topNeighbor);
  }
  if (bottomNeighbor) {
    neighbors.push(bottomNeighbor);
  }
  if (leftNeighbor) {
    neighbors.push(leftNeighbor);
  }
  if (rightNeighbor) {
    neighbors.push(rightNeighbor);
  }
  return neighbors;
};


const findConnectedCells = (cell, grid) => {
  const connectedCells = [cell];
  const visitedIds = new Set([cell.id]);
  const queue = getNeighbors(cell, grid);

  while (queue.length > 0) {
    const currentCell = queue.pop();
    if (!currentCell) {
      break;
    }
    if (currentCell.color === cell.color) {
      connectedCells.push(currentCell);
      for (const neighbor of getNeighbors(currentCell, grid)) {
        if (!visitedIds.has(neighbor.id)) {
          queue.push(neighbor);
          visitedIds.add(neighbor.id);
        }
      }
    }
  }

  return connectedCells;
};

const shiftDown = (grid, gridSizeX, gridSizeY) => {
  for (let column = 0; column < gridSizeX; column++) {
    let bottomEmptyRow = gridSizeY - 1;
    let topFilledRow = bottomEmptyRow;
    while (topFilledRow >= 0 && bottomEmptyRow >= 0) {
      while (bottomEmptyRow >= 0 && grid[bottomEmptyRow * gridSizeX + column].color !== null) {
        bottomEmptyRow--;
      }
      if (bottomEmptyRow >= 0) {
        for (topFilledRow = bottomEmptyRow - 1; topFilledRow >= 0 && grid[topFilledRow * gridSizeX + column].color === null;) {
          topFilledRow--;
        }
        if (topFilledRow >= 0) {
          grid[bottomEmptyRow * gridSizeX + column].color = grid[topFilledRow * gridSizeX + column].color;
          grid[topFilledRow * gridSizeX + column].color = null;
        }
      }
    }
  }
};


const shiftLeft = (grid, gridSizeX, gridSizeY) => {
  let column = 0;
  let row = 0;
  while (row < gridSizeY && column < gridSizeX) {
    while (column < gridSizeX && grid[(gridSizeY - 1) * gridSizeX + column].color !== null) {
      column++;
    }
    if (column < gridSizeX) {
      for (row = column + 1; row < gridSizeX && grid[(gridSizeY - 1) * gridSizeX + row].color === null;) {
        row++;
      }
      if (row < gridSizeX) {
        for (let i = 0; i < gridSizeY; i++) {
          grid[i * gridSizeX + column].color = grid[i * gridSizeX + row].color;
          grid[i * gridSizeX + row].color = null;
        }
      }
    }
  }
};


const hasConnectedCells = grid => {
  for (const cell of grid) {
    if (cell.color === null) {
      continue;
    }
    if (getNeighbors(cell, grid).some(neighbor => neighbor.color === cell.color)) {
      return true;
    }
  }
  return false;
};


const Same = () => {
  const [grid, setGrid] = createSignal([]);

  
  const handleClick = (cellId, playSoundFlag = true) => {
    const currentGrid = JSON.parse(JSON.stringify(grid()));
    const clickedCell = currentGrid.find(_0xa40b9b => _0xa40b9b.id === cellId);
    if (!clickedCell) {
      return;
    }
    const connectedCells = findConnectedCells(clickedCell, currentGrid);
    if (connectedCells.length > 1) {
      connectedCells.forEach(cell => cell.color = null);
      shiftDown(currentGrid, useConfig().gridSizeX, useConfig().gridSizeY);
      shiftLeft(currentGrid, useConfig().gridSizeX, useConfig().gridSizeY);
      if (currentGrid.every(cell => cell.color === null)) {
        isFinshed(true);
        callback(true)
        setGrid(currentGrid);
        return;
      }
      if (!hasConnectedCells (currentGrid)) {
        callback(false)
        return;
      }
      if (playSoundFlag) {
        isFinshed(false);
      }
      setGrid(currentGrid);
    }
  };


  createEffect(() => {
    let newGrid = [];
    for (let i = 0; i < useConfig().gridSizeX * useConfig().gridSizeY; i++) {
      const cellX = i % useConfig().gridSizeX;
      const cellY = Math.floor(i / useConfig().gridSizeX);
      newGrid.push({
        id: i,
        x: cellX,
        y: cellY,
        color: colorList[Math.floor(Math.random() * colorList.length)]
      });
    }
    setGrid(newGrid);
  });


  return (
    <>
      <div class="flex h-full w-full place-content-center">
        <div class="grid p-2"
        style={{
          width: useConfig().gridSizeX * 4.75 + "rem",
          height: useConfig().gridSizeY * 5 + "rem",
          "grid-template-columns": "repeat(" + useConfig().gridSizeX + ", minmax(0, 1fr))",
          "grid-template-rows" :"repeat(" + useConfig().gridSizeY + ", minmax(0, 1fr))"
        }}
        >
          <For each={grid()}>
            {cell => (
              <div onMouseDown={() => handleClick(cell.id) } class="h-full w-full" data-x="0" data-y="0" style={{
                background: `url(${cell.color ? cell.color === colors.Red ? squareRed : cell.color === colors.Green ? squareGreen : squareBlue : ""}) center center / contain no-repeat`
              }}></div>
            )}
          </For>
        </div>
      </div>
    </>
  );
};

export default Same;
