import { getWords } from "../Words/words.js";

let currentWords = [];


const inputBox = document.getElementById("main-input");
const wordGuideDiv = document.getElementById("Word-guide-container");
const resetBtn = document.getElementById("reset-btn");
const languageSelect = document.getElementById("language");
const difficultySelect = document.getElementById("difficulty")



async function generateWords(lang, difficulty, n) {
    currentWords = await getWords(lang, difficulty, n);
    wordGuideDiv.replaceChildren();

    for (let wordIndex = 0; wordIndex < currentWords.length; wordIndex++) {
        const newWordParagraph = document.createElement("p");
        newWordParagraph.textContent = currentWords[wordIndex];
        newWordParagraph.id = "word" + wordIndex;
        wordGuideDiv.append(newWordParagraph);
    }

    inputBox.value = ""
}

resetBtn.addEventListener("click", () => generateWords(languageSelect.value, Number(difficultySelect.value) - 1, 5));

function handleUserInput(){
    const currentText = inputBox.value
    const lastInput = currentText[currentText.length - 1]
    if (lastInput === ' '){
        //then we chenck the last typed word
        const rawSplitUserText = currentText.split(" ")
        const splitUserText = rawSplitUserText.filter(str => str !== "")// so that double spaces do not cause trouble
        const currentWordIndex = splitUserText.length - 1
        const lastWord = splitUserText[currentWordIndex]

        const guideWords = wordGuideDiv.children
        const currentGuideWord = guideWords[currentWordIndex]
        if (lastWord === currentWords[currentWordIndex]){
            currentGuideWord.style.color = "green"
        }else{
            currentGuideWord.style.color = "red"
        }
    }
}

inputBox.addEventListener("input", () => handleUserInput())