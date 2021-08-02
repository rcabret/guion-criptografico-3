import { _scaleMap, _shapesMap } from "./config-service";
import { deleteEverythingButMe, trajectoryMove } from "./sequences";
import Sha256 from "crypto-js/sha256";
import AES from "crypto-js/aes";
import { ends, scales, steps } from "./shapes/shapes-maps";
import html2canvas from "html2canvas";
import { buildAndGetDispatchingArray } from "./utils";

const _azar = (config) => {
  config.updateConfig({
    scale: scales[Math.floor(Math.random() * scales.length)],
    shape: {
      step: steps[Math.floor(Math.random() * steps.length)],
      end: ends[Math.floor(Math.random() * ends.length)],
      tracker: trajectoryMove,
    },
  });
};
/**
 *
 * @param inputValue
 * @param config
 * @param canvas
 * @param terminal
 */
export const handleConfigChange = (inputValue, config, canvas, terminal) => {
  const configOption = inputValue.match(/--(.*)/)[1];

  if (configOption && configOption.length) {
    // Writing command to terminal
    terminal.addExecutedCommandToHistory(inputValue);
    const configValue = configOption.split(" ")[1];
    switch (configOption.split(" ")[0]) {
      case "alpha":
      case "a":
        if (configValue && !isNaN(configValue)) {
          let newAlpha = configValue < 0.2 ? 0.2 : configValue;
          const newConfig = { alpha: newAlpha };
          config.updateConfig(newConfig);
        }
        break;
      case "blur":
      case "b":
        if (configValue && !isNaN(configValue)) {
          canvas.toggleBlurLayer(configValue);
        }
        break;
      case "color":
      case "cr":
        if (Object.keys(_scaleMap).includes(configValue)) {
          const configObj = {
            scale: _scaleMap[configValue],
          };
          config.updateConfig(configObj);
          terminal.addStringToCommandHistory(`> scale update: ${configValue}`);
        }
        break;
      case "forma":
      case "f":
        if (Object.keys(_shapesMap).includes(configValue)) {
          const configObj = {
            shape: _shapesMap[configValue],
          };
          config.updateConfig(configObj);
          terminal.addStringToCommandHistory(`> shape update: ${configValue}`);
        }
        break;
      case "dale":
      case "d":
        config.updateConfig({
          //scale: scales[Math.floor(Math.random() * scales.length)],
          shape: {
            step: steps[Math.floor(Math.random() * steps.length)],
            end: ends[Math.floor(Math.random() * ends.length)],
            tracker: trajectoryMove,
          },
        });
        break;
      case "dale-duro":
      case "dd":
        _azar(config);
        break;
      case "sin-grid":
      case "sg":
        canvas.toggleGrid(true);
        break;
      case "con-grid":
      case "cg":
        canvas.toggleGrid();
        break;
      case "oscuro":
      case "o":
        canvas.toggleDarkMode(true);
        break;
      case "claro":
      case "c":
        canvas.toggleDarkMode();
        break;
      case "limpiar":
      case "l":
        // Clears background styles of all matrix
        terminal.addExecutedCommandToHistory(inputValue);
        deleteEverythingButMe();
        break;
      case "reset":
      case "r":
        // Clear and reset canvas matrix
        terminal.addExecutedCommandToHistory(inputValue);
        terminal.addStringToCommandHistory("> reset complete");
        canvas.init();
        break;
      case "metele":
      case "m":
        html2canvas(document.querySelector("pre")).then(function (canvas) {
          document.body.appendChild(canvas);
        });
        break;
      case "azar":
        config.updateConfig({ randomize: true });
        console.log(config.getConfig());
        break;
    }
  }
};

/**
 *
 * @param inputValue
 * @param config
 * @param canvas
 * @param terminal
 * @param activationFunction
 */
export const handleKeyPress = (
    inputValue,
    config,
    canvas,
    terminal,
    activationFunction
) => {
  if (inputValue.length) {
    // Check for 'randomize' config. If it's true randomize shapes and scales before encrypting.
    const azar = config.getConfig().randomize;
    if (azar) {
      _azar(config);
    }
    // Write highlighted input text into terminal command history
    terminal.addExecutedCommandToHistory(
        `<span style="background: white; color: black; font-weight: 900">${inputValue}</span>`
    );

    // Encryption process
    // Hashing password
    const passPhrase = Sha256("temp_passphrase");
    // Encrypting with hashed password
    const encrypted = AES.encrypt(inputValue, passPhrase.toString());

    // Write highlighted ciphertext into terminal command history
    terminal.addStringToCommandHistory(
        `> aes-chipertext: <span style=" font-style: italic">${encrypted}</span>`
    );

    // Create process text node to be updated with percentage during recursive crawling
    // See above `encryptionSequence` -> `end` callback
    terminal.addStringToCommandHistory(
        "> creating composition from ciphertext"
    );

    // Build and get crawler data array
    // Used to move the crawler in the matrix
    const codecArray = buildAndGetDispatchingArray(encrypted.toString());

    // Start encryption crawler recursion
    activationFunction(undefined, codecArray, inputValue.split(" ").length);
  }
};
