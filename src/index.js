import "assets/main.css";

import {
  getElementViaPosition,
  randomNumber,
  buildAndGetDispatchingArray,
  getRing,
  getElementFromVector,
} from "./modules/utils";

import { MatrixCanvas } from "./modules/canvas.js";

import AES from "crypto-js/aes";
import Sha256 from "crypto-js/sha256";

import {
  trajectoryMove,
  createRandomLandscape,
  deleteEverythingButMe,
  startASCIIExplosion,
  drawRing,
} from "./modules/sequences";

import Terminal from "./modules/terminal";
import CanvasConfig from "./modules/config-service";
import { handleConfigChange } from "./modules/key-reader";

let canvas, terminal, numOfRows, rowLength;
let config = new CanvasConfig();
//let scale = config.getScale();

const encryptionSequence = (cipherChar, codecArray, element, tracker = 0) => {
  const scale = config.getScale();

  const initialElement = !element
    ? getElementFromVector([
        Math.floor(randomNumber(0, rowLength - 1)),
        Math.floor(randomNumber(0, numOfRows - 1)),
      ])
    : element;

  initialElement.style.background = "red";

  const step = (el, i) => {
    try {
      if (el.hasAttribute("hello")) {
        let visited = parseFloat(el.getAttribute("hello"));
        let newScale = visited + 0.02;
        el.setAttribute("hello", newScale);
      } else {
        el.setAttribute("hello", 0);
        //el.classList.add("grow");
        //el.style.background = scale(i / 20);
        el.style.background = "#F8E2DAFF";
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onEnd = (el) => {
    //el.style.background = "red";
    // Recursion is DONE
    if (tracker === codecArray.length - 1) {
      terminal.addStringToCommandHistory(`> done creating composition`);
      return;
    }

    // Recursion continues
    if (codecArray[tracker + 1] !== undefined) {
      // Recursion point
      encryptionSequence("a", codecArray, el, tracker + 1);

      // But draw some stuff
      config.getShape()(el, scale);
    }
  };

  // Get direction of crawl based on codecArray differential value.
  const direction = codecArray[tracker] > 0 ? 1 : -1;

  trajectoryMove(initialElement, direction, 15, step, onEnd, 50);
};

const main = async () => {
  document.addEventListener("DOMContentLoaded", () => {
    // Creating canvas matrix and terminal
    canvas = new MatrixCanvas();
    canvas.init();
    rowLength = canvas.getRowLength();
    numOfRows = canvas.getNumOfRows();
    terminal = new Terminal();
    terminal.init();
  });
};

main().then(() => {
  // Key down event
  window.addEventListener("keydown", (e) => {
    if (e.code === "Space" && e.target === document.body) {
      e.preventDefault();
    }
    if (e.code === "Enter") {
      if (!terminal) {
        return;
      }
      const value = terminal.getInputValue();

      // Handling config change
      if (value.includes("--")) {
        handleConfigChange(value, config, terminal);
        return;
      }

      switch (value) {
        case "clear":
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
          terminal.addExecutedCommandToHistory(value);

          if (value.length) {
            const passPhrase = Sha256("temp_passphrase");
            const encrypted = AES.encrypt(value, passPhrase.toString());
            terminal.addStringToCommandHistory(
              `> aes-chipertext: ${encrypted}`
            );
            terminal.addStringToCommandHistory(
              `> creating composition from ciphertext...`
            );
            const codecArray = buildAndGetDispatchingArray(
              encrypted.toString()
            );

            // Get first
            encryptionSequence(passPhrase[0], codecArray);
          }
          break;
      }
    }
  });

  // Click event
  document.addEventListener("click", (e) => {
    drawRing(e.target, 10, (e) => {
      e.style.background = "blue";
    });
    return;
    createRandomLandscape(
      e.target,
      (el, i) => {
        setTimeout(() => {
          el.style.background = "blue";
        }, i * 30);
      },
      0.5,
      0,
      10
    );
  });
});
