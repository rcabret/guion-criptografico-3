import * as chroma from "chroma-js";
import { one, three, two } from "./shapes/shapes";

const defaults = {
  scale: "skin",
  shape: "one",
};

export const _scaleMap = {
  skin: chroma.cubehelix().lightness([0, 1]),
  greyscale: chroma.scale(),
  lulu: chroma.scale(["yellow", "navy"]).mode("lch"),
};

export const _shapesMap = {
  one: one,
  two: two,
  three: three,
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

  getShape() {
    return _shapesMap[this._configObj.shape];
  }
}

export default CanvasConfig;
