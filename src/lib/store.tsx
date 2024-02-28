import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";

export const DataContext = createContext();

const [data, setData] = createStore({
  show: false,
  active: "",
  gameFinished: false,
  gameWon: false,
  introShown: false,
  gameFinishedEndpoint: "skillchecks:minigameResult",
  gameTimeoutDuration: 30000,
  minGridSize: 3,
  maxGridSize: 7,
  requiredCorrectChoices: 20,
  gridSizeX: 11,
  gridSizeY: 8,
  gridSize: 5,
  moveCountLeniency: 5,
  name: "Khaled",
  description: "A game of skill and luck!",
  gameTimeout: 0,
  gameId: 0,
  numPoints: 6,
  numKeys: 12,
  numLocks: 12,
  numLevels: 3
});

export const Provider = (props) => {
  return (
    <DataContext.Provider value={{ data, setData }}>
      {props.children}
    </DataContext.Provider>
  );
};

export const Context = () => {
  return useContext(DataContext);
};

export const useConfig = () => {
  return data
};

export const resetGame = () => {
  setData((prev) => {
    return { ...prev, gameFinished: false, gameWon: false, introShown: false, gameTimeout: 0, show: false };
  })
}
export const setGameFinished = (state) => {
  setData((prev) => {
    return { ...prev, gameFinished: state }
  })
}

export const setGameSettings = (settings) => {
  setData((prev) => {
    return { ...prev, ...settings }
  })
}
