import {
  getIndex,
  getElementViaPosition,
  getPositionInMatrix,
  LinearToVector,
  vectorToLinear,
  getCharsMap,
  randomNumber,
  getElementFromVector,
  getVectorFromElement,
  getEveryOtherNeighborsByStep,
  getRingTwo,
  getRing,
} from "./utils.js";
import { MatrixCanvas, text2 } from "./canvas";

const canvas = new MatrixCanvas();
const rowLength = canvas.getRowLength();
const loadingString = "-/|\\";

/** Element mutations **/
export const startASCIILoader = (
  ele,
  loopCount = 6,
  time = 20,
  onEndCallback
) => {
  let i = 1;
  let counter = 0;

  const step = () => {
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
  };

  const interval = setInterval(step, time);
};

export const startASCIIExplosion = (
  ele,
  callback,
  onEndCallback,
  onStartCallback,
  loopCount = 5
) => {
  if (onStartCallback) {
    onStartCallback(ele);
  }

  let counter = 0;
  const step = () => {
    counter++;
    const arr = getEveryOtherNeighborsByStep(ele, counter);

    // Loop over coordinates
    arr.forEach((v) => {
      const ele = getElementFromVector(v);
      if (!ele) {
        return;
      }
      // Execute every step
      callback(ele, counter);

      // Execute at the end of all steps
      if (counter >= loopCount && onEndCallback) {
        onEndCallback(ele, counter);
      }
    });

    if (counter >= loopCount) {
      clearInterval(interval);
    }
  };

  const interval = setInterval(step, 50);
};

export const drawRing = (ele, step, callback) => {
  const coordinates = getRing(ele, step);

  coordinates.forEach((v, i) => {
    if (v.length && i > 0) {
      const ele = getElementFromVector(v);
      if (ele && callback) {
        // Execute every step
        callback(ele, i);
      }
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

export const trajectoryMove = (
  ele,
  trajectory,
  loopCount,
  callback,
  onEndCallback,
  time = 30
) => {
  let count = 0;
  let mathPre;
  let vector = getVectorFromElement(ele);

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
    const el = getElementFromVector(vector);
    if (el && callback) {
      callback(el, count);
    }
    //TODO: Revise this movement
    let [x, y] = vector;
    x = x - mathPre * Math.floor(count * 0.25);
    y = y - mathPre * Math.round(Math.random());
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

export const deleteEverythingButMe = (querySelector = "pre span", ele) => {
  const all = document.querySelectorAll(querySelector);
  all.forEach((e, i) => {
    setTimeout(() => {
      if (ele === undefined || (ele && e.id !== ele.id)) {
        e.innerText = "";
        e.style.background = "none";
        e.removeAttribute("hello");
      }
    }, Math.random() * i * 0.5);
  });
};

export const createRandomLandscape = (
  el,
  callback,
  ratio = () => {},
  amplitude = 0,
  range = 10
) => {
  let vector = getVectorFromElement(el);

  for (let i = 0; i < range; i++) {
    const ele = getElementFromVector(vector);
    let [x, y] = vector;

    if (callback && ele) {
      callback(ele, i);
    }

    const mutation = Math.floor(i * ratio + amplitude);
    for (let j = 0; j < mutation; j++) {
      vector[1] = --vector[1];
      const newEl = getElementFromVector(vector);
      if (callback && newEl) {
        callback(newEl, j);
      }
    }

    // Move x one to the right
    vector = [x + 1, y];
  }
};
