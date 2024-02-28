import { createSignal } from "solid-js";

import { getRandomInt } from "../../../lib/numbers";
import { useConfig } from "../../../lib/store";

import finsh from "../../../assets/finish1.wav"
import string from "../../../assets/string.mp3";

import Config from "./_config";
import { callback } from "../../callback";

const Words = () => {
  
  const [seen, setSeen] = createSignal([]);
  const { randomWords } = Config();
  const [currentChoice, setCurrentChoice] = createSignal(0);
  const [word, setWord] = createSignal(randomWords[getRandomInt(0, randomWords.length - 1)]);

  const isFinshed = state => {
    const sound = new Audio(state ? finsh : string);
    sound.volume = state ? 0.1 : 0.05;
    sound.controls = false;
    sound.play();
    setTimeout(() => {
      sound.remove();
    }, 300);
  };


  const isSeen = () => {
    return seen().includes(word()) ;
  }

  const pushSeen = () => {
    setSeen((prev) => {
      return [...prev, word()]
    })
  }
  const handleNew = () => {
    if (isSeen()) { 
      // failed !
      return callback(false)
    } else {
      if (currentChoice() >= useConfig().requiredCorrectChoices){

        isFinshed(true);
        callback(true)
      }else {
        isFinshed(false);
        setCurrentChoice(currentChoice() + 1);
        pushSeen();
        if (Math.random() > .5 && seen().length > 1){
          setWord(seen()[getRandomInt(0, seen().length - 1)]);
        }else {
          setWord(randomWords[getRandomInt(0, randomWords.length - 1)]);
        }
      }
    } 
  }

  const handleSeen = () => {
    if (isSeen()) {
      setCurrentChoice(currentChoice() + 1);
      
      if (currentChoice() >= useConfig().requiredCorrectChoices){
        isFinshed(true);
        callback(true)
      }else {
        isFinshed(false);
        setWord(randomWords[getRandomInt(0, randomWords.length - 1)]);
      }
    }else {
      callback(false)
    }
  }



  return (
    <>
      <div class="flex w-[32rem] flex-col p-2 text-white">
        <div class="w-full text-center">{currentChoice()}/{useConfig().requiredCorrectChoices}</div>
        <div class="flex h-24 w-full place-content-center items-center rounded-md text-center text-4xl" style="background: radial-gradient(119.58% 127.46% at 50% 50%, rgb(9, 35, 53) 0%, rgba(9, 35, 53, 0) 100%);">
          {word()}{/* {isSeen() ? "Seen" : "New"} */}
        </div>
        <div class="flex h-8 w-full gap-1">
          <div onClick={handleSeen} class="bg-darkorchid/20 text-darkorchid hover:bg-darkorchid/40 flex h-full w-full place-content-center items-center rounded-md p-1 text-center">
            Seen
          </div>
          <div onClick={handleNew} class="bg-mediumspringgreen-100/20 text-mediumspringgreen-100 hover:bg-mediumspringgreen-100/40 flex h-full w-full place-content-center items-center rounded-md p-1 text-center">
            New
          </div>
        </div>
      </div>
    </>
  );
};

export default Words;
