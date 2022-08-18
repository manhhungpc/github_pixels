import * as medium from "./characters/medium/index.js";
import * as small from "./characters/small/index.js";
import * as mediumNumber from "./characters/medium/number.js";
import * as smallNumber from "./characters/small/number.js";

export function main() {
    const pixel = document.getElementsByClassName("ContributionCalendar-day");

    //if it storaged, refresh will automatic redraw
    chrome.storage.sync.get(["github-pixels", "github-pixels-size"], function (result) {
        console.log(result);
        if (result["github-pixels"]) {
            runDrawingProcess(result["github-pixels"], pixel, result["github-pixels-size"]);
        }
    });

    chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
        try {
            chrome.storage.sync.set({ "github-pixels-size": request.size });
            runDrawingProcess(request.input, pixel, request.size);
            sendResponse({ status: "Success!" });
        } catch (error) {
            console.log(error);
            sendResponse({ status: "Exception occurred!" });
        }
    });
}

const runDrawingProcess = async (input, pixel, size) => {
    clearScreen(pixel);
    await delay(1500);
    draw(input, pixel, size);
};

async function delay(ms) {
    return await new Promise((resolve) => setTimeout(resolve, ms));
}

const clearScreen = (pixels) => {
    const CLEAR_AREA = pixels.length;
    for (let i = 0; i < CLEAR_AREA; i++) {
        const clearTime = setInterval(() => {
            let currentLevel = parseInt(pixels[i].dataset.level);

            pixels[i].dataset.level = (currentLevel - 1).toString();
            currentLevel--;
        }, 300);
        setTimeout(() => clearInterval(clearTime), 1500);
    }
};

const draw = function (word, pixel, size) {
    let startPoint = 0;
    const NEXT_COLUMN_PIXEL = 7;
    const numToString = {
        1: "one",
        2: "two",
        3: "three",
        4: "four",
        5: "five",
        6: "six",
        7: "seven",
        8: "eight",
        9: "nine",
        0: "zero",
    };
    for (let i = 0; i < word.length; i++) {
        const isNumber = Number.isInteger(parseInt(word[i]));
        const character = isNumber === true ? numToString[word[i]] : word[i];

        //add a blank column between words if have space
        if (character === " ") {
            startPoint += NEXT_COLUMN_PIXEL;
            continue;
        }

        let characterWidth;

        if (isNumber === true) {
            displayNumber(character, pixel, startPoint, size);
            characterWidth =
                size === "medium"
                    ? mediumNumber[character][0].length
                    : smallNumber[character][0].length;
        } else {
            displayLetter(character, pixel, startPoint, size);
            characterWidth =
                size === "medium" ? medium[character][0].length : small[character][0].length;
        }

        startPoint += NEXT_COLUMN_PIXEL * (characterWidth + 1);
    }
};

//like A, B, C
const displayLetter = (character, pixel, startPoint, size) => {
    const SPACE_FROM_TOP = size === "medium" ? 1 : 2,
        NEXT_COLUMN_PIXEL = 7;
    let letter = size === "medium" ? medium[character] : small[character];

    for (let i = 0; i < letter.length; i++) {
        for (let j = 0; j < letter[i].length; j++) {
            if (letter[i].charAt(j) === "*")
                pixel[i + SPACE_FROM_TOP + j * NEXT_COLUMN_PIXEL + startPoint].dataset.level = "4";
        }
    }
};

const displayNumber = (number, pixel, startPoint, size) => {
    const SPACE_FROM_TOP = size === "medium" ? 1 : 2,
        NEXT_COLUMN_PIXEL = 7;
    let letter = size === "medium" ? mediumNumber[number] : smallNumber[number];

    for (let i = 0; i < letter.length; i++) {
        for (let j = 0; j < letter[i].length; j++) {
            if (letter[i].charAt(j) === "*")
                pixel[i + SPACE_FROM_TOP + j * NEXT_COLUMN_PIXEL + startPoint].dataset.level = "4";
        }
    }
};
