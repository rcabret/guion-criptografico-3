// Viewport dimensions
export const cellWidth = 15;
export const cellHeight = 15;
export const borderColor = '#111';
export const borderWidth = 1;

export const text1 = 'Hola yo soy un text que quiere aparecer en el screen';
export const text2 = 'Pensé...     que me querias';

export const rowLength = Math.floor(window.innerWidth / (cellWidth + borderWidth * 2));
export const numOfRows = Math.floor(window.innerHeight / (cellHeight + borderWidth * 2));

