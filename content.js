import * as medium from "./letter/medium/index.js";

export function main() {
    chrome.runtime.onMessage.addListener(
        async function (request, sender, sendResponse) {
            try {
                const pixel = document.getElementsByClassName("ContributionCalendar-day");

                clearScreen(pixel)
                await delay(1500)

                const input = formatInput(request.word)

                draw(input, pixel)
                sendResponse({ status: "Success!" });
            } catch (error) {
                console.log(error)
                sendResponse({ status: "Exception occurred!" });
            }
        }
    )
}

const formatInput = (input) => {
    let format = ""
    for (let i = 0; i < input.length; i++) {
        format += input[i].toUpperCase()
    }

    return format
}

async function delay(ms) {
    return await new Promise(resolve => setTimeout(resolve, ms));
}

const clearScreen = (pixel) => {
    const DISPLAY_AREA = 7 * 51
    for (let i = 0; i < DISPLAY_AREA; i++) {
        const clearTime = setInterval(() => {
            let currentLevel = parseInt(pixel[i].dataset.level)

            pixel[i].dataset.level = (currentLevel - 1).toString()
            currentLevel--;
        }, 300)
        setTimeout(() => clearInterval(clearTime), 1500)
    }
}

const draw = function (word, pixel) {

    let startPoint = 0
    for (let i = 0; i < word.length; i++) {
        const character = word[i]

        displayLetter(medium[character], i, pixel, startPoint)

        startPoint += 7 * (medium[character][0].length + 1)
    }
}

//like A, B, C
const displayLetter = (letter, position, pixel, startPoint) => {
    const SPACE_COLUMN = 1, NEXT_COLUMN_PIXEL = 7
    for (let i = 0; i < letter.length; i++) {
        for (let j = 0; j < letter[i].length; j++) {
            //const letterWide = 7 * (letter[i].length + 1)
            if (letter[i].charAt(j) === "*") pixel[i + SPACE_COLUMN + j * NEXT_COLUMN_PIXEL + startPoint].dataset.level = "4";
        }
    }
}