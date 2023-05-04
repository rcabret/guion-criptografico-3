import "assets/main.css";

import { randomNumber, getElementFromVector } from "./modules/utils";

import { MatrixCanvas } from "./modules/canvas.js";

import Terminal from "./modules/terminal";
import CanvasConfig from "./modules/config-service";
import {
  _azar,
  handleConfigChange,
  handleKeyPress,
} from "./modules/key-reader";
import { deleteEverythingButMe } from "./modules/sequences";
import { terminalHeight } from "./constants";
import Login from "./components/Login";

const config = new CanvasConfig();
let canvas, terminal, numOfRows, rowLength;
let runTracker = 1;
const encryptionSequence = (element, codecArray, cipherChar, tracker = 0) => {
  const scale = config.getScale();
  const alpha = parseFloat(config.getAlpha());

  const initialElement = !element
    ? getElementFromVector([
        Math.floor(randomNumber(0, rowLength - 1)),
        Math.floor(randomNumber(0, numOfRows - 1)),
      ])
    : element;

  // Run in every tracker function position
  const step = (el, i) => {
    try {
      if (el.hasAttribute("hello")) {
        let visited = parseFloat(el.getAttribute("hello"));
        let newScale = visited + 0.02;
        el.setAttribute("hello", newScale);
      } else {
        el.setAttribute("hello", 0);
        // Tracker draw
        if (typeof config.getStep().func === "function") {
          const step = config.getStep();
          if (step.name === "glitch" || step.name === "skin_glitch") {
            step.func(el, i);
          } else {
            step.func(el, scale, i, alpha);
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Runs on End of entire tracker move
  const onEnd = (el, i) => {
    // Update terminal progress
    terminal.updateLastCommand(
      `> creating composition from ciphertext: ${Math.round(
        (tracker / 23) * 100
      )}%`
    );

    let running = true;
    // Recursion is DONE
    if (tracker % 19 === 0 && tracker !== 0) {
      running = false;
      tracker = 0;
      terminal.updateLastCommand(`> done creating composition`);
    }

    if (tracker % 5 === 0) {
      // randomize from shapes map
      _azar(config);
    }

    if (typeof config.getEnd() === "function") {
      config.getEnd()(el, scale, i, alpha);
    }

    // Recursion continues
    if (running) {
      // But draw some stuff if config has something to draw
      // Recursion point
      encryptionSequence(el, codecArray, cipherChar, tracker + 1);
    } else {
      runTracker++;
      // Stop picture for 3.5 seconds and reset lock

      const nextCipher =
        cipherChar.length > 50 ? cipherChar.substring(0, 25) : cipherChar;

      setTimeout(() => {
        running = true;
        deleteEverythingButMe();
        handleKeyPress(
          nextCipher,
          config,
          canvas,
          terminal,
          encryptionSequence
        );
        //encryptionSequence(el, codecArray, cipherChar, tracker + 1);
      }, 3500);
    }
  };

  // Get direction of crawl based on codecArray differential value.
  const direction = codecArray[tracker] > 0 ? 1 : -1;

  if (typeof config.getTracker() === "function") {
    config.getTracker()(initialElement, step, onEnd, direction);
  }
};

const initApp = () => {
  const main = async () => {
    canvas = new MatrixCanvas({ terminalHeight: terminalHeight });
    canvas.init();
    rowLength = canvas.getRowLength();
    numOfRows = canvas.getNumOfRows();
    terminal = new Terminal(terminalHeight);
    terminal.init();
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
        const wordCount = value.split(" ").length;

        // Handling config change, matching flag symbols
        if (value.includes("--") && wordCount <= 2) {
          handleConfigChange(value, config, canvas, terminal);
          return;
        }

        // Handling the rest of key press
        handleKeyPress(value, config, canvas, terminal, encryptionSequence);
      }
    });
    // Click event
    document.addEventListener("click", (e) => {
      // Do something
    });
  });
};

Login(initApp);
