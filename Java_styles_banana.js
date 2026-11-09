//dark mode, niveau en taal
//de knoppies
const get_light = document.getElementById("get_light")
const get_dark = document.getElementById("get_dark")
const to_English = document.getElementById("to_English")
const to_Dutch = document.getElementById("to_Dutch")
const to_easy = document.getElementById("to_easy")
const to_medium = document.getElementById("to_medium")
const to_hard = document.getElementById("to_hard")

//darkmode
const enable_darkmode = () => {  
    document.body.classList.add("darkmode")
    localStorage.setItem("darkmode", "active")
    document.getElementById("get_light").disabled = false;
    document.getElementById("get_dark").disabled = true;
}
const disable_darkmode = () => {
    document.body.classList.remove("darkmode")
    localStorage.setItem("darkmode", "inactive")
    document.getElementById("get_dark").disabled = false;
    document.getElementById("get_light").disabled = true;
}
//niveau
const enable_easy_mode = () => {
    //nu moet easy dus ff aan maar ik weet niet hoe dat gaat
    localStorage.setItem("niveau", "easy")
    document.getElementById("to_easy").disabled = true;  
    document.getElementById("to_medium").disabled = false;
    document.getElementById("to_hard").disabled = false;  
}
const enable_medium_mode = () => {
    //ditto
    localStorage.setItem("niveau", "medium")
    document.getElementById("to_medium").disabled = true;  
    document.getElementById("to_easy").disabled = false;
    document.getElementById("to_hard").disabled = false;  
}
const enable_hard_mode = () => {
    //ditto
    localStorage.setItem("niveau", "hard")
    document.getElementById("to_hard").disabled = true;  
    document.getElementById("to_medium").disabled = false;
    document.getElementById("to_easy").disabled = false;  
}

const check_storage = () => {
    if(localStorage.getItem("darkmode") == "active") {enable_darkmode()}
    else {disable_darkmode()}
    if(localStorage.getItem("niveau") == "medium") {enable_medium_mode()}
    else if(localStorage.getItem("niveau") == "hard") {enable_hard_mode()}
    else {enable_easy_mode()}
} //zodat ie onthoudt hoe ie stond


get_light.addEventListener("click", () => {disable_darkmode()})
get_dark.addEventListener("click", () => {enable_darkmode()})
to_easy.addEventListener("click", () => {enable_easy_mode()})
to_medium.addEventListener("click", () => {enable_medium_mode()})
to_hard.addEventListener("click", () => {enable_hard_mode()})


// dropdwon
const knopje_menu = document.getElementsById("knopje_menu")
const menuutje = document.getElementById("menuutje")

knopje_menu.addEventListener("click", () => {menuutje.classList.toggle("show")})
window.onclick = function(e) {
    if (!(e.target.matches("knopje_menu")) && menuutje.classList.contains("show")) {menuutje.classList.remove("show")}
}
