import {
  getIndex,
  randomNumber,
  getElementFromVector,
  getVectorFromElement,
  getEveryOtherNeighborsByStep,
  getRing,
  getSquareCoordinates,
} from "./utils.js";

const loadingString = "-/|\\";

/**
 *
 * @param ele
 * @param loopCount
 * @param time
 * @param onEndCallback
 */
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

/**
 *
 * @param ele
 * @param callback
 * @param onEndCallback
 * @param loopCount
 * @param stagger
 */
export const startASCIIExplosion = (
  ele,
  callback,
  onEndCallback,
  loopCount = 5,
  stagger = 50
) => {
  const step = (i) => {
    const arr = getEveryOtherNeighborsByStep(ele, i);

    // Loop over coordinates
    arr.forEach((v) => {
      const ele = getElementFromVector(v);

      // Execute every step
      callback(ele, i);

      // Execute at the end of all steps
      if (i >= loopCount - 1 && onEndCallback) {
        onEndCallback(ele, i);
      }
    });
  };

  for (let i = 0; i < loopCount; i++) {
    setTimeout(() => {
      step(i);
    }, i * stagger);
  }
};

/**
 *
 * @param ele
 * @param step
 * @param callback
 */
export const drawSquareOutline = (ele, step, callback) => {
  const coordinates = getSquareCoordinates(ele, step);

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

/**
 *
 * @param ele
 * @param callback
 * @param onEndCallback
 * @param trajectory
 * @param loopCount
 * @param time
 */
export const trajectoryMove = (
  ele,
  callback,
  onEndCallback,
  trajectory,
  loopCount = 15,
  time = 30
) => {
  let mathPre;
  let vector = getVectorFromElement(ele);

  // So ghetto ()setup
  if (trajectory) {
    mathPre = trajectory;
  } else {
    do {
      mathPre = Math.round(randomNumber(-1, 2));
    } while (mathPre === 0);
  }

  // Execute every step
  const step = (i) => {
    const el = getElementFromVector(vector);
    if (callback) {
      callback(el, i);
    }
    //TODO: Revise this movement
    let [x, y] = vector;
    x = x - mathPre * Math.floor(i * 0.25);
    y = y - mathPre * Math.round(Math.random());
    vector = [x, y];

    if (i === loopCount - 1 && onEndCallback) {
      onEndCallback(el, i);
    }
  };

  // Iteration
  for (let i = 0; i < loopCount; i++) {
    setTimeout(() => {
      step(i);
    }, i * time);
  }
};

/**
 *
 * @param querySelector
 * @param ele
 */
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
/**
 *
 * @param x
 * @returns {*}
 */
const defaultRatio = (x) => {
  return x;
};

/**
 *
 * @param el
 * @param callback
 * @param ratio
 * @param amplitude
 * @param range
 * @param tracker
 * @param stagger
 */
export const createGraph = (
  el,
  callback,
  ratio = defaultRatio,
  amplitude = 0,
  range = 10,
  tracker = 0,
  stagger = 0
) => {
  // Make local copies of coordinates
  const [x, y] = getVectorFromElement(el);
  if (callback && el) {
    callback(el, tracker);
  }

  const mutation = Math.floor(ratio(tracker)) + amplitude;
  const vector = [x, y];

  for (let j = 0; j < Math.abs(mutation); j++) {
    // what direction is the coordinate in
    vector[1] = mutation < 0 ? ++vector[1] : --vector[1];
    const mutationEle = getElementFromVector(vector);
    // Step for mutation
    if (callback && mutationEle) {
      callback(mutationEle, j);
    }
  }

  if (tracker + 1 <= range) {
    // Move x one to the right
    const nextEle = getElementFromVector([x + 1, y]);
    setTimeout(() => {
      createGraph(nextEle, callback, ratio, amplitude, range, tracker + 1);
    }, stagger);
  }
};

/**
 *
 * @param ele
 * @param radius
 * @param callback
 * @param stagger
 */
export const createCircle = (ele, radius, callback, stagger = 30) => {
  let [x, y] = getVectorFromElement(ele);

  // Initial x-coordinate
  x = x - radius;

  const step = (i) => {
    const x2 = Math.pow(i - radius, 2);
    const r2 = Math.pow(radius, 2);
    const result = Math.abs(r2 - x2);
    const mutation = Math.round(Math.sqrt(result));

    const vector = [++x, y - mutation];

    for (let i = 0; i < mutation * 2; i++) {
      vector[1] = ++vector[1];
      const mutationEle = getElementFromVector(vector);
      if (callback && mutationEle) {
        callback(mutationEle, i);
      }
    }
  };

  for (let i = 0; i < radius * 2; i++) {
    setTimeout(() => {
      step(i);
    }, i * stagger);
  }
};
