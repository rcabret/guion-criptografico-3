import * as chroma from "chroma-js";
import {
  four,
  growBlue,
  none,
  one,
  three,
  trackerOne,
  two,
} from "./shapes/shapes";
import { trajectoryMove } from "./sequences";

const shapeDefaults = {
  step: none,
  tracker: trajectoryMove,
};

const defaults = {
  scale: "skin",
  shape: "paint",
};

export const _scaleMap = {
  skin: chroma.cubehelix().lightness([0, 1]),
  greyscale: chroma.scale(),
  lulu: chroma.scale(["yellow", "navy"]).mode("lch"),
};

export const _shapesMap = {
  one: { ...shapeDefaults, step: growBlue, end: one },
  two: { ...shapeDefaults, end: two },
  three: { ...shapeDefaults, end: three },
  four: { ...shapeDefaults, end: four },
  paint: { ...shapeDefaults, step: trackerOne },
  none: { ...shapeDefaults },
};

class CanvasConfig {
  constructor(configObj = defaults) {
    this._configObj = configObj;
  }

  updateConfig(configObj) {
    this._configObj = { ...this._configObj, ...configObj };
  }

  getScale() {
    return _scaleMap[this._configObj.scale];
  }

  getEnd() {
    return _shapesMap[this._configObj.shape].end;
  }

  getStep() {
    return _shapesMap[this._configObj.shape].step;
  }

  getTracker() {
    return _shapesMap[this._configObj.shape].tracker;
  }
}

export default CanvasConfig;
