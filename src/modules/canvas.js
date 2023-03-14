import { LinearToVector, randomNumber } from "./utils";
import { _scaleMap } from "./config-service";

const darkMode = {
  background: "black",
  borderColor: "#031E57FF",
};

const lightMode = {
  background: "white",
  borderColor: "#f9f9f9",
};

const defaults = {
  borderWidth: 0.5,
  cellWidth: 14, // 14 default
  cellHeight: 14, // 14 default
  cellSelector: "cell",
  canvasId: "content",
  container: "body",
  terminalHeight: 80,
  ...darkMode,
};

export class MatrixCanvas {
  constructor(configObj = defaults) {
    this._config = { ...defaults, ...configObj };

    this._parentElement = document.createElement("pre");

    this.rowLength = Math.floor(
      window.innerWidth /
        (this._config.cellWidth + this._config.borderWidth * 2)
    );
    this.numOfRows = Math.floor(
      (window.innerHeight - this._config.terminalHeight) /
        (this._config.cellHeight + this._config.borderWidth * 2)
    );

    this.cellCount = Math.floor(this.rowLength * this.numOfRows);
  }

  init() {
    const body = document.querySelector("body");
    body.style.background = this._config.background;
    const backdrop = document.createElement("div");
    backdrop.className = "backdrop";

    body.appendChild(this._parentElement);
    body.append(backdrop);

    this._parentElement.innerHTML = "";

    const { cellWidth, cellHeight, borderWidth, borderColor } = this._config;

    for (let i = 0; i < this.cellCount; i++) {
      const node = document.createElement("span");
      const [x, y] = LinearToVector(i);
      node.id = `${x}_${y}`;
      const styles = {
        width: `${cellWidth}px`,
        height: `${cellHeight}px`,
        border:
          this._config.borderWidth > 0
            ? `${borderWidth}px solid ${borderColor}`
            : "none",
      };
      Object.assign(node.style, styles);
      this._parentElement.append(node);
    }
  }

  toggleDarkMode(dark = false) {
    const newMode = dark ? darkMode : lightMode;
    this._config = { ...this._config, ...newMode };
    const body = document.querySelector("body");
    const cells = document.querySelectorAll("pre span");
    body.style.background = this._config.background;

    cells.forEach((ele, i) => {
      ele.style.borderColor = this._config.borderColor;
    });
  }

  toggleGrid(hide = false) {
    const cells = document.querySelectorAll("pre span");
    const borderColor = hide ? "transparent" : this._config.borderColor;
    cells.forEach((ele, i) => {
      ele.style.borderColor = borderColor;
    });
  }

  getRowLength() {
    return this.rowLength;
  }

  getNumOfRows() {
    return this.numOfRows;
  }

  toggleBlurLayer(width) {
    const background = document.querySelector(".backdrop");
    background.style.width = `${width}vw`;
  }

  randomizeBlurLayer() {
    const w = randomNumber(30, 100);
    const h = randomNumber(30, 100);
    const left = randomNumber(0, window.innerWidth / 1.5 - w);
    const top = randomNumber(0, window.innerHeight / 1.5 - h);

    const background = document.querySelector(".backdrop");
    background.style.width = `${w}vw`;
    background.style.height = `${h}vh`;
    background.style.left = `${left}px`;
    background.style.top = `${top}px`;
  }
}
