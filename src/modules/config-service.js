import * as chroma from "chroma-js";

import {
  skin_glitch,
  paint_shimmer,
  blue,
  skin_star,
  star_pattern,
  squares,
  dna_star,
} from "./shapes/shapes";
import { trajectoryMove } from "./sequences";

const shapeDefaults = {
  step: blue,
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
};

const defaults = {
  scale: _scaleMap["skin"],
  shape: _shapesMap["one"],
};

class CanvasConfig {
  constructor(configObj = defaults) {
    this._configObj = configObj;
  }

  updateConfig(configObj) {
    this._configObj = { ...this._configObj, ...configObj };
  }

  getConfig() {
    return this._configObj;
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
