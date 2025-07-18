const COLORS = [
    { name: 'cyan', code: '#00fff7', num: 1 },
    { name: 'rose', code: '#ff00ea', num: 2 },
    { name: 'jaune', code: '#ffe600', num: 3 },
    { name: 'vert', code: '#00ff6a', num: 4 },
    { name: 'bleu', code: '#007bff', num: 5 },
    { name: 'orange', code: '#ff9900', num: 6 }
];
let COMB_LEN = 4;
let secret = [];
let currentGuess = [];
let guesses = [];
let gameOver = false;

function randomCombination() {
    let arr = [];
    for (let i = 0; i < COMB_LEN; i++) {
        arr.push(Math.floor(Math.random() * COLORS.length));
    }
    return arr;
}

function renderColorChoices() {
    const colorChoices = document.getElementById('colorChoices');
    colorChoices.innerHTML = '';
    COLORS.forEach((color, idx) => {
        const btn = document.createElement('button');
        btn.className = 'color-btn';
        btn.style.background = color.code;
        btn.title = color.name;
        btn.onclick = () => {
            if (gameOver || currentGuess.length >= COMB_LEN) return;
            currentGuess.push(idx);
            renderCurrentGuess();
        };
        colorChoices.appendChild(btn);
    });
}

function renderModeButtons() {
    const modeDiv = document.getElementById('modeButtons');
    modeDiv.innerHTML = '';
    const modes = [4, 6, 8];
    modes.filter(m => m !== COMB_LEN).forEach(m => {
        const btn = document.createElement('button');
        btn.textContent = 'x' + m;
        btn.className = 'dir-btn master-action';
        btn.style.margin = '0 6px 0 6px';
        btn.onclick = () => switchMode(m);
        modeDiv.appendChild(btn);
    });
}
function switchMode(newLen) {
    COMB_LEN = newLen;
    resetGame();
    renderModeButtons();
}

function renderCurrentGuess() {
    renderModeButtons();
    const guessesDiv = document.getElementById('guesses');
    let html = '';
    // Affiche les anciennes propositions
    guesses.forEach(g => {
        html += renderGuessRow(g.guess, g.feedback);
    });
    // Affiche la proposition en cours
    if (!gameOver) {
        html += renderGuessRow(currentGuess, null, true);
    }
    guessesDiv.innerHTML = html;
}

function renderGuessRow(guess, feedback, isCurrent = false) {
    let row = '<div class="guess-row" style="margin:4px 0;">';
    for (let i = 0; i < COMB_LEN; i++) {
        const idx = guess[i];
        row += `<div class="color-btn" style="background:${idx !== undefined ? COLORS[idx].code : 'transparent'};opacity:${idx !== undefined ? 1 : 0.15};border:2px solid #222;margin:0 2px;"></div>`;
    }
    row += '<div class="feedback" style="margin-left:8px;">';
    if (feedback) {
        feedback.forEach(f => {
            row += `<div class="feedback-dot" style="background:${f === 'black' ? '#111' : f === 'white' ? '#fff' : 'transparent'};opacity:${f ? 1 : 0.2};"></div>`;
        });
    } else if (isCurrent) {
        for (let i = 0; i < COMB_LEN; i++) {
            row += `<div class="feedback-dot" style="background:transparent;opacity:0.2;"></div>`;
        }
    }
    row += '</div></div>';
    return row;
}

function getFeedback(guess, secret) {
    let feedback = [];
    let secretUsed = Array(COMB_LEN).fill(false);
    let guessUsed = Array(COMB_LEN).fill(false);
    // Noir : bonne couleur, bonne place
    for (let i = 0; i < COMB_LEN; i++) {
        if (guess[i] === secret[i]) {
            feedback.push('black');
            secretUsed[i] = true;
            guessUsed[i] = true;
        }
    }
    // Blanc : bonne couleur, mauvaise place
    for (let i = 0; i < COMB_LEN; i++) {
        if (!guessUsed[i]) {
            for (let j = 0; j < COMB_LEN; j++) {
                if (!secretUsed[j] && guess[i] === secret[j]) {
                    feedback.push('white');
                    secretUsed[j] = true;
                    break;
                }
            }
        }
    }
    // Complète à 4/6/8
    while (feedback.length < COMB_LEN) feedback.push('');
    // Pour l'affichage, on met les noirs d'abord puis les blancs
    feedback = feedback.filter(f => f === 'black').concat(feedback.filter(f => f === 'white')).concat(feedback.filter(f => f === ''));
    return feedback;
}

function submitGuess() {
    if (gameOver || currentGuess.length < COMB_LEN) return;
    const feedback = getFeedback(currentGuess, secret);
    guesses.push({ guess: currentGuess.slice(), feedback });
    renderCurrentGuess();
    if (feedback.filter(f => f === 'black').length === COMB_LEN) {
        document.getElementById('result').innerHTML = '<span style="color:#00ff6a">Bravo ! Tu as trouvé la combinaison !</span>';
        gameOver = true;
        document.getElementById('submitGuess').disabled = true;
    } else if (guesses.length >= 10) {
        document.getElementById('result').innerHTML = `<span style='color:#ff00ea'>Perdu ! La combinaison était : ${secret.map(i => `<span class='color-btn' style='background:${COLORS[i].code};width:20px;height:20px;margin:0 2px;'></span>`).join('')}</span>`;
        gameOver = true;
        document.getElementById('submitGuess').disabled = true;
    } else {
        currentGuess = [];
        document.getElementById('result').innerHTML = '';
    }
    renderCurrentGuess();
}

function resetGame() {
    secret = randomCombination();
    currentGuess = [];
    guesses = [];
    gameOver = false;
    document.getElementById('result').innerHTML = '';
    document.getElementById('submitGuess').disabled = false;
    renderColorChoices();
    renderCurrentGuess();
    renderColorLegend();
}

function renderColorLegend() {
    let legend = COLORS.map(c => `<span style='display:inline-block;margin:0 8px;'><span class="color-btn" style="background:${c.code};width:22px;height:22px;vertical-align:middle;"></span> <span style='color:#00fff7;font-weight:bold;'>${c.num}</span></span>`).join('');
    let legendDiv = document.getElementById('colorLegend');
    if (!legendDiv) {
        legendDiv = document.createElement('div');
        legendDiv.id = 'colorLegend';
        legendDiv.style.textAlign = 'center';
        legendDiv.style.marginBottom = '8px';
        document.getElementById('modeButtons').after(legendDiv);
    }
    legendDiv.innerHTML = legend;
}

document.getElementById('submitGuess').onclick = submitGuess;
document.getElementById('submitGuess').classList.add('master-action');

// Permet de retirer une couleur de la proposition en cours (tap sur une pastille déjà posée)
document.getElementById('guesses').addEventListener('click', function(e) {
    if (gameOver) return;
    if (e.target.classList.contains('color-btn')) {
        const idx = Array.from(e.target.parentNode.children).indexOf(e.target);
        if (idx >= 0 && idx < currentGuess.length) {
            currentGuess.splice(idx, 1);
            renderCurrentGuess();
        }
    }
});

// Ajoute un bouton recommencer si on veut
const mastermindContainer = document.getElementById('mastermindContainer');
const restartBtn = document.createElement('button');
restartBtn.textContent = 'Nouvelle partie';
restartBtn.className = 'dir-btn master-action';
restartBtn.style.marginTop = '16px';
restartBtn.onclick = resetGame;
mastermindContainer.appendChild(restartBtn);

resetGame();
renderModeButtons();
renderColorLegend(); 