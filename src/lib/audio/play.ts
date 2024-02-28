import finsh from "../../assets/finish1.wav";
import string from "../../assets/string.mp3";


export const isFinshed = (state) => {
  const sound = new Audio(state ? finsh : string);
  sound.volume = state ? 0.1 : 0.05;
  sound.controls = false;
  sound.play();
  setTimeout(() => {
    sound.remove();
  }, 300);
};
