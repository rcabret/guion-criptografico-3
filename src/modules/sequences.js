import {
  getNeighborsByStep,
  move,
  getIndex,
  getRing,
  getElementViaPosition,
  getPositionInMatrix,
  LinearToVector,
  vectorToLinear,
  getCharsMap,
  randomNumber,
} from "./utils.js";
import { rowLength, text2 } from "./constants";

const loadingString = ["—", "/", "|", "\\"];

/** Element mutations **/
export const startASCIILoader = (ele, loopCount = 4, time, onEndCallback) => {
  let i = 1;
  let counter = 0;
  const interval = setInterval(() => {
    counter++;
    //e.target.innerText = string.charAt(Math.floor(Math.random() * string.length));
    if (ele === undefined) {
      return;
    }
    ele.innerText = loadingString[i];
    i = getIndex(i, loadingString.length);
    if (counter > loopCount) {
      clearInterval(interval);
      if (onEndCallback) {
        onEndCallback(ele);
      }
    }
  }, time);
};

export const startASCIIExplosion = (
  ele,
  loopCount,
  callback,
  onEndCallback,
  onStartCallback
) => {
  let counter = 0;

  if (onStartCallback) {
    onStartCallback(ele);
  }

  const interval = setInterval(() => {
    counter++;
    getNeighborsByStep(ele, counter, loopCount, callback, onEndCallback);
    if (counter >= loopCount) {
      clearInterval(interval);
    }
  }, 50);
};

export const drawRing = (ele, step, callback) => {
  const coordinates = getRing(ele, step);

  coordinates.forEach((x) => {
    if (x > 0) {
      const ele = getElementViaPosition(x);
      if (!ele) {
        return;
      }
      // Execute every step
      callback(ele);
    }
  });
};

export const expandRing = (ele, startingPoint, loopCount, speed) => {
  let i = startingPoint;
  const interval = setInterval(() => {
    i++;
    drawRing(ele, i, (e) => {
      ele.style.color = "#ebc4ca";
      e.innerText = "tu";
    });
    drawRing(ele, i - 1, (e) => {
      e.innerText = "";
    });
    if (i === startingPoint + loopCount) {
      clearInterval(interval);
    }
  }, speed);
};

/**
 * Moves in straight line in a certain direction
 *
 * @param ele
 * @param loopCount
 * @param callback
 * @param onEndCallback
 */
export const moveSequence = (ele, loopCount, callback, onEndCallback) => {
  let count = 0;
  // random direction
  const d = Math.floor(Math.random() * 8) + 1;
  let interval = setInterval(() => {
    const x = move(ele, d, count);
    const el = document.getElementById(`id_${x}`);
    if (el && callback) {
      callback(el, count);
    }
    count++;
    if (count > loopCount) {
      clearInterval(interval);
      if (onEndCallback) {
        onEndCallback(el);
      }
    }
  }, 50);
};

export const trajectoryMove = (
  ele,
  trajectory,
  loopCount,
  callback,
  onEndCallback,
  time = 10
) => {
  const numPos = getPositionInMatrix(ele);
  let count = 0;
  let vector = LinearToVector(numPos);
  let mathPre;

  // So ghetto
  if (trajectory) {
    mathPre = trajectory;
  } else {
    do {
      mathPre = Math.round(randomNumber(-1, 2));
    } while (mathPre === 0);
  }
  // ghetto

  const interval = setInterval(() => {
    const id = vectorToLinear(vector);
    const el = document.getElementById(`id_${id}`);
    if (el && callback) {
      callback(el, count);
    }
    const x = vector[0] - mathPre * Math.floor(count * 0.25);
    const y = vector[1] - mathPre * Math.round(Math.random());
    vector = [x, y];
    count++;

    if (count > loopCount) {
      clearInterval(interval);
      if (onEndCallback) {
        onEndCallback(el, count);
      }
    }
  }, time);
};

let c = 0;
export const trappedInSquare = (ele) => {
  //e.target.innerText = loadingString[0];
  //e.target.classList.add('active');

  let timer;
  c++;
  clearTimeout(timer);
  timer = setTimeout(() => {
    c = 0;
  }, 500);
  if (c > 1 && c < 4) {
    expandRing(ele, 4, 10, 50);
    startASCIILoader(ele, 4, 50);
  }
  if (c > 5) {
    expandRing(ele, 1, 10, 50);
  }
  ele.style.color = "#4274eb";
  ele.innerText = "yo";

  drawRing(ele, 1, (el) => {
    //ele.style.color = '#ebc4ca';
    el.innerText = "tu";
  });

  drawRing(ele, 2, (el) => {
    //ele.style.color = '#ebc4ca';
    el.innerText = "tu";
  });

  drawRing(ele, 7, (el) => {
    //ele.style.color = '#ebc4ca';
    el.innerText = "tu";
  });
};

/** Entire matrix mutations*/
export const glitch = (querySelector) => {
  const all = document.querySelectorAll(querySelector);
  all.forEach((e, i) => {
    setTimeout(() => {
      e.innerHTML = "|";
      e.style.color = "#edb367";
      setTimeout(() => {
        e.style.color = "violet";
        e.innerHTML = "-";
      }, 400);
      setTimeout(() => {
        e.innerHTML = " ";
      }, 600);
      setTimeout(() => {
        e.style.color = "#faf9ac";
      }, Math.random() * 1000);
      setTimeout(() => {
        e.style.color = "#edb367";
      }, Math.random() * 1000);
    }, Math.random() * i * 0.1);
  });
};

/**
 * Traverses the screen uses random bezier paths
 *
 * @param ele
 */
const shimmerSequence = (ele) => {
  const charsArr = getCharsMap(text2, 700);
  const loopCount = rowLength;
  const pos = getPositionInMatrix(ele);
  let v = LinearToVector(pos);
  let count = 0;
  let int = setInterval(() => {
    const cp = vectorToLinear(v);
    const el = getElementViaPosition(cp);
    const len = Math.floor(Math.random() * 20);
    trajectoryMove(el, null, len, (e) => {
      e.style.color = "white";
      startASCIILoader(e, 8, 10, (elj) => {
        elj.style.color = "violet";
        elj.innerHTML = "-";
        setTimeout(() => {
          startASCIILoader(elj, 4, 50, (ey) => {
            ey.style.color = "blue";
            const pos = getPositionInMatrix(ey);
            const t = charsArr["id_" + pos] ? charsArr["id_" + pos] : "";
            ey.innerHTML = t;
          });
        }, 1500);
      });
    });
    v[0] = v[0] + 1;
    count++;
    if (count > loopCount) {
      clearInterval(int);
    }
  }, 100);
};

export const deleteEverythingButMe = (ele, querySelector) => {
  const all = document.querySelectorAll(querySelector);
  all.forEach((e, i) => {
    setTimeout(() => {
      if (e.id !== ele.id) {
        e.innerText = "";
      }
    }, Math.random() * i * 0.5);
  });
};

export const moveWithStyle = (ele, hello) => {};
