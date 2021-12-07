import 'assets/main.css';

import {
    startASCIILoader,
    moveSequence,
    newMove,
} from './modules/sequences.js';
import {
    getCharsMap,
    getElementViaPosition,
    getPositionInMatrix,
    getRing,
    LinearToVector,
    vectorToLinear,
    randomNumber,
} from "./modules/utils";
import {
    borderColor,
    borderWidth,
    cellWidth,
    cellHeight,
    setRowLength,
    setNumRows,
    getNumRows,
    getRowLength,
    text1,
    text2,
} from "./modules/constants.js";

import sha256 from 'crypto-js/sha256';
import aes from 'crypto-js/aes';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64';

// Matrix selector
const cellSelector = 'cell';
let numberOfCellsNeeded;
let ego;


// Updates dimension number of cells on window resize
let activeResizing;
window.addEventListener('resize', () => {
    clearTimeout(activeResizing);
    activeResizing = setTimeout(() => {
        //runProgram();
    }, 100);
});

/**
 * Init sequence
 * Generates the grid in the html document
 * @return {void}
 */
const runProgram = () => {
    const parent = document.querySelector('#content');
    parent.innerHTML = '';  // Clear container
    setRowLength(Math.floor(window.innerWidth / (cellWidth + borderWidth * 2)));
    setNumRows(Math.floor(window.innerHeight / (cellHeight + borderWidth * 2)));
    numberOfCellsNeeded = Math.floor(getRowLength() * getNumRows());

    for (let i = 0; i < numberOfCellsNeeded; i++) {
        const node = document.createElement('div');
        node.className = cellSelector;
        node.id = `id_${i}`;
        node.style.width = `${cellWidth}px`;
        node.style.height = `${cellHeight}px`;
        if (borderWidth > 0) {
            node.style.border = `${borderWidth}px solid ${borderColor}`;
        }
        node.innerHTML = '&nbsp;';
        //node.innerHTML = i;
        parent.append(node);

        /**
         *  Append event listeners to each cell,
         *  This could also be achieved with one global eventListener
         *  For this example we'll attach them to each node.
         */
        //node.addEventListener('mouseover', handleMouseOver);
        //node.addEventListener('mouseleave', handleMouseLeave);
        //node.addEventListener('click', handleClick);
    }

    window.addEventListener('click', handleClick);

};

/**
 * On hover
 * @param e
 */
let lock = false;
const handleMouseOver = (e) => {
    if (e && e.target) {
        e.target.innerText = 'YO';
        const loopCount = 5;
        if (isCloseToEgo(e.target)) {
            const callback = (ele, count) => {
                startASCIILoader(ele, 3, 100, ele => {
                    if (count === loopCount) {
                        ego = ele;
                        ego.innerText = 'TU';
                    } else {
                        ele.innerText = ' ';
                    }
                })
            };
            if (lock) {
                return;
            }
            lock = true;
            moveSequence(ego, loopCount, callback, (el) => {
                setTimeout(() => {
                    lock = false;
                }, 300);
            });
        }
    }
};

/**
 * On leave
 * @param e
 */
const handleMouseLeave = (e) => {
    if (e && e.target) {
        e.target.innerText = '';
    }
};

/**
 * On clickz
 * @param e
 */
const handleClick = (e) => {
    const callback = (e) => {
        e.style.background = 'blue';
        //e.classList.add('grow');
        //e.style.borderColor = 'blue'
        //e.style.transform = `translate(${randomNumber(-100, 100)}px, ${randomNumber(-100, 100)}px)`
        setTimeout(() => {
            //e.classList.remove('grow')
        }, 550);
    }
    //setInterval(() => {
    newMove(e.target, null, 10, callback);
    //}, 200);

};

const isCloseToEgo = (ele) => {
    if (ego !== undefined) {
        const perimeter = getRing(ego, 2);
        const currentPosition = getPositionInMatrix(ele);
        return perimeter.includes(currentPosition);
    }
}

const drawComposition = (ele) => {
    const charsArr = getCharsMap(text2, 700);
    const loopCount = getRowLength();
    const pos = getPositionInMatrix(ele);
    let v = LinearToVector(pos);
    let count = 0;
    let int = setInterval(() => {
        const cp = vectorToLinear(v);
        const el = getElementViaPosition(cp);
        const len = Math.floor(Math.random() * 20);
        newMove(el, null, len, (e) => {
            e.style.color = 'white';
            startASCIILoader(e, 8, 10, elj => {
                elj.style.color = 'violet';
                elj.innerHTML = '-';
                setTimeout(() => {
                    startASCIILoader(elj, 4, 50, ey => {
                        ey.style.color = 'blue';
                        const pos = getPositionInMatrix(ey);
                        const t = charsArr['id_' + pos] ? charsArr['id_' + pos] : '';
                        ey.innerHTML = t;
                    })
                }, 1500);
            })
        });
        v[0] = v[0] + 1;
        count++;
        if (count > loopCount) {
            clearInterval(int);
        }
    }, 100);
}

const main = async () => {
    const div = document.createElement('div');
    div.id = 'content';
    document.querySelector('body').appendChild(div);
    document.addEventListener('DOMContentLoaded', () => {
        runProgram();
        console.log(sha256("Message"));
        const encrypted = aes.encrypt("Mi mensaje esta cifrado cabron", "myPassword").toString();
        const decrypted = aes.decrypt(encrypted, "myPassword").toString();
        console.log('enc', encrypted);
        console.log('dec', decrypted);

    });
}

main().then(() => console.log('Started'));
