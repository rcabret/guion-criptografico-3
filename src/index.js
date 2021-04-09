import "assets/main.css";

import { getElementViaPosition, randomNumber } from "./modules/utils";

import {
  borderColor,
  borderWidth,
  cellWidth,
  cellHeight,
  rowLength,
  numOfRows,
} from "./modules/constants.js";

import AES from "crypto-js/aes";
import Sha256 from "crypto-js/sha256";

import { trajectoryMove, startASCIILoader } from "./modules/sequences";

import * as chroma from "chroma-js";

// Matrix selector
const cellSelector = "cell";
let numberOfCellsNeeded;

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
    const password = Sha256("temp_password");
    const encrypted = AES.encrypt(typedString, password.toString());
    let directionMap = [];
    const encryptionArray = encrypted.toString().split("");

    for (let i = 0; i < encryptionArray.length; i++) {
      if (i + 1 < encryptionArray.length) {
        const a = encryptionArray[i].charCodeAt(0);
        const b = encryptionArray[i + 1].charCodeAt(0);
        const calculatedValue = a - b;
        directionMap.push(calculatedValue);
      }
    }

    encryptSeq2("a", null, null, directionMap);

    //runChipherText(encrypted.toString());
    //encryptSeq2(encrypted[0]);
    /*let ASCII = [];
		encrypted.toString().split('').forEach((letter, i) => {
			const el = getElementViaPosition(letter.charCodeAt(0));
			el.style.background = 'blue';
		});

		console.log(ASCII);
		const decrypted = AES.decrypt(encrypted, 'password');
		console.log(encrypted.toString(), 'dec', decrypted.toString(), 'hash-dec', decrypted.toString(encUtf8));*/
  }
};

/**
 * Init sequence
 * Generates the grid in the html document
 * @return {void}
 */
const runProgram = () => {
  const parent = document.querySelector("#content");
  parent.innerHTML = ""; // Clear container
  numberOfCellsNeeded = Math.floor(rowLength * numOfRows);

  for (let i = 0; i < numberOfCellsNeeded; i++) {
    const node = document.createElement("div");
    node.className = cellSelector;
    node.id = `id_${i}`;
    node.style.width = `${cellWidth}px`;
    node.style.height = `${cellHeight}px`;
    if (borderWidth > 0) {
      node.style.border = `${borderWidth}px solid ${borderColor}`;
    }
    node.innerHTML = "&nbsp;";
    parent.append(node);
  }
};

const scale = chroma.scale();

const encryptSeq2 = (cipherChar, element, tracker = 0, codecArray) => {
  const initialElement = !element
    ? getElementViaPosition(Math.floor(randomNumber(0, numberOfCellsNeeded)))
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
      }
    },
    30
  );
};

const main = async () => {
  const div = document.createElement("div");
  const backdrop = document.createElement("div");
  div.id = "content";
  backdrop.id = "backdrop";
  document.querySelector("body").appendChild(div);
  document.querySelector("body").appendChild(backdrop);
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

main().then(() => console.log("Started"));
