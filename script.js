const gameData = {
    currentWord: "-",
    progress: 0,
    progressBarStep: 5,
    difficulty: 'easy',
    paused: false,
    possibleWords: ["obuolys", "bitas", "saldainis", "monitorius", "sofa", 'darbuotojas', 'centras', 'naujas', 'dabar', 'svarbus', 'elementas', 'darbininkas', 'durys', 'stalas', 'gyventojas', 'veiksmas', 'programavimas', 'kompiuteris', 'sistema', 'programa', 'koja', 'ranka', 'raktas', 'butelys', 'baterija', 'padanga', 'lempa', 'televizorius', 'rankena', 'garsas', 'langas', 'tarpas', 'kelias'],
    chooseRandomWord: function() {
        const randomIndex = Math.floor(Math.random() * this.possibleWords.length);
        this.currentWord = this.possibleWords[randomIndex];
    }
};

const UI = {
    wordElement: document.querySelector(".word"),
    progressBar: document.querySelector(".bar"),
    easyButton: document.querySelector('#easyButton'),
    mediumButton: document.querySelector('#mediumButton'),
    hardButton: document.querySelector('#hardButton'),
    popup: document.querySelector('.popup')
}

// Pasirinkto žodžio raidžių generavimas
function generateLetters() {
    UI.wordElement.innerHTML = "";

    for (let i = 0; i < gameData.currentWord.length; i++) {
        UI.wordElement.innerHTML += "<div></div>";
    }
}

// Perpiešti progreso laukelį su naujais duomenim
function drawProgressBar() {
    UI.progressBar.style.width = `${gameData.progress}%`;
}

// Patikrinti ar žaidėjas pralaimėjo
function checkLoseCondition() {
    if (gameData.progress >= 100) {
        gameData.progress = 0;
        gameData.paused = true;

        UI.popup.style.color = 'red';
        UI.popup.innerHTML = 'Pralaimėjai!'
        UI.popup.style.display = 'block';
    
        setTimeout(() => {
            UI.popup.style.display = 'none';
            gameData.paused = false;
            renderNewWord();
            drawProgressBar();
        }, 2600)
    }
}

// Patikrinti ar žaidėjas laimėjo
function checkWinCondition() {
    for (let letterElement of UI.wordElement.childNodes) {
        if (letterElement.innerHTML === "")
            return;
    }

    gameData.progress = 0;
    gameData.paused = true;

    UI.popup.style.color = 'green';
    UI.popup.innerHTML = 'Atspėjai žodį!'
    UI.popup.style.display = 'block';

    setTimeout(() => {
        UI.popup.style.display = 'none';
        gameData.paused = false;
        renderNewWord();
        drawProgressBar();
    }, 2600)
}

// Pridėti duotąjį kiekį progreso prie progreso laukelio
function addProgress(progressAmount) {
    if (!gameData.paused) {
        gameData.progress += progressAmount;
        gameData.progress = Math.min(100, gameData.progress);

        drawProgressBar();
    }
}

// Pasirinkti naują žodį
function renderNewWord() {
    gameData.chooseRandomWord();
    generateLetters();
}

// Visiem sunkumo mygtukam pakeisti klases į 'notSelected'
function unselectAllButtons() {
    for (let c of document.querySelector('.buttonWrapper').children) {
        c.classList.remove('selected');
        c.classList.add('notSelected');
        c.disabled = false;
    }
}

// Sunkumo mygtuko paspaudimo funkcija
function onDifficultyButtonClick(buttonElement, difficultyName, newProgressBarStep) {
    unselectAllButtons();
    buttonElement.classList.add('selected');
    buttonElement.classList.remove('notSelected');
    buttonElement.disabled = true;
    gameData.difficulty = difficultyName;
    gameData.progressBarStep = newProgressBarStep;
    gameData.progress = 0;
    renderNewWord();
    drawProgressBar();
    document.activeElement.blur();
}

// Inicijuoti žaidimą
function initGame() {
    UI.easyButton.disabled = true;
    renderNewWord();
    drawProgressBar();
}

initGame();

// Kai žaidėjas paspaudžia klaviatūros mygtuką
document.addEventListener("keydown", (e) => {
    const letter = e.key;
    let letterFound = false;

    // Patikrinti, ar tokia raidė egzistuoja žodyje
    for (let i = 0; i < gameData.currentWord.length; i++) {
        const wordLetter = gameData.currentWord[i];

        // Jei žaidėjas atspėjo raidę
        if (letter === wordLetter) {
            if (UI.wordElement.childNodes[i].innerHTML === '') {
                UI.wordElement.childNodes[i].style.color = 'green';
                UI.wordElement.childNodes[i].innerHTML = letter;

                setTimeout(() => {
                    try {
                        UI.wordElement.childNodes[i].style.color = '#fff';
                    } catch(e) {} // kitaip čia erroras būna, jei per daug greitai vedi raides, gerai bus :D
                }, 200);
            }

            letterFound = true;
        }
    }

    // Patikriname, ar nebuvo rasta nei viena raidė
    if (!letterFound) {
        UI.progressBar.style.backgroundColor = 'red';
        addProgress(gameData.progressBarStep);

        setTimeout(() => {
            try {
                UI.progressBar.style.backgroundColor = '#fff';
            } catch(e) {}
        }, 100);

        // 'new Audio' variantas dažniau išmeta konsolėj klaidą nors klaida nieko neįtakoja
        // klaida atsiranda tik užsikrovus žaidimui

        new Audio('sounds/short_beep.mp3').play();
        // document.getElementById('shortBeep').play();
    } else {
        new Audio('sounds/soft_beep.mp3').play();
        // document.getElementById('softBeep').play();
    }

    checkLoseCondition();
    checkWinCondition();
});

// Kai žaidėjas paspaudžia 'lengvo' sunkumo mygtuką
UI.easyButton.addEventListener('click', () => {
    document.body.style.background = 'rgb(0,36,27)';
    document.body.style.background = 'linear-gradient(352deg, rgba(0,36,27,1) 0%, rgba(9,121,93,1) 35%, rgba(0,255,192,1) 100%)';
    onDifficultyButtonClick(UI.easyButton, 'easy', 5);
});

// Kai žaidėjas paspaudžia 'vidutinio' sunkumo mygtuką
UI.mediumButton.addEventListener('click', () => {
    document.body.style.background = 'rgb(36,24,0)';
    document.body.style.background = 'linear-gradient(352deg, rgba(36,24,0,1) 0%, rgba(121,84,9,1) 35%, rgba(255,171,0,1) 100%)';
    onDifficultyButtonClick(UI.mediumButton, 'medium', 15);
});

// Kai žaidėjas paspaudžia 'sunkaus' sunkumo mygtuką
UI.hardButton.addEventListener('click', () => {
    document.body.style.background = 'rgb(36,0,0)';
    document.body.style.background = 'linear-gradient(352deg, rgba(36,0,0,1) 0%, rgba(121,9,9,1) 35%, rgba(255,0,0,1) 100%)';
    onDifficultyButtonClick(UI.hardButton, 'hard', 30);
});
