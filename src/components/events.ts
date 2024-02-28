import { useNuiEvent } from "../hooks/useNuiEvent";
import { resetGame, setGameSettings } from "../lib/store";

useNuiEvent("skillchecks:settings", async (data) => {
    if (!data) return console.error("No data received from NUI");
    resetGame()
    setGameSettings({
        show: data?.show,
        active: data?.active,
        gameFinished: false,
        gameWon: false,
        introShown: data?.introShown,
        gameFinishedEndpoint: data?.gameFinishedEndpoint, 
        gameTimeoutDuration: data?.gameTimeoutDuration, 
        minGridSize: data?.minGridSize, 
        maxGridSize: data?.maxGridSize, 
        requiredCorrectChoices: data?.requiredCorrectChoices,
        gridSizeX: data?.gridSizeX,
        gridSizeY: data?.gridSizeY,
        gridSize: data?.gridSize,
        moveCountLeniency: data?.moveCountLeniency,
        name: data?.name,
        description: data?.description,
        gameTimeout: data?.gameTimeout,
        gameId: data?.gameId, 
        numPoints: data?.numPoints, 
        numKeys: data?.numKeys, 
        numLocks: data?.numLocks, 
        numLevels: data?.numLevels, 
    });
})