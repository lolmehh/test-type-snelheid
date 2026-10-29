import { getWords } from "/Backend/Words/words.js";

let currentWords = [];//words to type
let selectedDifficulty = 0;
let selectedLanguage = "nl";
let correctWords = 0;
let isAppendingWords = false;
let correctChars = 0;
let timeHistory = [];
let currentWordIndex = 0;//TODO: might want to merge with the correctwords var

const WORD_COUNT_ALG = "5char";//5char = each 5 chars of word counted as word(what wpm counters normally use)
//  <real = words are counted as words; 5char_cumulative = wpm calculated based on the total time elapsed since the start of the test and each 5 chars counted as a word

const TIMER_LENGTH = 10 //seconds


const inputBox = document.getElementById("main-input");
const wordGuideDiv = document.getElementById("Word-guide-container");
const resetBtn = document.getElementById("reset-btn");
const languageSelect = document.getElementById("language");
const difficultySelect = document.getElementById("difficulty")
const wpmLabel = document.getElementById("wpm-count")
const charLabel = document.getElementById("char-count")
const timerLabel = document.getElementById("timer")


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
    currentWordIndex = 0;

    generateWords(selectedLanguage, selectedDifficulty, 5, true);
}
resetBtn.addEventListener("click", () => onReset())

function checkUserInput(){
    //Check the user input and update the guide words accordingly

    const currentText = inputBox.value //The text inside the input field
    const lastInput = currentText[currentText.length - 1]//last written char
    const rawSplitUserText = currentText.split(" ")//Split the user text into words
    const splitUserText = rawSplitUserText.filter(str => str !== "")//avoid code breaking because of a double space
    const guideWords = wordGuideDiv.children//get the reference words
    const previousCorrectWords = correctWords;
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
            //User typed the word correctly
            correctWords++;
            correctChars += lastWord.length;
            currentGuideWord.style.color = "green";
        }else{
            currentGuideWord.style.color = "red";
        }
    }
    if (correctWords > previousCorrectWords) {
        timeHistory.push([Date.now(), correctWords, correctChars]);
    }
    for(let guideWordIndex = splitUserText.length; guideWordIndex < currentWords.length; guideWordIndex++){
        
        console.log(guideWordIndex);//debug
        guideWords[guideWordIndex].style.color = "";
    }
    guideWords[splitUserText.length - 1].style.color = "blue"//currently typing word

}

function checkUserInput_New(){
    //new user input check func
    //This one will not let you erase the already corret words
    //by just making the input field only have the current word

    const currentText = inputBox.value //The text inside the input field
    const currentWordToType = currentWords[currentWordIndex];//get the current word to type
    const GUI_guideWords = wordGuideDiv.children//get the reference words
    if (currentText.trim() === currentWordToType) {
        //check if the user typed the current word correctly
        correctWords++;
        correctChars += currentText.length;
        currentWordIndex++;//move to the next word
        inputBox.value = "";//clear the input box for the next word
        generateWords(selectedLanguage, selectedDifficulty, 1, false)        
        GUI_guideWords[1].style.color = "blue";//mark the next word as the current one
        GUI_guideWords[0].remove();
        timeHistory.push([Date.now(), correctWords, correctChars]);
    }


}

function calc_wpm_real(elasped_ms, correct_words) {
    const minutes = elasped_ms / 60000;

    if (minutes <=0) return 0;
    const words = correct_words;
    return Math.round(words / minutes);
}

function calc_wpm_fivechar(elapsed_ms, correct_chars){
    const FC_words = correct_chars / 5;

    const wordsPerMs = FC_words / elapsed_ms;
    const wordsPerMin = wordsPerMs * 1000 * 60
    console.log('correct chars', correct_chars, 'elapsed ms', elapsed_ms, 'wpm', wordsPerMin);
    return wordsPerMin;
}

function calc_wpm_fivechar_asdasdasd(elapsed_ms, correct_chars){

}

let correctchars = 0;

function onCharTyped () {
    wpmLabel.innerHTML = "Speed: -- "
    charLabel.innerHTML = "Chars: --"
    if (!startTime) startTime = Date.now();
    const elapsed = Date.now() - startTime;
    //console.log('huidige snelheid', wpm, 'wpm');
    let wpm = 0;
    checkUserInput_New();
    if (WORD_COUNT_ALG === "real"){
        wpm = calc_wpm_real(elapsed, correctWords);
    }else if (WORD_COUNT_ALG === "5char_cumulative"){
        wpm = calc_wpm_fivechar(elapsed, correctChars);
        wpm = Math.round(wpm);
    }else if (WORD_COUNT_ALG === "5char"){
        if (timeHistory.length >= 2) {
            const lastWordTime = Date.now() - timeHistory[timeHistory.length - 2][0];
            const lastCharAmount = timeHistory[timeHistory.length - 1][2] - timeHistory[timeHistory.length - 2][2];
        
        wpm = calc_wpm_fivechar(lastWordTime, timeHistory[timeHistory.length - 2][2]);
        wpm = Math.round(wpm);
        console.log('last word time', lastWordTime, 'ms');
        console.log('last element of timeHistory', timeHistory[timeHistory.length - 2]);
        }
    }
    
    wpmLabel.innerHTML = 'Speed: ' + wpm + ' wpm';
    charLabel.innerHTML = "Chars: " + correctChars;
    timerLabel.innerHTML = "Time: " + Math.round(elapsed / 1000) + "s";//TODO: this should update independently of user input
}

inputBox.addEventListener("input", () => onCharTyped());