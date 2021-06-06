import "assets/main.css";

import {
  randomNumber,
  buildAndGetDispatchingArray,
  getElementFromVector,
  getVectorFromElement,
} from "./modules/utils";

import { MatrixCanvas } from "./modules/canvas.js";

import AES from "crypto-js/aes";
import Sha256 from "crypto-js/sha256";

import {
  trajectoryMove,
  deleteEverythingButMe,
  createCircle,
} from "./modules/sequences";

import Terminal from "./modules/terminal";
import CanvasConfig from "./modules/config-service";
import { handleConfigChange } from "./modules/key-reader";

let canvas, terminal, numOfRows, rowLength;
let config = new CanvasConfig();

const encryptionSequence = (element, codecArray, cipherChar, tracker = 0) => {
  const scale = config.getScale();

  const initialElement = !element
    ? getElementFromVector([
        Math.floor(randomNumber(0, rowLength - 1)),
        Math.floor(randomNumber(0, numOfRows - 1)),
      ])
    : element;

  initialElement.style.background = "orange";

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

      switch (value) {
        case "clear":
          // Clears background styles of all matrix
          terminal.addExecutedCommandToHistory(value);
          deleteEverythingButMe();
          break;
        case "reset":
          // Clear and reset canvas matrix
          terminal.addExecutedCommandToHistory(value);
          terminal.addStringToCommandHistory("> reset complete");
          canvas.init();
          break;
        default:
          // Let's encrypt some shit
          if (value.length) {
            // Write highlighted input text into terminal command history
            terminal.addExecutedCommandToHistory(
              `<span style="background: white; color: black; font-weight: 900">${value}</span>`
            );

            const passPhrase = Sha256("temp_passphrase");
            const encrypted = AES.encrypt(value, passPhrase.toString());

            // Write highlighted ciphertext into terminal command history
            terminal.addStringToCommandHistory(
              `> aes-chipertext: <span style=" font-style: italic">${encrypted}</span>`
            );

            // Create process text node to be updated with percentage during recursive crawling
            // See above `encryptionSequence` -> `end` callback
            terminal.addStringToCommandHistory(
              "> creating composition from ciphertext"
            );

            // Build and get crawler data array
            // Used to move the crawler in the matrix
            const codecArray = buildAndGetDispatchingArray(
              encrypted.toString()
            );

            // Start encryption crawler recursion
            encryptionSequence(undefined, codecArray, value.split(" ").length);
          }
          break;
      }
    }
  });

  // Click event
  document.addEventListener("click", (e) => {
    const scale = config.getScale();
    const radius = 4;
    let [x, y] = getVectorFromElement(e.target);

    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const e = getElementFromVector([(x += 5), y]);
        createCircle(e, radius, (e, i) => {
          setTimeout(() => {
            e.style.background = scale(i / (radius * 2.5));

            setTimeout(() => {
              e.style.background = "lightblue";
            }, 200);

            setTimeout(() => {
              e.style.background = "transparent";
            }, 400);
          }, i * 10);
        });
      }, i * 100);
    }
  });
});
