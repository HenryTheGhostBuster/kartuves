const gameData = {
    currentWord: "darbas",
    progress: 0,
    possibleWords: ["obuolys", "bitas", "saldainis", "monitorius", "sofa"],
    chooseRandomWord: function() {
        const randomIndex = Math.floor(Math.random() * this.possibleWords.length);
        this.currentWord = this.possibleWords[randomIndex];
    }
};

// Math.random(0.5) = 1
// Math.random(2.1) = 2
// Math.floor(2.8) = 2
// Math.ceil(2.1) = 3

const UI = {
    wordElement: document.querySelector(".word"),
    progressBar: document.querySelector(".bar")
}

function generateLetters() {
    UI.wordElement.innerHTML = "";

    for (let i = 0; i < gameData.currentWord.length; i++) {
        UI.wordElement.innerHTML += "<div></div>";
    }
}

function drawProgressBar() {
    UI.progressBar.style.width = `${gameData.progress}%`;
}

function initGame() {
    renderNewWord();
    drawProgressBar();
}

initGame();

// Kai žmogus paspaudžia klaviatūros mygtuką
document.addEventListener("keydown", (e) => {
    const letter = e.key;

    console.log(letter);

    let letterFound = false;

    // Patikrinti, ar tokia raidė egzistuoja žodyje
    for (let i = 0; i < gameData.currentWord.length; i++) {
        const wordLetter = gameData.currentWord[i];

        // Jei žmogus atspėjo raidę
        if (letter === wordLetter) {
            console.log(`Žaidėjas atspėjo raidę ${i} pozicijoje`);

            UI.wordElement.childNodes[i].innerHTML = letter;
            letterFound = true;
        }
    }

    // Patikriname, ar nebuvo rasta nei viena raidė
    if (letterFound === false) {
        console.log("Pridedame žmogui baudos taškų!");
        addProgress(15);
    }

    checkLoseCondition();
    checkWinCondition();
});

function checkLoseCondition() {
    if (gameData.progress >= 100) {
        console.log("Žaidėjas pralaimėjo");
    }
}

function checkWinCondition() {
    for (let letterElement of UI.wordElement.childNodes) {
        if (letterElement.innerHTML === "")
            return;
    }

    console.log("Žodis atspėtas!");
    // Įdėjau papildomą logiką naujo žodžio sugeneravimui
    // Dar viena eilutė
}

function addProgress(progressAmount) {
    gameData.progress += progressAmount;

    // if (gameData.progress > 100)
    //     gameData.progress = 100;
    gameData.progress = Math.min(100, gameData.progress);

    drawProgressBar();
}

function renderNewWord() {
    gameData.chooseRandomWord();
    generateLetters();
}