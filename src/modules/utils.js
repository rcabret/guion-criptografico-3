/**
 *
 * @param ele
 * @param step
 * @param loopCount
 * @param callback
 * @param onEndCallback
 *s
 * TODO: Will accept a 'neighborStepCallback,  change callback to 'onEndCallback'
 */
import { MatrixCanvas } from "./canvas.js";

const canvas = new MatrixCanvas();
const rowLength = canvas.getRowLength();
const rows = canvas.getNumOfRows();

export const getEveryOtherNeighborsByStep = (el, step) => {
  const [x, y] = getVectorFromElement(el);
  return [
    [x, y + step],
    [x + step, y + step],
    [x + step, y],
    [x + step, y - step],
    [x, y - step],
    [x - step, y - step],
    [x - step, y],
    [x - step, y + step],
  ];
};

/**
 *  Square around element
 * @param ele
 * @param radius
 * @returns {*[]}
 */
export const getRing = (ele, radius) => {
  const [x, y] = getVectorFromElement(ele);
  const equations = [
    [0, 1],
    [-1, 0],
    [0, -1],
    [1, 0],
  ];
  const perimeter = radius * 8;
  let cornerCounter = 0;
  let sP = [[x + radius, y - radius]];

  //getElementFromVector(sP[0]).style.background = "red";

  for (let i = 0; i < perimeter - 1; i++) {
    const [x, y] = equations[cornerCounter];
    const [newX, newY] = sP[i];
    sP.push([newX + x, newY + y]);

    cornerCounter =
      (i + 1) % (radius * 2) === 0 ? cornerCounter + 1 : cornerCounter;
  }
  return sP;
};

/** Misc Utils  **/
export const getRandomASCII = () => {
  const random_ascii = Math.floor(Math.random() * 25 + 97);
  return String.fromCharCode(random_ascii);
};

export const getIndex = (idx, len) => {
  return idx + 1 < len ? idx + 1 : 0;
};

let lastClicked = [];
export const neighborAwareClick = (e) => {
  if (e) {
    const ele = e.target;
    const cp = Number(ele.id.replace("id_", ""));
    lastClicked.push(cp);
  }
};

export const checkForNeighbors = (cp, clickHistoryArray) => {
  clickHistoryArray.forEach((e) => {
    /* if(cp > )*/
  });
};

/**
 *
 * @param a
 * @returns {*}
 */
export const vectorToLinear = ([x, y]) => {
  return y * rowLength + x;
};

export const LinearToVector = (pos) => {
  const y = Math.floor(pos / rowLength);
  const x = pos < rowLength ? pos : Math.floor(pos - rowLength * y);
  return [x, y];
};

const _normalize = (number, max) => {
  if (number > max && number > 0) {
    return Math.abs(number - max);
  } else if (number < 0) {
    return Math.abs(max + number);
  } else {
    return number;
  }
};

export const getElementFromVector = (vector) => {
  let [x, y] = vector;
  x = _normalize(x, rowLength);
  y = _normalize(y, rows);
  return document.getElementById(`${x}_${y}`);
};

export const getVectorFromElement = (el) => {
  const id = el.id;
  let [x, y] = id.split("_");
  return [parseInt(x), parseInt(y)];
};

/** Debounce for later **/
export const debounce = (func, wait, immediate) => {
  let timeout;
  return () => {
    let context = this;
    let args = this.arguments;
    let later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

export const getCharsMap = (str, start) => {
  let map = {};
  for (let i = 0; i < str.length; i++) {
    map["id_" + (i + start)] = str.charAt(i);
  }
  return map;
};

export const randomNumber = (min, max) => {
  return Math.random() * (max - min) + min;
};

/**
 * Checks if ele is at a certain perimeter from secondEle
 *
 * @param ele
 * @param secondEle
 * @returns {boolean}
 */
export const areClose = (ele, secondEle) => {
  if (secondEle !== undefined) {
    const perimeter = getRing(secondEle, 2);
    const currentPosition = getVectorFromElement(ele);
    return perimeter.includes(currentPosition);
  }
};

export const buildAndGetDispatchingArray = (encryptedHashString) => {
  if (!encryptedHashString.length) {
    return;
  }
  //encryptedHashArray.reduce(())

  let outputArray = [];
  const encryptionArray = encryptedHashString.split("");
  for (let i = 0; i < encryptionArray.length; i++) {
    if (i + 1 < encryptionArray.length) {
      const a = encryptionArray[i].charCodeAt(0);
      const b = encryptionArray[i + 1].charCodeAt(0);
      const calculatedValue = a - b;
      outputArray.push(calculatedValue);
    }
  }

  return outputArray;
};
