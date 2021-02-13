import {
	getNeighborsByStep,
	move,
	getIndex,
	getRing,
	getElementViaPosition,
	getPositionInMatrix,
	LinearToVector,
	vectorToLinear,
	randomNumber,
} from './utils.js';

const loadingString = ['—', '/', '|', '\\',];

/** Element mutations **/
export const startASCIILoader = (ele, loopCount, time, onEndCallback) => {
	let i = 1;
	let counter = 0;
	const interval = setInterval(() => {
		counter++;
		//e.target.innerText = string.charAt(Math.floor(Math.random() * string.length));
		ele.innerText = loadingString[i];
		i = getIndex(i, loadingString.length);
		if (counter > loopCount) {
			clearInterval(interval);
			if (onEndCallback) {
				onEndCallback(ele);
			}
		}
	}, time);
};

export const startASCIIExplosion = (
	ele,
	loopCount,
	callback,
	onEndCallback,
	onStartCallback) => {
	let counter = 0;

	if (onStartCallback) {
		onStartCallback(ele);
	}

	const interval = setInterval(() => {
		counter++;
		getNeighborsByStep(ele, counter, loopCount, callback, onEndCallback);
		if (counter >= loopCount) {
			clearInterval(interval);
		}
	}, 50);
};

export const drawRing = (
	ele,
	step,
	callback,
) => {
	const coordinates = getRing(ele, step);

	coordinates.forEach(x => {
		if (x > 0) {
			const ele = getElementViaPosition(x);
			if (!ele) {
				return;
			}
			// Execute every step
			callback(ele);
		}
	});
};

export const expandRing = (ele, startingPoint, loopCount, speed) => {
	let i = startingPoint;
	const interval = setInterval(() => {
		i++;
		drawRing(ele, i, (e) => {
			ele.style.color = '#ebc4ca';
			e.innerText = 'tu';
		});
		drawRing(ele, i - 1, (e) => {
			e.innerText = '';
		});
		if (i === startingPoint + loopCount) {
			clearInterval(interval);
		}
	}, speed)
};

export const moveSequence = (ele, loopCount, callback, onEndCallback) => {
	let count = 0;
	// random direction
	const d = Math.floor(Math.random() * 8) + 1;
	let interval = setInterval(() => {
		const x = move(ele, d, count);
		const el = document.getElementById(`id_${x}`);
		if (el && callback) {
			callback(el, count);
		}
		count++;
		if (count > loopCount) {
			clearInterval(interval);
			if (onEndCallback) {
				onEndCallback(el);
			}
		}
	}, 50);
}

export const newMove = (ele, trajectory, loopCount, callback, onEndCallback) => {
	const numPos = getPositionInMatrix(ele);
	let count = 0;
	let vector = LinearToVector(numPos);
	let interval = setInterval(() => {
		const id = vectorToLinear(vector);
		const el = document.getElementById(`id_${id}`);
		if (el && callback) {
			callback(el, count);
		}
		const y = vector[1] - Math.round(Math.random());
		const x = vector[0] - Math.floor(count * 0.25);
		vector = [x, y];
		count++;
		if (count > loopCount) {
			clearInterval(interval);
			if (onEndCallback) {
				onEndCallback(el);
			}
		}
	}, 50);
}

let c = 0;
export const trappedInSquare = (ele) => {
	//e.target.innerText = loadingString[0];
	//e.target.classList.add('active');

	let timer;
	c++;
	clearTimeout(timer);
	timer = setTimeout(() => {
		c = 0;
	}, 500);
	if (c > 1 && c < 4) {
		expandRing(ele, 4, 10, 50);
		startASCIILoader(ele, 4, 50)
	}
	if (c > 5) {
		expandRing(ele, 1, 10, 50);
	}
	ele.style.color = '#4274eb';
	ele.innerText = 'yo';

	drawRing(ele, 1, (el) => {
		//ele.style.color = '#ebc4ca';
		el.innerText = 'tu';
	});

	drawRing(ele, 2, (el) => {
		//ele.style.color = '#ebc4ca';
		el.innerText = 'tu';
	});

	drawRing(ele, 7, (el) => {
		//ele.style.color = '#ebc4ca';
		el.innerText = 'tu';
	});
}

/** Entire matrix mutations*/
export const glitch = (querySelector) => {
	const all = document.querySelectorAll(querySelector);
	all.forEach((e, i) => {
		setTimeout(() => {
			e.innerHTML = '|';
			e.style.color = '#edb367';
			setTimeout(() => {
				e.style.color = 'violet';
				e.innerHTML = '-';
			}, 400);
			setTimeout(() => {
				e.innerHTML = ' ';
			}, 600);
			setTimeout(() => {
				e.style.color = '#faf9ac';
			}, Math.random() * 1000);
			setTimeout(() => {
				e.style.color = '#edb367';
			}, Math.random() * 1000);
		}, Math.random() * i * 0.1)
	})
};

export const deleteEverythingButMe = (ele, querySelector) => {
	const all = document.querySelectorAll(querySelector);
	all.forEach((e, i) => {
		setTimeout(() => {
			if (e.id !== ele.id) {
				e.innerText = '';
			}
		}, Math.random() * i * 0.5)
	})
};

export const moveWithStyle = (ele, hello) => {


}
