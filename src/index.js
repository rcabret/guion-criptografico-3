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

// Updates dimension number of cells on window resize
let activeResizing;
window.addEventListener("resize", () => {
  clearTimeout(activeResizing);
  activeResizing = setTimeout(() => {
    //runProgram();
  }, 100);
});

let typedString = "";
const printCharToMatrix = (letter, string, index) => {
  const currentIndex = index !== undefined ? index : string.length - 1;
  document.getElementById(`id_${currentIndex}`).innerHTML = letter;
};

const runEncryptionSequence = () => {
  const commandLineInputValue = terminal.getInputValue();
  terminal.addExecutedCommandToHistory(commandLineInputValue);

  if (commandLineInputValue.length) {
    const passPhrase = Sha256("temp_passphrase");
    const encrypted = AES.encrypt(commandLineInputValue, passPhrase.toString());
    terminal.addStringToCommandHistory(`> aes-chipertext: ${encrypted}`);
    const codecArray = buildAndGetDispatchingArray(encrypted.toString());

    // Get first
    encryptSeq2(passPhrase[0], null, null, codecArray);
  }
};

/**
 * Init sequence
 * Generates the grid in the html document
 * @return {void}
 */
let cellCount;
let terminal;
const runProgram = () => {
  const canvas = new MatrixCanvas();
  canvas.init();
  cellCount = canvas.getCellCount();
  terminal = new Terminal();
  terminal.init();
};

const scale = chroma.cubehelix().lightness([0, 1]);

const encryptSeq2 = (cipherChar, element, tracker = 0, codecArray) => {
  const initialElement = !element
    ? getElementViaPosition(Math.floor(randomNumber(0, cellCount)))
    : element;

  // Get direction of crawl based on codecArray differential value.
  const direction = codecArray[tracker] > 0 ? 1 : -1;

  trajectoryMove(
    initialElement,
    direction,
    15,
    (e, i) => {
      if (e.hasAttribute("hello")) {
        let visited = parseFloat(e.getAttribute("hello"));
        let newScale = visited + 0.02;
        e.setAttribute("hello", newScale);
      } else {
        e.setAttribute("hello", 0);
        e.classList.add("grow");
        e.style.background = scale(i / 20);
      }
    },
    (el) => {
      if (codecArray[tracker + 1]) {
        encryptSeq2("a", el, tracker + 1, codecArray);
        const callback = (el) => {
          el.style.background = "#F8E2DAFF";
        };

        const endCallback = (el) => {};

        startASCIIExplosion(el, 5, callback);

        return;
        createRandomLandscape(
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
        );
      }
    },
    30
  );
};

const main = async () => {
  document.addEventListener("DOMContentLoaded", () => {
    runProgram();

    window.addEventListener("keydown", (e) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
      }
      if (e.code === "Enter") {
        if (terminal && terminal.getInputValue() === "clear") {
          terminal.addExecutedCommandToHistory('clear');
          deleteEverythingButMe();
          return;
        }
        runEncryptionSequence();
      }
    });
  });
};

main().then(() => {
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
