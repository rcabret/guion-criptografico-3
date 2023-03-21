import * as chroma from "chroma-js";

import {
  skin_glitch,
  paint_shimmer,
  blue,
  skin_star,
  star_pattern,
  squares,
  dna_star,
  colorStep,
  ascii_star,
} from "./shapes/shapes";
import { sineMove, trajectoryMove } from "./trackers";

const shapeDefaults = {
  step: colorStep,
  tracker: trajectoryMove,
};

export const _scaleMap = {
  skin: chroma.cubehelix().lightness([0, 1]),
  greyscale: chroma.scale(),
  lulu: chroma.scale(["yellow", "navy"]).mode("lch"),
};

export const _shapesMap = {
  one: { ...shapeDefaults, step: skin_glitch, end: dna_star },
  two: { ...shapeDefaults, end: squares },
  three: { ...shapeDefaults, end: star_pattern },
  four: { ...shapeDefaults, end: skin_star },
  paint: { ...shapeDefaults, step: paint_shimmer },
  none: { ...shapeDefaults },
  lulu: { ...shapeDefaults, end: ascii_star },
};

const defaults = {
  scale: _scaleMap["skin"],
  shape: { ...shapeDefaults },
  alpha: 1,
  // Randomizes shape
  randomize: true,
};

class CanvasConfig {
  constructor(configObj = defaults) {
    this._configObj = configObj;
  }

  updateConfig(configObj) {
    this._configObj = { ...this._configObj, ...configObj };
  }

  // For debugging
  getConfig() {
    return this._configObj;
  }

  getAlpha() {
    return this._configObj.alpha;
  }

  getScale() {
    return this._configObj.scale;
  }

  getEnd() {
    return this._configObj.shape.end;
  }

  getStep() {
    return this._configObj.shape.step;
  }

  getTracker() {
    return this._configObj.shape.tracker;
  }
}

export default CanvasConfig;
