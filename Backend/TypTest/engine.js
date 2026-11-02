import { getWords } from "/Backend/Words/words.js";

let currentWords = [];//words to type
let selectedDifficulty = 0;
let selectedLanguage = "nl";
let correctWords = 0;
let isAppendingWords = false;
let correctChars = 0;
let timeHistory = [];
let currentWordIndex = 0;//TODO: might want to merge with the correctwords var
let WPMHistory = [];//history of the wpm over time, for graphing purposes. idk if we have time for that although
let scheduledTimerUpdate = null;

const WORD_COUNT_ALG = "real_cumulative";//5char = each 5 chars of word counted as word(what wpm counters normally use)
//  <real = words are counted as words; 5char_cumulative = wpm calculated based on the total time elapsed since the start of the test and each 5 chars counted as a word

const TIMER_LENGTH = 10; //seconds
const COUNT_SPACES = true;//whether to require space at the end of word to continue to next

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
    scheduledTimerUpdate = null;
    wpmLabel.innerHTML = "Speed: -- "
    charLabel.innerHTML = "Chars: --"
    timerLabel.innerHTML = "Time: 0s / " + TIMER_LENGTH + "s"

    generateWords(selectedLanguage, selectedDifficulty, 5, true);
}
resetBtn.addEventListener("click", () => onReset())



function checkUserInput_New(){
    //new user input check func
    //This one will not let you erase the already corret words
    //by just making the input field only have the current word

    const currentText = inputBox.value //The text inside the input field
    const currentWordToType = currentWords[currentWordIndex];//get the current word to type
    const GUI_guideWords = wordGuideDiv.children//get the reference words
    let satisfiesTypingConditions = true;//will be set to false if does not satisfy one
    let typedChars = 0;
    if (COUNT_SPACES){
        //if the user is required to type a space at the end of the word
        satisfiesTypingConditions = currentText.endsWith(" ");
    }
    if (currentText.trim() === currentWordToType && satisfiesTypingConditions) {
        //check if the user typed the current word correctly
        correctWords++;
        typedChars = currentWordToType.length;
        correctChars += typedChars;
        
        currentWordIndex++;//move to the next word
        inputBox.value = "";//clear the input box for the next word
        generateWords(selectedLanguage, selectedDifficulty, 1, false)        
        GUI_guideWords[1].style.color = "blue";//mark the next word as the current one
        GUI_guideWords[0].remove();
        timeHistory.push([Date.now(), correctWords, correctChars, typedChars]);
        return true;//new word typed
    }
    return false;//no new word typed

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

function updateTimer(){
    let elapsed = Date.now() - startTime;
    timerLabel.innerHTML = "Time: " + Math.round(elapsed / 1000) + "s / " + TIMER_LENGTH + "s";
    if (elapsed >= TIMER_LENGTH * 1000){
        clearInterval(scheduledTimerUpdate);
        scheduledTimerUpdate = null;
        inputBox.disabled = true;
    }
}

function onCharTyped () {

    if (!startTime){
        //then the timer starts... NOW!
        startTime = Date.now();
        scheduledTimerUpdate = setInterval(updateTimer, 1000);
    }
    const elapsed = Date.now() - startTime;
    //console.log('huidige snelheid', wpm, 'wpm');
    let wpm = 0;
    let newWordTyped = checkUserInput_New();
    if (newWordTyped){
        //now calculate the wpm based on the selected algorithm
        let typedChars = 0;
        let typedWords = 0;
        let elapsedTime = 0;
        if (WORD_COUNT_ALG.search("cumulative") !== -1){
            //Means we take all the typed chars and words and total time
            typedChars = correctChars;  
            typedWords = correctWords;
            elapsedTime = elapsed;
        }else{
            //Means we only take the last typed word and chars and the time it took to type that word
            if (timeHistory.length >= 2) {
                typedChars = timeHistory[timeHistory.length - 1][3];
                typedWords = 1;
                elapsedTime = timeHistory[timeHistory.length - 1][0] - timeHistory[timeHistory.length - 2][0];
            }
        }

        if (WORD_COUNT_ALG.search("real") !== -1){
            wpm = calc_wpm_real(elapsedTime, typedWords);
        }else if (WORD_COUNT_ALG.search("5char") !== -1){
            wpm = calc_wpm_fivechar(elapsedTime, typedChars);
        }
        wpm = Math.round(wpm);


        
        wpmLabel.innerHTML = 'Speed: ' + wpm + ' wpm';
        charLabel.innerHTML = "Chars: " + correctChars;
    }
}

inputBox.addEventListener("input", () => onCharTyped());