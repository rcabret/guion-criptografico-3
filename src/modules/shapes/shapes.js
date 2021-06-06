import {
  createCircle,
  createGraph,
  drawSquareOutline,
  startASCIIExplosion,
} from "../sequences";

export const one = (el, scale) => {
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
      -8,
  );
};

export const two = (ele, scale) => {
  for (let i = 1; i < 30; i++) {
    setTimeout(() => {
      drawSquareOutline(ele, i, (e) => {
        e.style.background = scale(i * 0.05);
      });
    }, i * 20);
  }
};

export const three = (ele, scale) => {
  const step = (e) => {
    e.style.background = "blue";
  };
  const end = (el) => {
    startASCIIExplosion(el, step, null, 8 );
  };
  startASCIIExplosion(ele, step, end, 20);
};

export const four = (ele, scale) => {
  const radius = 5;

  const callback = (e, i) => {
    setTimeout(() => {
      e.style.background = scale(i / (radius * 2.5));
    }, i * 10);
  };

  const callback2 = (el) => {
    el.style.background = "#F8E2DAFF";
  };
  // First action
  startASCIIExplosion(ele, callback2);

  //createCircle(ele, radius, callback, undefined, 10);
};

export const none = (ele, scale) => {};

export const growBlue = (el) => {

  el.style.background = "#F8E2DAFF";
  el.classList.add('grow');
}

export const trackerOne = (el, scale) => {
  el.style.background = "#F8E2DAFF";

  const radius = 5;
  createCircle(el, radius, (e, i) => {
    el.classList.add('scale');

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
}
