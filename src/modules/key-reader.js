import { _scaleMap, _shapesMap } from "./config-service";
import { deleteEverythingButMe, trajectoryMove } from "./sequences";
import Sha256 from "crypto-js/sha256";
import AES from "crypto-js/aes";
import { ends, scales, steps } from "./shapes/shapes-maps";

import { buildAndGetDispatchingArray } from "./utils";

/**
 *
 * @param inputValue
 * @param config
 * @param terminal
 */
export const handleConfigChange = (inputValue, config, terminal) => {
  const configOption = inputValue.match(/--(.*)/)[1];

  if (configOption && configOption.length) {
    // Writing command to terminal
    terminal.addExecutedCommandToHistory(inputValue);
    const configValue = configOption.split(" ")[1];
    switch (configOption.split(" ")[0]) {
      case "color":
        if (Object.keys(_scaleMap).includes(configValue)) {
          const configObj = {
            scale: _scaleMap[configValue],
          };
          config.updateConfig(configObj);
          terminal.addStringToCommandHistory(`> scale update: ${configValue}`);
        }
        break;
      case "forma":
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
        config.updateConfig({
          scale: scales[Math.floor(Math.random() * scales.length)],
          shape: {
            step: steps[Math.floor(Math.random() * steps.length)],
            end: ends[Math.floor(Math.random() * ends.length)],
            tracker: trajectoryMove,
          },
        });

      case "sin-grid":
        break;
    }
  }
};

/**
 *
 * @param inputValue
 * @param canvas
 * @param terminal
 * @param activationFunction
 */
export const handleKeyPress = (
  inputValue,
  canvas,
  terminal,
  activationFunction
) => {
  switch (inputValue) {
    case "clear":
      // Clears background styles of all matrix
      terminal.addExecutedCommandToHistory(inputValue);
      deleteEverythingButMe();
      break;
    case "reset":
      // Clear and reset canvas matrix
      terminal.addExecutedCommandToHistory(inputValue);
      terminal.addStringToCommandHistory("> reset complete");
      canvas.init();
      break;
    default:
      // Let's encrypt some shit
      if (inputValue.length) {
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
      break;
  }
};
