import { For, createEffect, createSignal, Show, onMount, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";

import { getRandomInt } from "../../../lib/numbers";
import { resetGame, setGameFinished, useConfig } from "../../../lib/store";

import config from "./_config";

import { isFinshed } from "../../../lib/audio/play";
import { callback } from "../../callback";

const Alphabet = () => {
  const [title, setTitle] = createSignal("");  // Success! -- Failed!
  const [success, setSuccess] = createSignal(false);

  const [words, setWords] = createStore(Array(useConfig().numKeys).fill(0).map(() => {
    return {
      latter : config().latters[getRandomInt(0, 6)],
      pressed: false,
      failed: false
    }
  }))

  const stateChange = (id: number, state) => {
    setWords((prev) => {
      const newWords = prev.map((word, index) => {
        if (index === id) {
          return { ...word, pressed: state, failed: !state};
        } else {
          return word;
        }
      });
      return newWords;
    });
  };
  
  let currentIndex = 0;
  const handleKeyDown = (e: KeyboardEvent) => {

    if (e.key === words[currentIndex]?.latter && !title()) {
      stateChange(currentIndex, true)
      isFinshed(false)

      if (currentIndex === words.length - 1) {
        setTitle("Success!");
        setSuccess(true)
        isFinshed(true)
        setGameFinished(true)
        setTimeout(() => {
          callback(true);
        }, 1000);
  
      }
      currentIndex++;
    } else {
      setTitle("Failed!");
      setSuccess(false)
      setGameFinished(true)
      stateChange(currentIndex, false)
      setTimeout(() => {
        callback(false);
      }, 1000);
    }
  };

  onMount(() => {
    document.addEventListener("keydown", handleKeyDown);

    onCleanup(() => {

      document.removeEventListener("keydown", handleKeyDown);
    });
  });
  
  return (
    <>
      <div class="flex w-[34rem] flex-col gap-2 p-2 text-[#40ADFF]">
        <div class="flex h-full w-full flex-wrap place-content-center items-center gap-2 rounded-md text-center text-4xl" style="background: radial-gradient(119.58% 127.46% at 50% 50%, rgb(9, 35, 53) 0%, rgba(9, 35, 53, 0) 100%);">
          <For each={words}>
            {({latter, pressed, failed}) => {
              const border = "1px solid " + (pressed ? "#00A178" : failed ? "#F86969" : "#0B2C45");
              const color = pressed ? "#00F8B9" : failed ? "#FFF" : "#40ADFF";
              const background = pressed ? "radial-gradient(119.58% 127.46% at 50% 50%, rgba(0, 248, 185, 0.25) 0%, rgba(0, 161, 120, 0.00) 100%)" : failed ? "radial-gradient(119.58% 127.46% at 50% 50%, #F86969 0%, rgba(9, 35, 53, 0.00) 100%)" : "radial-gradient(119.58% 127.46% at 50% 50%, #092335 0%, rgba(9, 35, 53, 0.00) 100%)";
              return (
                  <div class="flex h-20 w-20 items-center justify-center rounded-md border border-solid border-blue-500 capitalize" style={{ border: border, color: color, background: background}}>
                      {latter}
                  </div>
              )
            }}
          </For>
        </div> 
        <Show when={title()}>
          <div class={`h-6 w-full rounded-md text-center text-xl ${!success() ? "bg-red-500/20 text-red-500" : "text-mediumspringgreen-100 bg-mediumspringgreen-100/20" }`}>{title()}</div>
        </Show>
      </div>
    </>
  );
};

export default Alphabet;
