import { deleteEverythingButMe } from "./sequences";
import { trajectoryMove } from "./trackers";
import Sha256 from "crypto-js/sha256";
import AES from "crypto-js/aes";
import { ends, scales, steps, trackers } from "./shapes/shapes-maps";
import { buildAndGetDispatchingArray } from "./utils";

export const _azar = (config) => {
  config.updateConfig({
    scale: scales[~~(Math.random() * scales.length)],
    shape: {
      step: steps[~~(Math.random() * steps.length)],
      end: ends[~~(Math.random() * ends.length)],
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
    const passPhrase = Sha256("un_nuevo_manglar");
    // Encrypting with hashed password
    const encrypted = AES.encrypt(inputValue, passPhrase.toString());

    // Write highlighted ciphertext into terminal command history
    terminal.updateLastCommand(
      `> aes-chipertext: <span style=" font-style: italic">${encrypted.toString()}</span>`
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
    activationFunction(undefined, codecArray, encrypted.toString());
  }
};
