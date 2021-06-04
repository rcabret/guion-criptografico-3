import {
  getIndex,
  randomNumber,
  getElementFromVector,
  getVectorFromElement,
  getEveryOtherNeighborsByStep,
  getRing,
} from "./utils.js";

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

const defaultRatio = (x) => {
  return x;
};

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

export const createCircle = (
  ele,
  radius,
  callback,
  tracker = 0,
  stagger = 0
) => {
  let [x, y] = getVectorFromElement(ele);

  // Make local copies of center coordinates
  x = tracker === 0 ? x - radius : x;

  const x2 = Math.pow(tracker - radius, 2);
  const r2 = Math.pow(radius, 2);
  const result = Math.abs(r2 - x2);
  const mutation = Math.round(Math.sqrt(result));

  const vector = [x, y - mutation];

  for (let i = 0; i < mutation * 2; i++) {
    vector[1] = ++vector[1];
    const mutationEle = getElementFromVector(vector);
    if (callback && mutationEle) {
      callback(mutationEle, i);
    }
  }

  if (tracker < radius * 2) {
    const newEle = getElementFromVector([x + 1, y]);
    setTimeout(() => {
      createCircle(newEle, radius, callback, tracker + 1, stagger);
    }, stagger);
  }
};
