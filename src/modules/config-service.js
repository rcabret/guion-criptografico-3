import * as chroma from "chroma-js";
import { createRandomLandscape, startASCIIExplosion } from "./sequences";

const defaults = {
  scale: "skin",
  shape: "explosion",
};

export const _scaleMap = {
  skin: chroma.cubehelix().lightness([0, 1]),
  greyscale: chroma.scale(),
  lulu: chroma.scale(["yellow", "navy"]).mode("lch"),
};

export const _shapesMap = {
  landscape: createRandomLandscape,
  explosion: startASCIIExplosion,
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

  getConfig() {
    return this._configObj;
  }
}

export default CanvasConfig;
