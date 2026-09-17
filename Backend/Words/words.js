import dutch_words from "../data/words/dutch/words.json" with { type: "json" };
import english_words from "../data/words/english/words.json" with { type: "json" };

async function getWords(lang = "en", difficulty = 0, amount = 1){
    /*
    Function to get a list of random words of langluage [lang] and difficulty [difficulty]
    lang: string, en or nl
    difficulty: integer, 0 - 5
    amount: integer, number of words to return
    Returns: array of words with [amount] elements
    */
    const difficulty_levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
    const dutch_word_length_to_difficulty = [[0,6], [2,8], [4,10], [6,12], [8,14], [10,16]]; 

    let word_dataset;
    let words = [];
    
    if(lang === "en"){
         word_dataset = english_words.filter(word => word.level === difficulty_levels[difficulty]);
            word_dataset = word_dataset.map(word => word.word);
    } else if(lang === "nl"){
        word_dataset = dutch_words;
        //Since i did not find any json datasets with difficulty labels, the code will try to assume the difficulty
        let word_length_bounds = dutch_word_length_to_difficulty[difficulty];
        word_dataset = dutch_words.filter(word => word.word.length >= word_length_bounds[0] && word.word.length <= word_length_bounds[1]);
        word_dataset = word_dataset.map(word => word.word);
    }
    for (let i = 0; i < amount; i++) {
        const randomIndex = Math.floor(Math.random() * word_dataset.length);
        words.push(word_dataset[randomIndex]);
    }
    return words;
}


//console.log(getWords("nl", 5, 5));