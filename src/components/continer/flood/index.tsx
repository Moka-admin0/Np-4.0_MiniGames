import { createSignal, createEffect } from "solid-js";

import squareRed from "../../../assets/square-red.png";
import squareGreen from "../../../assets/square-green.png";
import squareBlue from "../../../assets/square-blue.png";
import squarePurple from "../../../assets/square-purple.png";
import squareOrange from "../../../assets/square-orange.png";
import squareYellow from "../../../assets/square-yellow.png";

import { resetGame, useConfig } from "../../../lib/store";
import { isFinshed } from "../../../lib/audio/play";
import { callback } from "../../callback";

const colors = ["red", "green", "orange", "yellow", "purple", "blue"];


const getAdjacentCells = (cell, cells) => {
  const adjacentCells = [];
  const cellX = cell.x;
  const cellY = cell.y;
  const allCells = cells;
  const topCell = allCells.find(
    (c) => c.x === cellX && c.y === cellY - 1
  );
  const bottomCell = allCells.find(
    (c) => c.x === cellX && c.y === cellY + 1
  );
  const leftCell = allCells.find(
    (c) => c.x === cellX - 1 && c.y === cellY
  );
  const rightCell = allCells.find(
    (c) => c.x === cellX + 1 && c.y === cellY
  );
  if (topCell) {
    adjacentCells.push(topCell);
  }
  if (bottomCell) {
    adjacentCells.push(bottomCell);
  }
  if (leftCell) {
    adjacentCells.push(leftCell);
  }
  if (rightCell) {
    adjacentCells.push(rightCell);
  }
  return adjacentCells;
};

const floodFill = (cells, startCell, color) => {
  if (startCell.hasBeenChecked) {
    return;
  }
  startCell.hasBeenChecked = true;
  startCell.hasBeenFilled = true;
  startCell.color = color;
  const adjacentCells = getAdjacentCells(startCell, cells);
  for (const adjacentCell of adjacentCells) {
    if (adjacentCell.color === color) {
      floodFill(cells, adjacentCell, color);
    }
  }
};

const flood = (cells, color) => {
  cells
    .filter((cell) => cell.hasBeenFilled)
    .forEach((filledCell) => (filledCell.color = color));
  floodFill(cells, cells[0], color);
  cells.forEach((cell) => (cell.hasBeenChecked = false));
};

const countFloods = (cells, moveCount = 0) => {
  cells = JSON.parse(JSON.stringify(cells));
  const initialColor = cells[0].color;
  if (cells.every((cell) => cell.color === initialColor)) {
    return moveCount;
  }
  let maxColor = "red";
  let maxFilledCount = 0;
  for (const color of colors) {
    const copiedCells = JSON.parse(JSON.stringify(cells));
    flood(copiedCells, color);
    const filledCount = copiedCells.filter((cell) => cell.hasBeenFilled).length;
    if (!maxColor || filledCount > maxFilledCount) {
      maxColor = color;
      maxFilledCount = filledCount;
    }
  }
  flood(cells, maxColor);
  return countFloods(cells, moveCount + 1);
};

const Flood = () => {
  const [cells, setChells] = createSignal([]);
  const [moveCount, setMoveCount] = createSignal(0);
  const [totalCells, setTotalCells] = createSignal(0);

  const handMouseDown = (id, isFinished = true) => {
    const chells = JSON.parse(JSON.stringify(cells()));
    const getChellById = chells.find((chell) => chell.id === id);
    if (!getChellById) {
      return;
    }
    const currentChellColor = getChellById.color;
    flood(chells, currentChellColor);
    const chellColor = chells[0].color;
    if (chells.every((chell) => chell.color === chellColor)) {
      isFinshed(true);
      callback(true);
      setChells(chells);
      resetGame()
      return;
    }
    if (moveCount() === totalCells() - 1) {
      callback(false)
      resetGame()
      return;
    }
    if (isFinished) {
      isFinshed(false);
    }
    setChells(chells);
    setMoveCount((prev) => prev + 1);
  };

  createEffect(() => {
    let chells = [];
    for (
      let i = 0; i < useConfig().gridSize * useConfig().gridSize; i++) {
      const gridX = i % useConfig().gridSize;
      const gridY = Math.floor(i / useConfig().gridSize);
      chells.push({
        id: i,
        x: gridX,
        y: gridY,
        hasBeenFilled: false,
        hasBeenChecked: false,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    setChells(chells);
    setTotalCells(countFloods(chells) + useConfig().moveCountLeniency);
  });

  return (
    <>
      <div class="flex h-full w-full flex-col place-content-center gap-1 p-2">
        <div class="grid h-full w-full"
          style={{
            width: useConfig().gridSize * 3.75 + "rem",
            height: useConfig().gridSize * 4 + "rem" ,
            "grid-template-columns": "repeat(" + useConfig().gridSize + ", minmax(0, 1fr))",
            "grid-template-rows": "repeat(" + useConfig().gridSize + ", minmax(0, 1fr))",
          }}
        >
          {cells().map((cell) => {
              let imageUrl = null;
              switch (cell.color) {
                case "red":
                  imageUrl = squareRed;
                  break;
                case "green":
                  imageUrl = squareGreen;
                  break;
                case "orange":
                  imageUrl = squareOrange;
                  break;
                case "yellow":
                  imageUrl = squareYellow;
                  break;
                case "purple":
                  imageUrl = squarePurple;
                  break;
                case "blue":
                  imageUrl = squareBlue;
                  break;
              }
              
              return (
                <div onMouseDown={() => handMouseDown(cell.id)} class="h-full w-full" style={{background: `url("${imageUrl}") center center / contain no-repeat`}}></div>
              )
            })}
        </div>
        <div class="text-fancygreen-100 w-full rounded-sm p-1 text-center"
          style={{
            background: "rgba(255, 255, 255, 0.15)"
          }}
        >
          {moveCount()}/{totalCells() }
        </div>
      </div>
    </>
  );
};

export default Flood;
