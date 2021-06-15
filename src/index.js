import "assets/main.css";

import {
  randomNumber,
  getElementFromVector
} from "./modules/utils";

import { MatrixCanvas } from "./modules/canvas.js";


import Terminal from "./modules/terminal";
import CanvasConfig from "./modules/config-service";
import { handleConfigChange, handleKeyPress } from "./modules/key-reader";

const config = new CanvasConfig();
let canvas, terminal, numOfRows, rowLength;

const encryptionSequence = (element, codecArray, cipherChar, tracker = 0) => {
  const scale = config.getScale();
  console.log('ee', config.getConfig());

  const initialElement = !element
    ? getElementFromVector([
        Math.floor(randomNumber(0, rowLength - 1)),
        Math.floor(randomNumber(0, numOfRows - 1)),
      ])
    : element;

  const step = (el) => {
    try {
      if (el.hasAttribute("hello")) {
        let visited = parseFloat(el.getAttribute("hello"));
        let newScale = visited + 0.02;
        el.setAttribute("hello", newScale);
      } else {
        el.setAttribute("hello", 0);

        // Tracker draw
        if (typeof config.getStep() === "function") {
          config.getStep()(el, scale);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onEnd = (el) => {
    // Update terminal progress
    terminal.updateLastCommand(
      `> creating composition from ciphertext: ${Math.round(
        (tracker / cipherChar) * 100
      )}%`
    );

    // Recursion is DONE
    if (tracker === cipherChar) {
      terminal.addStringToCommandHistory(`> done creating composition`);
    }

    // Recursion continues
    if (tracker + 1 <= cipherChar) {
      // But draw some stuff if config has something to draw
      if (typeof config.getEnd() === "function") {
        config.getEnd()(el, scale);
      }
      // Recursion point
      encryptionSequence(el, codecArray, cipherChar, tracker + 1);
    }
  };

  // Get direction of crawl based on codecArray differential value.
  const direction = codecArray[tracker] > 0 ? 1 : -1;

  if (typeof config.getTracker() === "function") {
    config.getTracker()(initialElement, step, onEnd, direction);
  }
};

const main = async () => {
  document.addEventListener("DOMContentLoaded", () => {
    // Creating canvas matrix and terminal
    canvas = new MatrixCanvas();
    canvas.init({ terminalHeight: 200 });
    rowLength = canvas.getRowLength();
    numOfRows = canvas.getNumOfRows();
    terminal = new Terminal(200);
    terminal.init();
  });
};

main().then(() => {
  // Key down event
  // Listens to keyboard, typing
  window.addEventListener("keydown", (e) => {
    if (e.code === "Enter") {
      // On Enter
      if (!terminal) {
        return;
      }
      const value = terminal.getInputValue();

      // Handling config change, matching flag symbols
      if (value.includes("--")) {
        handleConfigChange(value, config, terminal);
        return;
      }

      // Handling the rest of key press
      handleKeyPress(value, canvas, terminal, encryptionSequence);
    }
  });

  // Click event
  document.addEventListener("click", (e) => {
    // Do something
  });
});
