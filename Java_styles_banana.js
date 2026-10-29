//dark mode
const get_light = document.getElementById("get_light")
const get_dark = document.getElementById("get_dark")  //de knoppies

const enable_darkmode = () => {  
    document.body.classList.add("darkmode")
    localStorage.setItem("darkmode", "active")
    document.getElementById("get_light").disabled = false;
    document.getElementById("get_dark").disabled = true;
}
const disable_darkmode = () => {
    document.body.classList.remove("darkmode")
    localStorage.setItem("darkmode", null)
    document.getElementById("get_dark").disabled = false;
    document.getElementById("get_light").disabled = true;
}

const check_storage = () => {
    if(localStorage.getItem("darkmode") == "active") {enable_darkmode()}
    else {disable_darkmode()}
} //zodat ie onthoudt hoe ie stond


get_light.addEventListener("click", () => {disable_darkmode()})
get_dark.addEventListener("click", () => {enable_darkmode()})


// dropdwon
const knopje_menu = document.getElementsById("knopje_menu")
const menuutje = document.getElementById("menuutje")

knopje_menu.addEventListener("click", () =>{
    if (menuutje.classList.contains("show")) { document.body.classList.remove("show")}
    else {document.body.classList.add("show")}
})

//settings.addEventListener("click", () => {document.getElementById("menuutje").classList.toggle("show")})

//window.onclick = function(e) {
  //  if (!e.target.matches('.knopje_menu')) {
    //var menuutje = document.getElementById("menuutje")
      //if (menuutje.classList.contains('show')) {
        //menuutje.classList.remove('show')
    //  }
  //  }
//  }

window.onclick = function(klik) {
    if (!(klik.target.matches("knopje_menu"))) {
        if (menuutje.classList.contains("show")) {menuutje.classList.remove("show")}
    }
}
