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

// Funzione per aggiornare il timer con la data e ora attuale
function updateTimer() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    const dateString = now.toLocaleDateString();
    document.getElementById('timer').textContent = `${dateString} ${timeString}`;
}
