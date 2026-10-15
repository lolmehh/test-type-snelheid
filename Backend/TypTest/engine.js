import { getWords } from "/Backend/Words/words.js";

let currentWords = [];
let selectedDifficulty = 0;
let selectedLanguage = "nl";
let correctWords = 0;
let isAppendingWords = false;
let correctChars = 0;

let WORD_COUNT_ALG = "5char";//5char = each 5 chars counted as word(what wpm counters normally use)
//  <real = words are counted as words

const inputBox = document.getElementById("main-input");
const wordGuideDiv = document.getElementById("Word-guide-container");
const resetBtn = document.getElementById("reset-btn");
const languageSelect = document.getElementById("language");
const difficultySelect = document.getElementById("difficulty")
const wpmLabel = document.getElementById("wpm-count")
const charLabel = document.getElementById("char-count")

const TIMER_LENGTH = 10 //seconds
let startTime =null;

async function generateWords(lang, difficulty, n, replace = true) {
    let firstWordIndex = 0;
    if (replace){
        currentWords = await getWords(lang, difficulty, n);
        wordGuideDiv.replaceChildren();
    
    }else{
        const newWords = await getWords(lang, difficulty, n);
        firstWordIndex = currentWords.length;
        currentWords.push(...newWords);
    }

    
    for (let wordIndex = firstWordIndex; wordIndex < currentWords.length; wordIndex++) {
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
    correctWords = 0;
    correctChars = 0;
    

    generateWords(selectedLanguage, selectedDifficulty, 5, true);
}
resetBtn.addEventListener("click", () => onReset())

function checkUserInput(){
    const currentText = inputBox.value //The text that is inside the input field
    const lastInput = currentText[currentText.length - 1]//last written char
    const rawSplitUserText = currentText.split(" ")//Split the user text into words
    const splitUserText = rawSplitUserText.filter(str => str !== "")//avoid code breaking because of a double space
    const guideWords = wordGuideDiv.children//get the reference words
    correctWords = 0;//reset counter (going to count again)
    correctChars = 0;
    if(splitUserText.length >= currentWords.length - 1 && !isAppendingWords){
        //If code is running out of guide words generate more
        isAppendingWords = true;
        generateWords(selectedLanguage, selectedDifficulty, 5, false)
            .finally(() => { isAppendingWords = false; });
    }
    for(let wordIndex = 0; wordIndex < splitUserText.length; wordIndex++){
        //Go through each word user typed and compare to the actual one
        const lastWord = splitUserText[wordIndex];//user word
        const currentGuideWord = guideWords[wordIndex];// reference word
        if(lastWord === currentWords[wordIndex]){
            correctWords++;
            correctChars += lastWord.length;
            currentGuideWord.style.color = "green";
        }else{
            currentGuideWord.style.color = "red";
        }
    }
    for(let guideWordIndex = splitUserText.length; guideWordIndex < currentWords.length; guideWordIndex++){
        
        console.log(guideWordIndex);//debug
        guideWords[guideWordIndex].style.color = "";
    }
    guideWords[splitUserText.length - 1].style.color = "blue"//currently typing word
    /* old code vvvvvvv
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
        */
    

}

function calc_wpm_real(elasped_ms, correct_words) {
    const minutes = elasped_ms / 60000;

    if (minutes <=0) return 0;
    const words = correct_words / 5;
    return Math.round(words / minutes);
}

function calc_wpm_fivechar(elapsed_ms, correct_chars){
    const FC_words = correct_chars / 5;

    const wordsPerMs = FC_words / elapsed_ms;
    const wordsPerMin = wordsPerMs * 1000 * 60
    return wordsPerMin;
}

let correctchars = 0;

function onCharTyped (iscorrect) {
    wpmLabel.innerHTML = "Speed: -- "
    charLabel.innerHTML = "Chars: --"
    if (!startTime) startTime = Date.now();
    if (iscorrect) correctchars++;
    const elapsed = Date.now() - startTime;
    //console.log('huidige snelheid', wpm, 'wpm');
    let wpm = 0;
    checkUserInput();
    if (WORD_COUNT_ALG === "real"){
        wpm = calc_wpm_real(elapsed, correctWords);
    }else if (WORD_COUNT_ALG === "5char"){
        wpm = calc_wpm_fivechar(elapsed, correctChars);
        wpm = Math.round(wpm);
    }
    
    wpmLabel.innerHTML = 'Speed: ' + wpm + ' wpm';
    charLabel.innerHTML = "Chars: " + correctChars;
}

inputBox.addEventListener("input", () => onCharTyped());