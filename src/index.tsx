import { render } from 'solid-js/web';
import { Show } from 'solid-js';
import App from "./components/main";


import "./index.css";
import {Provider, useConfig} from "./lib/store";

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

render(() => (
  <Provider>
    <Show when={useConfig().show}>
      <App />
    </Show>
  </Provider>
), root!);
