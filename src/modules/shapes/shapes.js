import {
  createCircle,
  createGraph,
  drawSquareOutline,
  startASCIIExplosion,
} from "../sequences";


/**
 * ENDS
 */

export const dna_star = (el, scale) => {
  const callback = (el) => {
    el.style.background = "#F8E2DAFF";
  };
  // First action
  startASCIIExplosion(el, callback);

  const graphFunc = (x) => Math.cos(x / 2) * 10;

  // Second action
  createGraph(
    el,
    (e, i) => {
      setTimeout(() => {
        if (!e.hasAttribute("hello")) {
          e.style.background = scale(i / 10);
        }
      }, i * 50);
    },
    graphFunc,
    0,
    8,
    -8
  );
};

export const squares = (ele, scale) => {
  for (let i = 1; i < 30; i++) {
    setTimeout(() => {
      drawSquareOutline(ele, i, (e) => {
        e.style.background = scale(i * 0.05);
      });
    }, i * 20);
  }
};

export const star_pattern = (ele, scale) => {
  const step = (e, i) => {
    e.style.background = scale(i / 10);
  };
  const end = (el) => {
    startASCIIExplosion(el, step, null, 8);
  };
  startASCIIExplosion(ele, step, end, 20);
};

export const skin_star = (ele, scale) => {
  const callback = (e, i) => {
    setTimeout(() => {
      e.style.background = scale(i / 50);
    }, i * 10);
  };

  const callback2 = (el, i) => {
    el.style.background = scale(i / 50);
    //el.style.background = "#F8E2DAFF";
  };
  // First action
  startASCIIExplosion(ele, callback2, callback);
};

/**
 * STEPS
 */

export const blue = (ele, scale) => {
  ele.style.background = "lightblue";
};

export const skin_glitch = (el) => {
  el.style.background = "#F8E2DAFF";
  el.classList.add("grow");
};

export const glitch = (el) => {
  el.classList.add("grow");
};

export const paint_shimmer = (el, scale) => {
  el.style.background = "#F8E2DAFF";
  const radius = 5;
  createCircle(el, radius, (e, i) => {
    setTimeout(() => {
      e.style.background = scale(i / (radius * 2.5));

      setTimeout(() => {
        e.style.background = "lightblue";
      }, 200);

      setTimeout(() => {
        e.style.background = scale(i / (radius * 2.5));
      }, 400);
    }, i * 10);
  });
};

