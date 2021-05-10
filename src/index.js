import "assets/main.css";

import {
  getElementViaPosition,
  randomNumber,
  buildAndGetDispatchingArray,
} from "./modules/utils";

import {
  MatrixCanvas,
} from "./modules/constants.js";

import AES from "crypto-js/aes";
import Sha256 from "crypto-js/sha256";

import {trajectoryMove, startASCIILoader, createRandomLandscape, startASCIIExplosion} from "./modules/sequences";

import * as chroma from "chroma-js";

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
  if (typedString.length) {
    const passPhrase = Sha256("temp_passphrase");
    const encrypted = AES.encrypt(typedString, passPhrase.toString());
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

const runProgram = () => {
  const canvas = new MatrixCanvas();
  canvas.init();
  cellCount = canvas.getCellCount();
};

const scale = chroma.scale('OrRd');

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
    (e) => {
      if (e.hasAttribute("hello")) {
        let visited = parseFloat(e.getAttribute("hello"));
        let newScale = visited + 0.02;
        e.setAttribute("hello", newScale);
      } else {
        e.setAttribute("hello", 0);
        e.classList.add("grow");
      }
    },
    (el) => {
      if (codecArray[tracker + 1]) {
        encryptSeq2("a", el, tracker + 1, codecArray);
        const callback = (el) => {
          //el.style.background = 'lightblue';
          createRandomLandscape(el, (e, i) => {
            setTimeout(()=> {
              e.classList.add("grow");
              //e.style.background = scale(i/20)
            }, i * 50)
          }, 1,0, 4);
        }
        startASCIIExplosion(el, 15, callback);
        /*createRandomLandscape(el, (e, i) => {
          setTimeout(()=> {
            //e.classList.add("grow");
            e.style.background = scale(i/20)
          }, i * 50)
        }, 1,0, 20);*/
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
        runEncryptionSequence();
        return;
      }
      if (e.code.indexOf("Key") > -1 || e.code === "Space") {
        typedString += e.key;
        printCharToMatrix(e.key, typedString);
      }
    });
  });
};

main().then(()  => {
  document.addEventListener('click', (e)=> {
    createRandomLandscape(e.target, (el, i) => {
      setTimeout(()=> {
        //el.classList.add("grow");
        el.style.background = 'blue';
      }, i * 50)
    }, 1,0, 10);
  })

});
