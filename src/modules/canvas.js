export const text1 = "Hola yo soy un text que quiere aparecer en el screen";
export const text2 = "Pensé...     que me querias";

const defaults = {
  borderColor: "#f9f9f9",
  //borderColor: "#031E57FF",
  borderWidth: 1,
  cellWidth: 14,
  cellHeight: 14,
  cellSelector: "cell",
  canvasId: "content",
  container: "body",
};

export class MatrixCanvas {
  constructor(configObj = defaults) {
    this._config = { ...defaults, ...configObj };
    this._parentElement = document.createElement("pre");

    this.rowLength = Math.floor(
      window.innerWidth / (configObj.cellWidth + configObj.borderWidth * 2)
    );
    this.numOfRows = Math.floor(
      (window.innerHeight - 100) /
        (configObj.cellHeight + configObj.borderWidth * 2)
    );
    this.cellCount = Math.floor(this.rowLength * this.numOfRows);
  }

  init() {
    const body = document.querySelector("body");
    const backdrop = document.createElement("div");
    backdrop.className = "backdrop";

    body.appendChild(this._parentElement);
    body.append(backdrop);

    this._parentElement.innerHTML = "";

    const {
      cellWidth,
      cellHeight,
      cellSelector,
      borderWidth,
      borderColor,
    } = this._config;

    for (let i = 0; i < this.cellCount; i++) {
      const node = document.createElement("span");

      node.className = cellSelector;
      //const [x, y] = LinearToVector(i);
      node.id = `id_${i}`;
      node.style.width = `${cellWidth}px`;
      node.style.height = `${cellHeight}px`;
      if (this._config.borderWidth > 0) {
        node.style.border = `${borderWidth}px solid ${borderColor}`;
      }

      //node.innerHTML = "&nbsp;";

      this._parentElement.append(node);
    }
  }

  getRowLength() {
    return this.rowLength;
  }

  getCellCount() {
    return this.cellCount;
  }
}
