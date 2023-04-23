import {
  createCircle,
  createGraph,
  drawSquareOutline,
  startASCIIExplosion,
  startASCIILoader,
} from "../sequences";
import { randomNumber } from "../utils";

/**
 * ENDS
 */

export const triangle_sine = (el, scale, i, alpha) => {
  const graphFunc = (x) => x;
  createGraph(
    el,
    (e, i) => {
      setTimeout(() => {
        if (!e.hasAttribute("hello")) {
          e.style.background = scale(i / 10).alpha(alpha);
        }
      }, i * 50);
    },
    graphFunc,
    0,
    8,
    -8
  );
};

export const triangle = (el, scale, i, alpha) => {
  const graphFunc = (x) => x;
  createGraph(
    el,
    (e, i) => {
      setTimeout(() => {
        if (!e.hasAttribute("hello")) {
          e.style.background = scale(i / 10).alpha(alpha);
        }
      }, i * 50);
    },
    graphFunc,
    Math.floor(Math.random() * 2),
    Math.floor(Math.random() * 20),
    0
  );
};

export const dna_star = (el, scale, i, alpha) => {
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
          e.style.background = scale(i / 10).alpha(alpha);
        }
      }, i * 50);
    },
    graphFunc,
    0,
    8,
    -8
  );
};

export const squares = (ele, scale, i, alpha) => {
  for (let i = 1; i < 30; i++) {
    setTimeout(() => {
      drawSquareOutline(ele, i, (e) => {
        e.style.background = scale(i * 0.05).alpha(alpha);
      });
    }, i * 20);
  }
};

export const squares_outlines = (ele, scale, i, alpha) => {
  const run = randomNumber(10, 30);
  for (let i = 0; i < run; i += 2) {
    setTimeout(() => {
      drawSquareOutline(ele, i, (e) => {
        e.style.background = scale(i * 0.05).alpha(alpha);
      });
    }, i * 20);
  }
};

export const star_pattern = (ele, scale, i, alpha) => {
  const step = (e, i) => {
    e.style.background = scale(i / 10).alpha(alpha);
  };
  const end = (el) => {
    startASCIIExplosion(el, step, null, Math.floor(Math.random() * 10));
  };
  startASCIIExplosion(ele, step, end, Math.floor(Math.random() * 20));
};

export const blue_star_pattern = (ele, scale, i, alpha) => {
  const step = (e, i) => {
    e.style.background = "blue";
  };
  const end = (el) => {
    startASCIIExplosion(el, step, null, Math.floor(Math.random() * 8));
  };
  startASCIIExplosion(ele, step, end, Math.floor(Math.random() * 20));
};

export const skin_star = (ele, scale, i, alpha) => {
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

export const ascii_star = (ele) => {
  const callback = (el) => {
    startASCIILoader(el);
  };
  startASCIIExplosion(ele, callback, undefined, randomNumber(5, 10));
};

/**
 * STEPS
 */

export const blue = (ele) => {
  ele.style.background = "lightblue";
};

export const skin_glitch = (el) => {
  el.style.background = "#F8E2DAFF";
  el.classList.add("grow");
};

export const glitch = (el) => {
  el.classList.add("grow");
};

export const paint_shimmer = (el, scale, i, alpha) => {
  el.style.background = "#F8E2DAFF";
  const radius = 5;
  createCircle(el, radius, (e, i) => {
    setTimeout(() => {
      e.style.background = scale(i / (radius * 2.5)).alpha(alpha);

      setTimeout(() => {
        e.style.background = "lightblue";
      }, 200);

      setTimeout(() => {
        e.style.background = scale(i / (radius * 2.5));
      }, 400);
    }, i * 10);
  });
};

export const colorStep = (el, scale, i, alpha) => {
  el.style.background = scale(i / 20).alpha(alpha);
};
