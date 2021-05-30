import {_scaleMap, _shapesMap} from "./config-service";

export const handleConfigChange = (inputValue, config, terminal) => {
	const configInput = inputValue.includes("config");

	if (!configInput) {
		return;
	}
	const configOption = inputValue.match(/--(.*)/)[1];

	if (configInput && configOption) {
		// Writing command to terminal
		terminal.addExecutedCommandToHistory(inputValue);
		const configValue = configOption.split(" ")[1];
		switch (configOption.split(" ")[0]) {
			case "scale":
				if (Object.keys(_scaleMap).includes(configValue)) {
					config.updateConfig({ scale: configValue });
					terminal.addStringToCommandHistory(`> scale update: ${configValue}`);
				}
				break;
			case "shape":
				if (Object.keys(_shapesMap).includes(configValue)) {
					config.updateConfig({ shape: configValue });
					terminal.addStringToCommandHistory(`> shape update: ${configValue}`);
				}
				break;
		}
	}
};
