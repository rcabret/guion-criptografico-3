
export const text1 = "Hola yo soy un text que quiere aparecer en el screen";
export const text2 = "Pensé...     que me querias";

const defaults = {
  cellWidth: 14,
  cellHeight: 14,
  borderColor: "#f9f9f9",
  //borderColor: "#031E57FF",
  borderWidth: 1,
};

export class MatrixCanvas {
  constructor(
    configObj = defaults,
    parentId = "content",
    cellSelector = "cell"
  ) {
    this.config = { ...defaults, ...configObj };
    this.parentElement = document.createElement("pre");
    this.parentElement.id = parentId;
    this.cellSelector = cellSelector;

    this.rowLength = Math.floor(
        window.innerWidth  /
        (configObj.cellWidth + configObj.borderWidth * 2)
    );
    this.numOfRows = Math.floor(
        (window.innerHeight - 100) /
        (configObj.cellHeight + configObj.borderWidth * 2)
    );
    this.cellCount = Math.floor(this.rowLength * this.numOfRows);
  }

  init() {
    const body = document.querySelector("body");
    body.appendChild(this.parentElement);
    this.parentElement.innerHTML = "";
    const img = new Image();
    img.src = "/pr.png";

    for (let i = 0; i < this.cellCount; i++) {
      const node = document.createElement("span");
      node.className = this.cellSelector;
      //const [x, y] = LinearToVector(i);
      node.id = `id_${i}`;
      node.style.width = `${this.config.cellWidth}px`;
      node.style.height = `${this.config.cellHeight}px`;
      if (this.config.borderWidth > 0) {
        node.style.border = `${this.config.borderWidth}px solid ${this.config.borderColor}`;
      }

      //node.innerHTML = "&nbsp;";
      this.parentElement.append(node);
    }
  }

  getRowLength() {
    console.log('in here')
    return this.rowLength;
  }

  getCellCount() {
    return this.cellCount;
  }
}
