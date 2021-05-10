/**
 *
 * @param sideCount
 * @param radius
 * @returns {{r: *, theta}[]}
 */
const pts = (sideCount, radius) => {
	const angle = 360 / sideCount;
	const vertexIndices = range(sideCount);
	const offsetDeg = 90 - ((180 - angle) / 2);
	const offset = degreesToRadians(offsetDeg);

	return vertexIndices.map((index) => {
		return {
			theta: offset + degreesToRadians(angle * index),
			r: radius,
		};
	});
}

/**
 *
 * @param count
 * @returns {number[]}
 */
const range = (count) => Array.from(Array(count).keys());

/**
 *
 * @param angleInDegrees
 * @returns {number}
 */
const degreesToRadians = (angleInDegrees) => (Math.PI * angleInDegrees) / 180;

/**
 *
 * @param cx
 * @param cy
 * @param sideCount
 * @param radius
 * @returns {string}
 */
const polygon = ([cx, cy], sideCount, radius) =>
	pts(sideCount, radius)
		.map(({ r, theta }) => [
			cx + r * Math.cos(theta),
			cy + r * Math.sin(theta),
		])
		.join(' ');

/**
 *
 * @param el
 * @param sideCount
 * @param radius
 */
export const generatePolygon = (
	el,
	sideCount = 2,
	radius = 100,
	) => {

	const cx = +cxEl.value;
	const cy = +cyEl.value;
	const s = 2 * radius + 50;

	const res = polygon([cx, cy], sideCount, radius);
	const viz = polygon([s / 2, s / 2], sideCount, radius);

	svgEl.setAttribute("viewBox", `0 0 ${s} ${s}`);
	polygonEl.setAttribute("points", viz);
	resultEl.innerText = `<polygon points="${res}" />`;
};
