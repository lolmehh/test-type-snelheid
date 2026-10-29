function calc_wpm(elapsed_ms, correct_chars) { //berekent de woorden per minuut
const seconds = elapsed_ms / 1000; // van milliseconden omgezet in seconden
if (seconds <=0) return 0; // voorkomt dat het door nul gedeeld word
const minutes = seconds / 60;  
const words = correct_chars / 5;
return Math.round(words / minutes); 

 }
 let startTime =null; // tijd van de eerste toets
 let correctchars = 0;
 function onkeytyped (iscorrect) {
    if (!startTime) startTime = Date.now(); 
    if (iscorrect) correctchars++;
    const elapsed = Date.now() - startTime;
    const wpm= calc_wpm(elapsed, correctchars);
    console.log('huidige snelheid', wpm, 'wpm');
    }