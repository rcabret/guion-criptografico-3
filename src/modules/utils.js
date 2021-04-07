/**
 *
 * @param ele
 * @param step
 * @param loopCount
 * @param callback
 * @param onEndCallback
 *s
 * TODO: Will accept a 'neighborStepCallback,  change callback to 'onEndCallback'
 */
import {rowLength} from "./constants.js";

export const getNeighborsByStep = (
	ele,
	step,
	loopCount,
	callback,
	onEndCallback) => {

	const cp = getPositionInMatrix(ele);
	const arr = [
		cp - (rowLength * step), //top-center
		cp - (rowLength * step) + step, //top-right
		cp + step, //center-right
		cp + (rowLength * step) + step, //bottom-right
		cp + (rowLength * step), //bottom-center
		cp + (rowLength * step) - step, //bottom-left
		cp - step, //center-left
		cp - (rowLength * step) - step, //top-left
	];

	arr.forEach(x => {
		if (x > 0) {
			const ele = getElementViaPosition(x);
			if (!ele) {
				return;
			}
			// Execute every step
			callback(ele);
			// Execute at the end of all steps
			if (step === loopCount && onEndCallback) {
				onEndCallback(ele)
			}
		}
	});
	// TODO: Run callback when finished
};

export const move = (ele, direction = 5, step = 1) => {
	const cp = getPositionInMatrix(ele);
	switch (direction) {
		case 1:  // up
			return cp - (rowLength * step);
		case 2: // up right
			return cp - (rowLength * step) + step;
		case 3: // right
			return cp + step;
		case 4: // down right
			return cp + (rowLength * step) + step;
		case 5: // down
			return cp + (rowLength * step);
		case 6: //down left
			return cp + (rowLength * step) - step;
		case 7: // left
			return cp - step;
		case 8: // up left
		default:
			return cp - (rowLength * step) - step;
	}
};
/**
 *  Square around element
 * @param ele
 * @param radius
 * @returns {*[]}
 */
export const getRing = (ele, radius) => {
	const cp = getPositionInMatrix(ele);
	const equations = [
		rowLength,
		-1,
		-rowLength,
		1,
	];
	const perimeter = radius * 8;
	let activeEq = equations[0];
	let cornerCounter = 1;
	let sP = [cp - (rowLength * radius) + radius];

	for (let i = 0; i < perimeter - 1; i++) {
		let next = sP[i] + activeEq;
		sP.push(next);
		if ((i + 1) % (radius * 2) === 0) {
			activeEq = equations[cornerCounter];
			cornerCounter++;
		}
	}
	return sP;
};

/** Misc Utils  **/
export const getRandomASCII = () => {
	const random_ascii = Math.floor((Math.random() * 25) + 97);
	return String.fromCharCode(random_ascii);
};

export const getIndex = (idx, len) => {
	return idx + 1 < len
		? idx + 1
		: 0;
};

let lastClicked = [];
export const neighborAwareClick = (e) => {
	if (e) {
		const ele = e.target;
		const cp = Number(ele.id.replace('id_', ''));
		lastClicked.push(cp);
	}
};

export const checkForNeighbors = (cp, clickHistoryArray) => {
	clickHistoryArray.forEach(e => {
		/* if(cp > )*/
	});
};

/**
 *
 * @param a
 * @returns {*}
 */
export const vectorToLinear = (a) => {
	return (a[1] * rowLength) + a[0];
};

export const LinearToVector = (pos) => {
	const y = Math.floor(pos / rowLength);
	const x = pos < rowLength ? pos : Math.floor(pos - (rowLength * y));
	return [x, y];
};

export const getPositionInMatrix = (ele) => Number(ele.id.replace('id_', ''));
export const getElementViaPosition = (position) => document.getElementById(`id_${position}`);


/** Debounce for later **/
export const debounce = (func, wait, immediate) => {
	let timeout;
	return () => {
		let context = this;
		let args = this.arguments;
		let later = function () {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		let callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

export const getCharsMap = (str, start) => {
	let map = {};
	for (let i = 0; i < str.length; i++) {
		map['id_' + (i + start)] = str.charAt(i);
	}
	return map;
};

export const randomNumber = (min, max) => {
	return Math.random() * (max - min) + min;
}

/**
 * Checks if ele is at a certain perimeter from secondEle
 *
 * @param ele
 * @param secondEle
 * @returns {boolean}
 */
export const areClose = (ele, secondEle) => {
	if (secondEle !== undefined) {
		const perimeter = getRing(secondEle, 2);
		const currentPosition = getPositionInMatrix(ele);
		return perimeter.includes(currentPosition);
	}
}
