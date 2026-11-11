//dark mode, taal en moeilijkheidsniveaus
const get_light = document.getElementById("get_light")
const get_dark = document.getElementById("get_dark")
const to_English = document.getElementById("to_English")
const to_Dutch = document.getElementById("to_Dutch")
const languageSelect = document.getElementById("language")
const difficultySelect = document.getElementById("difficulty")
const durationSelect = document.getElementById("test-duration")

const difficultyButtons = [
  document.getElementById("to_makkelijk"),
  document.getElementById("to_gemiddeld"),
  document.getElementById("to_moeizaam"),
  document.getElementById("to_ingewikkeld"),
  document.getElementById("to_onmogelijk")
]

const durationButtons = [
  document.getElementById("to_10sec"),
  document.getElementById("to_20sec"),
  document.getElementById("to_30sec"),
  document.getElementById("to_60sec")
]

function setLanguage(lang) {
  const safeLang = (lang || "nl").toLowerCase()
  if (languageSelect && languageSelect.value !== safeLang) {
    languageSelect.value = safeLang
    languageSelect.dispatchEvent(new Event("change", { bubbles: true }))
  }
  localStorage.setItem("language", safeLang)

  if (to_English) to_English.disabled = safeLang === "en"
  if (to_Dutch) to_Dutch.disabled = safeLang === "nl"
}

function setDifficulty(level) {
  const safeLevel = Math.max(0, Math.min(4, Number(level) || 0))

  if (difficultySelect && difficultySelect.value !== String(safeLevel)) {
    difficultySelect.value = String(safeLevel)
    difficultySelect.dispatchEvent(new Event("change", { bubbles: true }))
  }
  localStorage.setItem("difficulty", String(safeLevel))

  difficultyButtons.forEach((button, index) => {
    if (!button) return
    button.disabled = index === safeLevel
  })
}

function setDuration(seconds) {
  const allowedDurations = [10, 20, 30, 60]
  const safeDuration = allowedDurations.includes(Number(seconds)) ? Number(seconds) : 20

  if (durationSelect && durationSelect.value !== String(safeDuration)) {
    durationSelect.value = String(safeDuration)
    durationSelect.dispatchEvent(new Event("change", { bubbles: true }))
  }
  localStorage.setItem("testDuration", String(safeDuration))

  durationButtons.forEach((button) => {
    if (!button) return
    button.disabled = Number(button.dataset.duration) === safeDuration
  })
}

//darkmode
const enable_darkmode = () => {  
    document.body.classList.add("darkmode")
    localStorage.setItem("darkmode", "active")
    if (document.getElementById("get_light")) document.getElementById("get_light").disabled = false;
    if (document.getElementById("get_dark")) document.getElementById("get_dark").disabled = true;
}
const disable_darkmode = () => {
    document.body.classList.remove("darkmode")
    localStorage.setItem("darkmode", "inactive")
    if (document.getElementById("get_dark")) document.getElementById("get_dark").disabled = false;
    if (document.getElementById("get_light")) document.getElementById("get_light").disabled = true;
}

const check_storage = () => {
    if(localStorage.getItem("darkmode") == "active") {enable_darkmode()}
    else {disable_darkmode()}

    const savedLang = localStorage.getItem("language") || "nl"
    setLanguage(savedLang)

    const savedDifficulty = localStorage.getItem("difficulty") || "0"
    setDifficulty(savedDifficulty)

    const savedDuration = localStorage.getItem("testDuration") || "20"
    setDuration(savedDuration)
} //zodat ie onthoudt hoe ie stond

if (get_light) get_light.addEventListener("click", () => {disable_darkmode()})
if (get_dark) get_dark.addEventListener("click", () => {enable_darkmode()})
if (to_English) to_English.addEventListener("click", () => {setLanguage("en")})
if (to_Dutch) to_Dutch.addEventListener("click", () => {setLanguage("nl")})

difficultyButtons.forEach((button) => {
  if (!button) return
  button.addEventListener("click", () => {
    setDifficulty(button.dataset.difficulty)
  })
})

durationButtons.forEach((button) => {
  if (!button) return
  button.addEventListener("click", () => {
    setDuration(button.dataset.duration)
  })
})

const infoButton = document.getElementById("info-button")
const infoPopup = document.getElementById("info-pop-up")
const closeInfoPopup = document.getElementById("close-info-pop-up")

if (infoButton && infoPopup) {
  infoButton.addEventListener("click", () => {
    infoPopup.classList.remove("hidden")
    infoPopup.classList.add("show")
  })
}

if (closeInfoPopup && infoPopup) {
  closeInfoPopup.addEventListener("click", () => {
    infoPopup.classList.remove("show")
    infoPopup.classList.add("hidden")
  })
}

if (infoPopup) {
  infoPopup.addEventListener("click", (event) => {
    if (event.target === infoPopup) {
      infoPopup.classList.remove("show")
      infoPopup.classList.add("hidden")
    }
  })
}

// dropdown
const knopje_menu = document.getElementById("knopje_menu")
const menuutje = document.getElementById("menuutje")

if (knopje_menu && menuutje) {
  knopje_menu.addEventListener("click", () => {
    const isOpen = menuutje.classList.toggle("show")
    knopje_menu.setAttribute("aria-expanded", String(isOpen))
  })
  window.addEventListener("click", function(e) {
    if (!(e.target instanceof Element) || e.target.closest("#knopje_menu")) return
    menuutje.classList.remove("show")
    knopje_menu.setAttribute("aria-expanded", "false")
  })
}

check_storage()
