import { createRandomLandscape, startASCIIExplosion } from "../sequences";

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
          //e.classList.add("grow");
          e.style.background = scale(i / 10);
        }
      }, i * 50);
    },
    1,
    0,
    10
  );
};

export const two = (ele, scale) => {
  startASCIIExplosion(ele);
};

export const three = (ele, scale) => {
  startASCIIExplosion(ele);
};
