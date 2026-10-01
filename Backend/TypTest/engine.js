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
    let appendWords = 5;
    if (replace){
        currentWords = await getWords(lang, difficulty, n);
        wordGuideDiv.replaceChildren();
    
    }else{
        currentWords.push(await getWords(lang, difficulty, n));
        appendWords = 2;
    }

    
    for (let wordIndex = currentWords.length - appendWords; wordIndex < currentWords.length; wordIndex++) {
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

function calc_wpm(elasped_ms, correct_chars) {
    const minutes = elasped_ms / 60000;

    if (minutes <=0) return 0;
    const words = correct_chars / 5;
    return Math.round(words / minutes);
}

let startTime =null;

let correctchars = 0;

function onkeytyped (iscorrect) {
    if (!startTime) startTime = Date.now();
    if (iscorrect) correctchars++;
    const elapsed = Date.now() - startTime;
    const wpm= calc_wpm(elapsed, correctchars);
    console.log('huidige snelheid', wpm, 'wpm');
}

inputBox.addEventListener("input", () => handleUserInput())