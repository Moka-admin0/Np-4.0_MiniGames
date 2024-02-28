import { createSignal, createEffect, For } from "solid-js";
import { useConfig } from "../../../lib/store";

import squareGreen from "../../../assets/square-green.png";
import squareOrange from "../../../assets/square-orange.png";

import { isFinshed } from "../../../lib/audio/play";
import { callback } from "../../callback";

const getAdjacentCells = (cell, pCellType = "cross", pCellsArray) => {
  const adjacentCells = [];
  const cellX = cell.x;
  const cellY = cell.y;
  const cellsArray = pCellsArray;
  if (pCellType === "cross") {
    const topCell = cellsArray.find(_cell => _cell.x === cellX && _cell.y === cellY - 1);
    const bottomCell = cellsArray.find(_cell => _cell.x === cellX && _cell.y === cellY + 1);
    const leftCell = cellsArray.find(_cell => _cell.x === cellX - 1 && _cell.y === cellY);
    const rightCell = cellsArray.find(_cell => _cell.x === cellX + 1 && _cell.y === cellY);

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
  }
  return adjacentCells;
};


const Flip = () => {
  const [cells, setCells] = createSignal([]);

  const handleClick = (cellId, isCallback = true) => {
    const clickedCell = cells().find(cell => cell.id === cellId);

    if (!clickedCell) {
      return;
    }
    clickedCell.isClicked = !clickedCell?.isClicked;
    getAdjacentCells(clickedCell, "cross", cells()).forEach(adjacentCell => {
      adjacentCell.isClicked = !adjacentCell?.isClicked;
    });
    if (cells().every(cell => !cell.isClicked)) {
      isFinshed(true);
      callback(true);
      return;
    }
    if (isCallback) {
      isFinshed(false);
    }
    const newCells = JSON.parse(JSON.stringify(cells()));
    setCells(newCells);
  };


  createEffect(() => {
    let cellsArray = [];
    for (let i = 0; i < useConfig().gridSize * useConfig().gridSize; i++) {
      const cellX = i % useConfig().gridSize;
      const CellY = Math.floor(i / useConfig().gridSize);

      cellsArray.push({
        id: i,
        x: cellX,
        y: CellY,
        isClicked: false
      });
    }

    let clickedCellsCount = cellsArray.filter(cell => cell.isClicked).length;
    while (clickedCellsCount === 0 || clickedCellsCount <= useConfig().gridSize) {
      for (let j = 0; j < useConfig().gridSize * useConfig().gridSize; j++) {
        const cellX = j % useConfig().gridSize;
        const cellY = Math.floor(j / useConfig().gridSize);
        const currentCell = cellsArray.find(cell => cell.x === cellX && cell.y === cellY);

        if (currentCell && Math.random() < 0.5) {
          currentCell.isClicked = !currentCell?.isClicked;
          getAdjacentCells(currentCell, "cross", cellsArray).forEach(adjacentCell => {
            adjacentCell.isClicked = !adjacentCell?.isClicked;
          });
        }
      }
      clickedCellsCount = cellsArray.filter(cell => cell.isClicked).length;
    }
    setCells(cellsArray);
  });

  return (
    <>
      <div>
        <div
          class="grid h-full w-full gap-2 p-2"
          style={{
            "grid-template-columns": "repeat(" + useConfig().gridSize + ", 1fr)",
            "grid-template-rows" : "repeat(" + useConfig().gridSize + ", 1fr)",
            width: useConfig().gridSize * 6.75 + "rem",
            height: useConfig().gridSize * 7 + "rem",
          }}
        >
          <For each={cells()}>
            {(cell) => (
              <div onMouseDown={() => handleClick(cell.id)} class="h-full w-full rounded-md transition-all duration-300 hover:border-2 hover:border-slate-700"
                style={{
                  background: "url(" + (cell.isClicked ? squareOrange : squareGreen) + ") no-repeat center center / contain"
                }}
              ></div>
            )}
          </For>
        </div>
      </div>
    </>
  );
};

export default Flip;
