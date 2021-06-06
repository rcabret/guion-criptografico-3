import { MatrixCanvas } from "./canvas.js";

const canvas = new MatrixCanvas();
const max_x = canvas.getRowLength();
const max_y = canvas.getNumOfRows();

/**
 *
 * @param el
 * @param step
 * @returns {((number|*)[]|*[]|(*|number)[]|(*|number)[]|(number|number)[])[]}
 */
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

  for (let i = 0; i < perimeter - 1; i++) {
    const [x, y] = equations[cornerCounter];
    const [newX, newY] = sP[i];
    sP.push([newX + x, newY + y]);
    cornerCounter =
      (i + 1) % (radius * 2) === 0 ? cornerCounter + 1 : cornerCounter;
  }
  return sP;
};

/**
 *
 * @returns {string}
 */
export const getRandomASCII = () => {
  const random_ascii = Math.floor(Math.random() * 25 + 97);
  return String.fromCharCode(random_ascii);
};

export const getIndex = (idx, len) => {
  return idx + 1 < len ? idx + 1 : 0;
};

/**
 *
 * @param a
 * @returns {*}
 */
export const vectorToLinear = ([x, y]) => {
  return y * max_x + x;
};

/**
 *
 * @param pos
 * @returns {[(*|number), number]}
 * @constructor
 */
export const LinearToVector = (pos) => {
  const y = Math.floor(pos / max_x);
  const x = pos < max_x ? pos : Math.floor(pos - max_x * y);
  return [x, y];
};

/**
 *
 * @param vector
 * @returns {HTMLElement}
 */
export const getElementFromVector = (vector) => {
  let [x, y] = vector;
  x = _normalize(x, max_x);
  y = _normalize(y, max_y);
  return document.getElementById(`${x}_${y}`);
};

/**
 *
 * @param el
 * @returns {[number, number]}
 */
export const getVectorFromElement = (el) => {
  const id = el.id;
  let [x, y] = id.split("_");
  return [parseInt(x), parseInt(y)];
};

/**
 *
 * @param min
 * @param max
 * @returns {*}
 */
export const randomNumber = (min, max) => {
  return Math.random() * (max - min) + min;
};

/**
 *
 * @param number
 * @param max
 * @returns {number|*}
 * @private
 */
const _normalize = (number, max) => {
  if (number > max - 1 && number > 0) {
    return Math.abs(number - max);
  } else if (number < 0) {
    return Math.abs(max + number);
  } else {
    return number;
  }
};

/**
 *
 * @param encryptedHashString
 * @returns {*[] | undefined}
 */
export const buildAndGetDispatchingArray = (encryptedHashString) => {
  if (!encryptedHashString.length) {
    return;
  }

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
