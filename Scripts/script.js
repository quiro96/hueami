// Funzione per ottenere la data e l'ora corrente formattata come stringa
function getCurrentTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return now.toLocaleDateString('en-US', options);
}

// Funzione per aggiornare dinamicamente l'elemento HTML con l'id "current-time"
function updateTime() {
    const currentTimeElement = document.getElementById('current-time');
    if (currentTimeElement) {
        currentTimeElement.textContent = getCurrentTime();
    }
}

// Aggiorna l'orario ogni secondo
setInterval(updateTime, 1000);

// Rimani connesso con Hue am I
let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let oscillator1 = audioContext.createOscillator();
let oscillator2 = audioContext.createOscillator();
let currentFrequency = generateRandomFrequency();
let targetFrequency = generateRandomFrequency();
let currentDeltaF = generateRandomDeltaF();
let targetDeltaF = generateRandomDeltaF();

let currentColor = generateRandomColor(); // Colore iniziale casuale
let targetColor = generateRandomColor();

let transitionTime = 10; // Tempo di transizione in secondi
let intervalTime = 50; // Tempo di aggiornamento in millisecondi
let steps = transitionTime * 1000 / intervalTime; // Numero di passi per raggiungere il target

// Funzione per generare un colore casuale in formato esadecimale
function generateRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return '#' + r.toString(16).padStart(2, '0') +
                 g.toString(16).padStart(2, '0') +
                 b.toString(16).padStart(2, '0');
}

// Funzione per generare una frequenza casuale tra 200 e 1000 Hz
function generateRandomFrequency() {
    return Math.floor(Math.random() * 50) + 100; // Frequenza tra 200 e 1000 Hz
}

// Funzione per generare un deltaF casuale tra 0 e 100 Hz
function generateRandomDeltaF() {
    return Math.floor(Math.random() * 7); // DeltaF tra 0 e 100 Hz
}

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

// Funzione per aggiornare la frequenza degli oscillatori
function updateFrequency() {
    const factor = 1 / steps;
    currentFrequency = interpolateFrequency(currentFrequency, targetFrequency, factor);
    currentDeltaF = interpolateFrequency(currentDeltaF, targetDeltaF, factor);
    oscillator1.frequency.setValueAtTime(currentFrequency, audioContext.currentTime);
    oscillator2.frequency.setValueAtTime(currentFrequency + currentDeltaF, audioContext.currentTime);

    steps--;
    if (steps <= 0) {
        targetFrequency = generateRandomFrequency();
        targetDeltaF = generateRandomDeltaF();
        targetColor = generateRandomColor();
        steps = transitionTime * 1000 / intervalTime; // Numero di passi per raggiungere il target
    }
}

// Funzione per aggiornare il colore di sfondo
function updateBackgroundColor() {
    const factor = 1 / steps;
    currentColor = interpolateColor(currentColor, targetColor, factor);
    document.body.style.backgroundColor = currentColor;
    
    if (steps <= 0) {
        targetColor = generateRandomColor();
        steps = transitionTime * 1000 / intervalTime; // Numero di passi per raggiungere il target
    }
}

// Inizializza l'orario corrente
updateTime();

// Imposta una nuova frequenza target e deltaF ogni 3 secondi
setInterval(() => {
    targetFrequency = generateRandomFrequency();
    targetDeltaF = generateRandomDeltaF();
    targetColor = generateRandomColor();
    steps = transitionTime * 1000 / intervalTime;
}, transitionTime * 1000);

// Aggiorna la frequenza degli oscillatori e il colore di sfondo ogni 10 millisecondi
setInterval(() => {
    updateFrequency();
    updateBackgroundColor();
}, intervalTime);

// Configurazione iniziale degli oscillatori
oscillator1.type = 'triangle'; // Tipo di onda
oscillator1.frequency.setValueAtTime(currentFrequency, audioContext.currentTime);
oscillator1.connect(audioContext.destination);

oscillator2.type = 'square'; // Tipo di onda
oscillator2.frequency.setValueAtTime(currentFrequency + currentDeltaF, audioContext.currentTime);
oscillator2.connect(audioContext.destination);

oscillator1.start();
oscillator2.start();

// Listener per l'evento di clic per avviare l'audio su dispositivi desktop
document.addEventListener('click', function() {
    // Controlla se l'audioContext è in uno stato sospeso e ripristinalo
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    // Avvia gli oscillatori
    oscillator1.start();
    oscillator2.start();
});
