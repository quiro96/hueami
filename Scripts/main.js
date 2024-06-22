// Ottieni la stringa deterministica basata su data e ora
const deterministicString = getDeterministicString();

// Inizializza variabili deterministiche
let currentFrequency = generateDeterministicFrequency(deterministicString);
let targetFrequency = generateDeterministicFrequency(deterministicString + 'target');
let currentDeltaF = generateDeterministicDeltaF(deterministicString);
let targetDeltaF = generateDeterministicDeltaF(deterministicString + 'target');

// Inizializza colori predefiniti
let currentColor1 = '#ff0000'; // Rosso
let targetColor1 = '#ff0000'; // Rosso
let currentColor2 = '#00ff00'; // Verde
let targetColor2 = '#00ff00'; // Verde
let currentAngle = 0;
let targetAngle = 0;

let transitionTime = 10; // Tempo di transizione in secondi
let intervalTime = 50; // Tempo di aggiornamento in millisecondi
let steps = transitionTime * 1000 / intervalTime; // Numero di passi per raggiungere il target

// Variabili per gli oscillatori
let audioContext;
let oscillator1;
let oscillator2;

// Funzione per aggiornare la frequenza degli oscillatori
function updateFrequency() {
    const factor = 1 / steps;
    currentFrequency = interpolateFrequency(currentFrequency, targetFrequency, factor);
    currentDeltaF = interpolateFrequency(currentDeltaF, targetDeltaF, factor);
    if (oscillator1 && oscillator2) {
        oscillator1.frequency.setValueAtTime(currentFrequency, audioContext.currentTime);
        oscillator2.frequency.setValueAtTime(currentFrequency + currentDeltaF, audioContext.currentTime);
    }

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
        const now = new Date();
        const seconds = now.getSeconds();
        const tenths = Math.floor(now.getMilliseconds() / 100);
        const timeSeed = `${now.getHours()}${now.getMinutes()}${seconds}${tenths}`;

        targetColor1 = generateDeterministicColor(timeSeed + 'color1');
        targetColor2 = generateDeterministicColor(timeSeed + 'color2' + 'distinct');
        targetAngle = generateDeterministicAngle(timeSeed + 'angle');
        steps = transitionTime * 1000 / intervalTime; // Numero di passi per raggiungere il target
    }
}

// Aggiorna colori e frequenze ad ogni decimo di secondo
setInterval(() => {
    const now = new Date();
    const seconds = now.getSeconds();
    const tenths = Math.floor(now.getMilliseconds() / 100);

    if (seconds % 10 === 0 && tenths === 0) {
        const timeSeed = `${now.getHours()}${now.getMinutes()}${seconds}${tenths}`;
        targetFrequency = generateDeterministicFrequency(timeSeed + 'target');
        targetDeltaF = generateDeterministicDeltaF(timeSeed + 'target');
        targetColor1 = generateDeterministicColor(timeSeed + 'color1');
        targetColor2 = generateDeterministicColor(timeSeed + 'color2' + 'distinct');
        targetAngle = generateDeterministicAngle(timeSeed + 'angle');
        steps = transitionTime * 1000 / intervalTime;
    }
}, 100);

// Aggiorna la frequenza degli oscillatori e il gradiente di sfondo ogni 50 millisecondi
setInterval(() => {
    updateFrequency();
    updateBackgroundColor();
}, intervalTime);

// Inizializzazione degli oscillatori e contesto audio
audioContext = new (window.AudioContext || window.webkitAudioContext)();
oscillator1 = audioContext.createOscillator();
oscillator2 = audioContext.createOscillator();

oscillator1.type = 'triangle'; // Tipo di onda
oscillator1.frequency.setValueAtTime(currentFrequency, audioContext.currentTime);
oscillator1.connect(audioContext.destination);
oscillator1.start();

oscillator2.type = 'square'; // Tipo di onda
oscillator2.frequency.setValueAtTime(currentFrequency + currentDeltaF, audioContext.currentTime);
oscillator2.connect(audioContext.destination);
oscillator2.start();

// Aggiorna il timer con la data e l'ora attuali ogni secondo
setInterval(updateTimer, 1000);

// Listener per l'evento di clic per avviare l'audio
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