import { createSignal, onMount, onCleanup } from "solid-js";

import finishSound from "../../../assets/finish.wav";
import successSound from "../../../assets/success.wav";

import backgroundImage from "../../../assets/background.png";
import fishImage from "../../../assets/fish.png";
import emptyImage from "../../../assets/empty.png";

import { resetGame, useConfig } from "../../../lib/store";
import { getRandomInt } from "../../../lib/numbers";
import { callback } from "../../callback";

const Direction = () => {
  const [gridItems, setGridItems] = createSignal([]);
  const [gridSize, setGridSize] = createSignal(useConfig().minGridSize ?? 3);
  const [correctChoices, setCorrectChoices] = createSignal(0);
  const [xOffset, setXOffset] = createSignal(0);
  const [yOffset, setYOffset] = createSignal(0);

  const generateGrid = (size) => {
    const totalItems = size * size;
    const correctIndex = Math.floor(size * size / 2);
    const grid = [];

    for (let i = 0; i < totalItems; i++) {
      if (i === correctIndex) {
        grid.push(chooseRandom([Directions.Left, Directions.Right]));
      } else {
        grid.push(chooseRandom([Directions.Left, Directions.Right, Directions.Empty]));
      }
    }

    for (let row = 0; row < size; row++) {
      let isEmptyRow = true;
      for (let col = 0; col < size; col++) {
        const index = row * size + col;
        if (grid[index] !== Directions.Empty) {
          isEmptyRow = false;
          break;
        }
      }
      if (isEmptyRow) {
        const randomCol = getRandomInt(0, size - 1);
        const randomIndex = row * size + randomCol;
        grid[randomIndex] = chooseRandom([Directions.Left, Directions.Right]);
      }
    }

    for (let col = 0; col < size; col++) {
      let isEmptyCol = true;
      for (let row = 0; row < size; row++) {
        const index = row * size + col;
        if (grid[index] !== Directions.Empty) {
          isEmptyCol = false;
          break;
        }
      }
      if (isEmptyCol) {
        const randomRow = getRandomInt(0, size - 1);
        const randomIndex = randomRow * size + col;
        grid[randomIndex] = chooseRandom([Directions.Left, Directions.Right]);
      }
    }

    return grid;
  };

  const playSound = (isFinish) => {
    const audio = new Audio(isFinish ? finishSound : successSound);
    audio.volume = isFinish ? 0.1 : 0.05;
    audio.controls = false;
    audio.play();
    setTimeout(() => {
      audio.remove();
    }, 300);
  };

  const handleKeyPress = (event) => {
    if (event.key === "ArrowLeft") {
      makeChoice(Directions.Left);
    } else if (event.key === "ArrowRight") {
      makeChoice(Directions.Right);
    }
  };

  const makeChoice = (direction, isSuccessSoundEnabled = true) => {
    const correctIndex = Math.floor(gridSize() * gridSize() / 2);
    const currentDirection = gridItems()[correctIndex];
    console.log("currentDirection", currentDirection, "direction", direction)
    if ((currentDirection === Directions.Left && direction === Directions.Left) ||
        (currentDirection === Directions.Right && direction === Directions.Right)) {
      setCorrectChoices(correctChoices() + 1);
      if (correctChoices() === useConfig().requiredCorrectChoices) {
        playSound(true);
        callback(true);
        return;
      }
    } else {
      callback(false);
      return;
    }

    if (isSuccessSoundEnabled) {
      playSound(false);
    }

    setXOffset(getRandomInt(-5, 5));
    setYOffset(getRandomInt(-5, 5));
    const newSize = getRandomInt(useConfig().minGridSize, useConfig().maxGridSize);
    setGridSize(newSize);
    setGridItems(generateGrid(newSize));
  };

  onMount(() => {
    setGridSize(useConfig().minGridSize);
    setGridItems(generateGrid(useConfig().minGridSize));
    document.addEventListener("keydown", handleKeyPress);
    onCleanup(() => {
      document.removeEventListener("keydown", handleKeyPress);
    });
  });

  return (
    <>
      <div class="flex h-full w-[72rem] flex-col place-content-center items-center p-4" tabindex="0"
        style={{
          background: `url(${backgroundImage}) center center no-repeat fixed`
        }}
      >
        <div class="flex h-[48rem] place-content-center items-center">
          <div class="grid w-fit gap-2" tabindex="0"
            style={{
              "grid-template-columns": "repeat(" + gridSize() + ", 1fr)",
              "grid-template-rows": "repeat(" + gridSize() + ", 1fr)",
              "transform": "translate(" + xOffset() + "rem, " + yOffset() + "rem)",
            }}
          >
            {gridItems().map((item) => {
              if (item === Directions.Empty) {
                return (
                  <img class="h-12" alt="Empty" src={emptyImage}></img>
                )
              }
              return (
                <img class="h-12" alt="Right-facing shark" src={fishImage} style={item === Directions.Left ? "transform: scaleX(-1);" : ""}/>
              );
            })}
          </div>
        </div>
        <div class="flex flex-col text-center text-white">
          <div class="flex gap-2">
            <div onClick={() => makeChoice(Directions.Left)} class="flex h-8 w-8 place-content-center items-center rounded-md bg-black hover:bg-gray-700">
              <span class="material-symbols-rounded text-[1.5rem] [textShadow:0px_0px_12px_rgba(0,_248,_185,_0.25)]">
                keyboard_arrow_left
              </span>
            </div>
            <div onClick={() => makeChoice(Directions.Right)} class="flex h-8 w-8 place-content-center items-center rounded-md bg-black hover:bg-gray-700">
              <span class="material-symbols-rounded text-[1.5rem] [textShadow:0px_0px_12px_rgba(0,_248,_185,_0.25)]">
                keyboard_arrow_right
              </span>
            </div>
          </div>
          {correctChoices() + 1 + " / " + useConfig().requiredCorrectChoices}
        </div>
      </div>
    </>
  );
};

const Directions = {
  Left: "Left",
  Right: "Right",
  Empty: "Empty"
};

const chooseRandom = (array) => array[getRandomInt(0, array.length - 1)];

export default Direction;
