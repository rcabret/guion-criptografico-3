import "assets/main.css";

import {
  getElementViaPosition,
  randomNumber,
  buildAndGetDispatchingArray,
} from "./modules/utils";

import { MatrixCanvas } from "./modules/constants.js";

import AES from "crypto-js/aes";
import Sha256 from "crypto-js/sha256";

import {
  trajectoryMove,
  createRandomLandscape,
  startASCIIExplosion,
  deleteEverythingButMe,
} from "./modules/sequences";

import * as chroma from "chroma-js";
import { Terminal } from "./modules/terminal";

let cellCount;
let terminal;
let canvas;
const scale = chroma.cubehelix().lightness([0, 1]);

const encryptionSequence = (cipherChar, codecArray, element, tracker = 0) => {
  const initialElement = !element
    ? getElementViaPosition(Math.floor(randomNumber(0, cellCount)))
    : element;

  // Get direction of crawl based on codecArray differential value.
  const direction = codecArray[tracker] > 0 ? 1 : -1;

  const onStep = (el, i) => {
    if (el.hasAttribute("hello")) {
      let visited = parseFloat(el.getAttribute("hello"));
      let newScale = visited + 0.02;
      el.setAttribute("hello", newScale);
    } else {
      el.setAttribute("hello", 0);
      el.classList.add("grow");
      el.style.background = scale(i / 20);
    }
  };

  const onEnd = (el) => {
    // Recursion is DONE
    if (tracker === codecArray.length - 1) {
      terminal.addStringToCommandHistory(`> done`);
      return;
    }

    // Recursion continues
    if (codecArray[tracker + 1] !== undefined) {
      // Continue recursion
      encryptionSequence("a", codecArray, el, tracker + 1);
      const callback = (el) => {
        el.style.background = "#F8E2DAFF";
      };

      // Mark point of recursion start
      startASCIIExplosion(el, 5, callback);

      /*createRandomLandscape(
          el,
          (e, i) => {
            setTimeout(() => {
              e.classList.add("grow");
              if (!e.hasAttribute("hello")) {
                e.style.background = scale(i / 10);
              }
            }, i * 50);
          },
          0.5,
          0,
          35
      );*/
    }
  };

  trajectoryMove(initialElement, direction, 15, onStep, onEnd, 50);
};

const main = async () => {
  document.addEventListener("DOMContentLoaded", () => {
    // Creating canvas matrix and terminal
    canvas = new MatrixCanvas();
    canvas.init();
    cellCount = canvas.getCellCount();
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
      switch (value) {
        // Clear background on cells
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
            terminal.addStringToCommandHistory(`> creating composition...`);
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
    createRandomLandscape(
      e.target,
      (el, i) => {
        setTimeout(() => {
          el.style.background = "blue";
        }, i * 30);
      },
      1,
      0,
      10
    );
  });
});
