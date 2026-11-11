import dutch_words from "../../data/words/dutch/dutch_words_clean_rated.json" with { type: "json" };
import english_words from "../../data/words/english/englosh_words_clean_rated.json" with { type: "json" };

export async function getWords(lang = "en", difficulty = 0, amount = 1){
    /*
    Function to get a list of random words of langluage [lang] and difficulty [difficulty]
    lang: string, en or nl
    difficulty: integer, 0 - 5
    amount: integer, number of words to return
    Returns: array of words with [amount] elements
    */
    let word_dataset;
    let words = [];
    if(lang === "en"){
        word_dataset = english_words;
    } else if(lang === "nl"){
        word_dataset = dutch_words;
    }
    word_dataset = word_dataset.filter(word => word.difficulty === difficulty);
    word_dataset = word_dataset.map(word => word.word);

    for (let i = 0; i < amount; i++) {
        const randomIndex = Math.floor(Math.random() * word_dataset.length);
        words.push(word_dataset[randomIndex]);
    }
    return words;
}