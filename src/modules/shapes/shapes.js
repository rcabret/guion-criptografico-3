import {
  createRandomLandscape,
  drawRing,
  startASCIIExplosion,
} from "../sequences";

export const one = (el, scale) => {
  const callback = (el) => {
    el.style.background = "#F8E2DAFF";
  };

  // First action
  startASCIIExplosion(el, callback);

  // Second action
  createRandomLandscape(
    el,
    (e, i) => {
      setTimeout(() => {
        if (!e.hasAttribute("hello")) {
          e.classList.add("grow");
          e.style.background = scale(i / 10);
        }
      }, i * 50);
    },
    1,
    0,
    20
  );
};

export const two = (ele, scale) => {
  for (let i = 1; i < 30; i++) {
    setTimeout(() => {
      drawRing(ele, i, (e) => {
        e.style.background = scale(i * 0.05);
      });
    }, i * 20);
  }
};

export const three = (ele, scale) => {
  startASCIIExplosion(ele);
};
