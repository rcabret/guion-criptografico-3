import { MatrixCanvas } from "./canvas.js";

const canvas = new MatrixCanvas({ terminalHeight: 80 });
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
export const getSquareCoordinates = (ele, radius) => {
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

export const isMobile = () => {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};
