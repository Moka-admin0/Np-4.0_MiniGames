import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import Alphabet from "./continer/alphabet";

import "../assets/index.css"
import Words from "./continer/words";

import { resetGame, useConfig } from "../lib/store";

import controller from "../assets/controller.svg";
import Lockpicking from "./continer/lockpicking";
import Untangle from "./continer/untangle";
import Direction from "./continer/direction";
import Same from "./continer/same";
import Flood from "./continer/flood";
import Flip from "./continer/flip";

import "./events";
import { callback } from "./callback";

export default function App() {
  const { gameTimeoutDuration, description, name } = useConfig();
  const [time, setTime] = createSignal(100);

  onMount(() => {
    const interval = setInterval(() => {
      if (time() <= 0 && !useConfig().gameFinished) {
        callback(false)
        setTime(100);
      }
      setTime(time() -.1)

    }, gameTimeoutDuration / 1000);

    onCleanup(() => {
      clearInterval(interval);
    });
  });

  const currentMiniGame = {

    untangle: {
      when: (active) => active === "untangle",
      component: () => (
        <Untangle />
      ),
    },

    words: {
      when: (active) => active === "words",
      component: () => (
        <Words />
      ),
    },

    alphabet: {
      when: (active) => active === "alphabet",
      component: () => (
        <Alphabet /> 
      ),
    },

    lockpicking: {
      when: (active) => active === "lockpicking",
      component: () => (
        <Lockpicking />
      ),
    },

    direction: {
      when: (active) => active === "direction",
      component: () => (
        <Direction />
      ),
    },

    same : {
      when: (active) => active === "same",
      component: () => (
        <Same />
      ),
    },
    
    flood: {
      when: (active) => active === "flood",
      component: () => (
        <Flood />
      ),
    },

    flip: {
      when: (active) => active === "flip",
      component: () => (
        <Flip />
      ),
    },

    default: {
      component: () => <div class="p-4 text-white">No game active.</div>
    }

  };

  return (
      <>
        <div class="font-font flex h-screen w-screen place-content-center items-center transition-all duration-300 ease-in">
          <div class="max-h-[54rem] max-w-[72rem] rounded-md" style="background: radial-gradient(100% 100% at 50% 0%, rgb(5, 20, 31) 0%, rgb(5, 20, 31) 100%)">
            <div class="flex w-full items-center gap-3 p-3">
              <img src={controller} />
              <div class="glow text-mediumspringgreen-100 font-semibold">
                {name}
              </div>
              <div class="text-xs text-white opacity-[0.55]">{description}</div>
            </div>
              {currentMiniGame[useConfig().active.length > 0 ? useConfig().active : "default"].component()}
            <div class="h-2 w-full overflow-hidden rounded-bl-md rounded-br-md bg-gray-800">
                <div class="h-full rounded-sm transition-all" style={{ "transition-timing-function" : "cubic-bezier(0, 0, 0.5, 1)", background: "orangered", width: time()+ "%" }}></div>
            </div>
          </div>
        </div>
      </>
  );
}
