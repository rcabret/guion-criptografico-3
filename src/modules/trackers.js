import {
  getElementFromVector,
  getVectorFromElement,
  randomNumber,
} from "./utils";

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

export const sineMove = (
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
    x = x + 1;
    y = ~~(-100 * Math.sin(0.04 * x));
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
