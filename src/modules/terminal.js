/**
 * Terminal component
 */
class Terminal {
  constructor(terminalHeight = 80) {
    this.body = document.querySelector("body");
    this.terminalParent = document.createElement("aside");
    this.terminalParent.id = "terminal";
    this.terminalName = "guión$";
    this.terminalParent.style.height = `${terminalHeight}px`;
  }

  init() {
    this.terminalParent.innerHTML = `
      <div>
		<ul id="command-history"></ul>
        <span id="input-line">
	        ${this.terminalName}  <input autocomplete="off" id="command-input" />
		</span>
	  </div>`;

    this.body.appendChild(this.terminalParent);
    this._getInputElement().focus();
  }

  _getInputElement() {
    return document.getElementById("command-input");
  }

  _scrollToBottom() {
    this.terminalParent.scrollTop = this.terminalParent.scrollHeight;
  }

  getInputValue() {
    if (this.terminalParent === undefined) {
      return;
    }
    return this._getInputElement().value;
  }

  addStringToCommandHistory(string) {
    const input = this._getInputElement();
    input.value = "";
    input.focus();

    const history = document.getElementById("command-history");
    const li = document.createElement("li");
    li.innerHTML = string;
    history.appendChild(li);
    this._scrollToBottom();
  }

  addExecutedCommandToHistory(string) {
    this.addStringToCommandHistory(`${this.terminalName} ${string}`);
  }

  updateLastCommand(string) {
    const history = document.getElementById("command-history");
    if (history.children.length > 8) {
      history.innerHTML = "";
      this.addStringToCommandHistory(string);
    } else {
      history.lastChild.innerHTML = string;
    }
  }

  toggleInputLine() {
    const inputLine = document.getElementById("input-line");
    inputLine.classList.toggle("hide");
  }
}

export default Terminal;
