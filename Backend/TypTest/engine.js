import { getWords } from "/Backend/Words/words.js";

let currentWords = [];
let selectedDifficulty = 0;
let selectedLanguage = "nl";

const inputBox = document.getElementById("main-input");
const wordGuideDiv = document.getElementById("Word-guide-container");
const resetBtn = document.getElementById("reset-btn");
const languageSelect = document.getElementById("language");
const difficultySelect = document.getElementById("difficulty")
const wpmLabel = document.getElementById("wpm-count")

const TIMER_LENGTH = 10 //seconds


async function generateWords(lang, difficulty, n, replace = true) {
    
    if (replace){
        currentWords = await getWords(lang, difficulty, n);
        wordGuideDiv.replaceChildren();
    }else{
        currentWords.push(await getWords(lang, difficulty, n));
    }
    
    for (let wordIndex = currentWords.length - 5; wordIndex < currentWords.length; wordIndex++) {
        const newWordParagraph = document.createElement("p");
        newWordParagraph.textContent = currentWords[wordIndex];
        newWordParagraph.id = "word" + wordIndex;
        wordGuideDiv.append(newWordParagraph);
    }
    if(replace){
        inputBox.value = "";
    }
}

async function onReset(){
    selectedDifficulty = Number(difficultySelect.value);
    selectedLanguage = languageSelect.value;

    generateWords(selectedLanguage, selectedDifficulty, 5, true);
}
resetBtn.addEventListener("click", () => onReset())

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
            const currentWordIndex = currentWords.indexOf(lastWord);
            if (currentWordIndex === currentWords.length - 1){
                generateWords(selectedLanguage, selectedDifficulty, 2, false)
            }
        }else{
            currentGuideWord.style.color = "red"
        }
    }
}

inputBox.addEventListener("input", () => handleUserInput())