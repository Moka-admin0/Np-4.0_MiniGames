import { resetGame, useConfig } from "../lib/store"
import { fetchNui } from "../utils/fetchNui"

export const callback = (state) => {
    resetGame()
    fetchNui("skillchecks:minigameResult", {
        result : state,
        callback: useConfig().gameFinishedEndpoint
    })
}