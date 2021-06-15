import { LinearToVector } from "./utils";

const darkMode = {
  background: "black",
  borderColor: "#031E57FF",
};

const lightMode = {
  background: "white",
  borderColor: "#f9f9f9",
};

const defaults = {
  borderWidth: 1,
  cellWidth: 16, // 14 default
  cellHeight: 16, // 14 default
  cellSelector: "cell",
  canvasId: "content",
  container: "body",
  terminalHeight: 150,
  ...lightMode,
};

export class MatrixCanvas {
  constructor(configObj = defaults) {
    this._config = { ...defaults, ...configObj };
    this._parentElement = document.createElement("pre");

    this.rowLength = Math.floor(
      window.innerWidth / (configObj.cellWidth + configObj.borderWidth * 2)
    );
    this.numOfRows = Math.floor(
      (window.innerHeight - this._config.terminalHeight) /
        (configObj.cellHeight + configObj.borderWidth * 2)
    );
    this.cellCount = Math.floor(this.rowLength * this.numOfRows);
  }

  init() {
    const body = document.querySelector("body");
    body.style.background = this._config.background;
    const backdrop = document.createElement("div");
    backdrop.className = "backdrop";

    body.appendChild(this._parentElement);
    //body.append(backdrop);

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
    const cells = document.querySelector("pre span");

    body.style.background = this._config.background;

    cells.forEach((ele) => {
      ele.style.borderColor = this._config.borderColor;
    });
  }

  toggleGrid(hide = false) {
    const cells = document.querySelector("pre span");
    const borderColor = hide ? "transparent" : this._config.borderColor;
    cells.forEach((ele) => {
      ele.style.borderColor = borderColor;
    });
  }

  getRowLength() {
    return this.rowLength;
  }

  getNumOfRows() {
    return this.numOfRows;
  }
}
