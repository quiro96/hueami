
// Funzione hash per generare valori pseudo-casuali deterministici
function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Converte a 32 bit integer
    }
    return hash;
}

// Funzione per ottenere una stringa deterministica basata su data e ora
function getDeterministicString() {
    const now = new Date();
    const datetimeString = now.toISOString();
    return datetimeString;
}

// Funzione per generare un numero pseudo-casuale tra min e max basato su una stringa hash
function deterministicRandom(min, max, seed) {
    const hash = hashString(seed);
    const random = (hash % (max - min + 1)) + min;
    return random;
}

// Funzione per generare un colore deterministico in formato esadecimale
function generateDeterministicColor(seed) {
    const r = deterministicRandom(0, 255, seed + 'r');
    const g = deterministicRandom(0, 255, seed + 'g');
    const b = deterministicRandom(0, 255, seed + 'b');
    return '#' + r.toString(16).padStart(2, '0') +
                 g.toString(16).padStart(2, '0') +
                 b.toString(16).padStart(2, '0');
}

// Funzione per generare una frequenza deterministica tra 200 e 1000 Hz
function generateDeterministicFrequency(seed) {
    return deterministicRandom(200, 1000, seed + 'f');
}

// Funzione per generare un deltaF deterministico tra 0 e 100 Hz
function generateDeterministicDeltaF(seed) {
    return deterministicRandom(0, 100, seed + 'd');
}

// Funzione per generare un angolo deterministico tra 0 e 360 gradi
function generateDeterministicAngle(seed) {
    return deterministicRandom(0, 360, seed + 'a');
}

// Ottieni la stringa deterministica basata su data e ora
const deterministicString = getDeterministicString();

// Inizializza variabili deterministiche
let currentFrequency = generateDeterministicFrequency(deterministicString);
let targetFrequency = generateDeterministicFrequency(deterministicString + 'target');
let currentDeltaF = generateDeterministicDeltaF(deterministicString);
let targetDeltaF = generateDeterministicDeltaF(deterministicString + 'target');

let currentColor1 = generateDeterministicColor(deterministicString + 'color1');
let targetColor1 = generateDeterministicColor(deterministicString + 'targetColor1');
let currentColor2 = generateDeterministicColor(deterministicString + 'color2');
let targetColor2 = generateDeterministicColor(deterministicString + 'targetColor2');
let currentAngle = generateDeterministicAngle(deterministicString);
let targetAngle = generateDeterministicAngle(deterministicString + 'target');

let transitionTime = 10; // Tempo di transizione in secondi
let intervalTime = 50; // Tempo di aggiornamento in millisecondi
let steps = transitionTime * 1000 / intervalTime; // Numero di passi per raggiungere il target

// Variabili per gli oscillatori
let audioContext;
let oscillator1;
let oscillator2;

// Funzione per calcolare la frequenza intermedia
function interpolateFrequency(current, target, factor) {
    return current + factor * (target - current);
}

// Funzione per calcolare il colore intermedio
function interpolateColor(current, target, factor) {
    const r1 = parseInt(current.substr(1, 2), 16);
    const g1 = parseInt(current.substr(3, 2), 16);
    const b1 = parseInt(current.substr(5, 2), 16);
    const r2 = parseInt(target.substr(1, 2), 16);
    const g2 = parseInt(target.substr(3, 2), 16);
    const b2 = parseInt(target.substr(5, 2), 16);

    const r = Math.round(r1 + factor * (r2 - r1));
    const g = Math.round(g1 + factor * (g2 - g1));
    const b = Math.round(b1 + factor * (b2 - b1));

    return '#' + r.toString(16).padStart(2, '0') +
                 g.toString(16).padStart(2, '0') +
                 b.toString(16).padStart(2, '0');
}

// Funzione per calcolare l'angolo intermedio
function interpolateAngle(current, target, factor) {
    return current + factor * (target - current);
}

// Funzione per aggiornare la frequenza degli oscillatori
function updateFrequency() {
    const factor = 1 / steps;
    currentFrequency = interpolateFrequency(currentFrequency, targetFrequency, factor);
    currentDeltaF = interpolateFrequency(currentDeltaF, targetDeltaF, factor);
    oscillator1.frequency.setValueAtTime(currentFrequency, audioContext.currentTime);
    oscillator2.frequency.setValueAtTime(currentFrequency + currentDeltaF, audioContext.currentTime);

    steps--;
    if (steps <= 0) {
        targetFrequency = generateDeterministicFrequency(deterministicString + 'next');
        targetDeltaF = generateDeterministicDeltaF(deterministicString + 'next');
        steps = transitionTime * 1000 / intervalTime; // Numero di passi per raggiungere il target
    }
}

// Funzione per aggiornare il gradiente di sfondo
function updateBackgroundColor() {
    const factor = 1 / steps;
    currentColor1 = interpolateColor(currentColor1, targetColor1, factor);
    currentColor2 = interpolateColor(currentColor2, targetColor2, factor);
    currentAngle = interpolateAngle(currentAngle, targetAngle, factor);
    document.body.style.background = `linear-gradient(${currentAngle}deg, ${currentColor1}, ${currentColor2})`;
    
    if (steps <= 0) {
        targetColor1 = generateDeterministicColor(deterministicString + 'nextColor1');
        targetColor2 = generateDeterministicColor(deterministicString + 'nextColor2');
        targetAngle = generateDeterministicAngle(deterministicString + 'next');
        steps = transitionTime * 1000 / intervalTime; // Numero di passi per raggiungere il target
    }
}

// Imposta una nuova frequenza target, deltaF, colori e angolo ogni 10 secondi
setInterval(() => {
    targetFrequency = generateDeterministicFrequency(deterministicString + 'target');
    targetDeltaF = generateDeterministicDeltaF(deterministicString + 'target');
    targetColor1 = generateDeterministicColor(deterministicString + 'targetColor1');
    targetColor2 = generateDeterministicColor(deterministicString + 'targetColor2');
    targetAngle = generateDeterministicAngle(deterministicString + 'target');
    steps = transitionTime * 1000 / intervalTime;
}, transitionTime * 1000);

// Aggiorna la frequenza degli oscillatori e il gradiente di sfondo ogni 50 millisecondi
setInterval(() => {
    if (oscillator1 && oscillator2) {
        updateFrequency();
    }
    updateBackgroundColor();
}, intervalTime);

// Listener per l'evento di clic per avviare l'audio su dispositivi desktop
document.addEventListener('click', function() {
    // Inizializza il contesto audio e gli oscillatori se non già inizializzati
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        oscillator1 = audioContext.createOscillator();
        oscillator2 = audioContext.createOscillator();

        // Configurazione iniziale degli oscillatori
        oscillator1.type = 'triangle'; // Tipo di onda
        oscillator1.frequency.setValueAtTime(currentFrequency, audioContext.currentTime);
        oscillator1.connect(audioContext.destination);

        oscillator2.type = 'square'; // Tipo di onda
        oscillator2.frequency.setValueAtTime(currentFrequency + currentDeltaF, audioContext.currentTime);
        oscillator2.connect(audioContext.destination);

        oscillator1.start();
        oscillator2.start();
    }

    // Controlla se l'audioContext è in uno stato sospeso e ripristinalo
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
});

// Funzione per aggiornare il timer con la data e ora attuale
function updateTimer() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    const dateString = now.toLocaleDateString();
    document.getElementById('timer').textContent = `${dateString} ${timeString}`;
}

// Aggiorna il timer ogni secondo
setInterval(updateTimer, 1000);