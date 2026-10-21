'use strict';

const tableArea = document.querySelector('.table-area');
const cardsLayer = document.getElementById('cardsLayer');
const slots = [
  document.querySelector('.card-slot[data-slot="0"]'),
  document.querySelector('.card-slot[data-slot="1"]'),
  document.querySelector('.card-slot[data-slot="2"]')
];

const cardRed = document.getElementById('card-red');
const cardBlue1 = document.getElementById('card-blue-1');
const cardBlue2 = document.getElementById('card-blue-2');
const allCards = [cardRed, cardBlue1, cardBlue2];

const startBtn = document.getElementById('startBtn');
const speedRange = document.getElementById('speedRange');
const speedLabel = document.getElementById('speedLabel');
const statusMessage = document.getElementById('statusMessage');
const soundToggleBtn = document.getElementById('soundToggleBtn');

const winsCountEl = document.getElementById('winsCount');
const lossesCountEl = document.getElementById('lossesCount');
const gamesCountEl = document.getElementById('gamesCount');

let gameState = 'IDLE';

let currentSlotCards = [cardRed, cardBlue1, cardBlue2];

let wins = 0;
let losses = 0;
let totalGames = 0;

let soundEnabled = true;


const SPEED_CONFIG = {
  1: { name: 'Lassú (700 ms)', ms: 700, swaps: 5 },
  2: { name: 'Normál (450 ms)', ms: 450, swaps: 7 },
  3: { name: 'Gyors (280 ms)', ms: 280, swaps: 9 },
  4: { name: 'Villámgyors (160 ms)', ms: 160, swaps: 12 }
};

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(freq, duration, type = 'sine', volume = 0.15) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (err) {
    console.warn('Audio hiba:', err);
  }
}


const SoundEffects = {
  flip() {
    playTone(400, 0.08, 'triangle', 0.1);
  },
  swap() {
    playTone(280, 0.06, 'sine', 0.08);
  },
  win() {
    playTone(523.25, 0.12, 'triangle', 0.2);
    setTimeout(() => playTone(659.25, 0.15, 'triangle', 0.2), 120);
    setTimeout(() => playTone(783.99, 0.35, 'triangle', 0.25), 250);
  },
  lose() {
    playTone(330, 0.15, 'sawtooth', 0.15);
    setTimeout(() => playTone(220, 0.3, 'sawtooth', 0.18), 150);
  }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function setStatus(htmlText, stateClass = '') {
  statusMessage.className = 'status-banner';
  if (stateClass) {
    statusMessage.classList.add(stateClass);
  }
  statusMessage.innerHTML = htmlText;
}

function getSlotCoordinates(slotIndex) {
  const layerRect = cardsLayer.getBoundingClientRect();
  const slotRect = slots[slotIndex].getBoundingClientRect();

  return {
    x: slotRect.left - layerRect.left,
    y: slotRect.top - layerRect.top
  };
}

function updateCardPositions(animate = true) {
  currentSlotCards.forEach((card, slotIndex) => {
    const coords = getSlotCoordinates(slotIndex);
    if (!animate) {
      card.style.transition = 'none';
    }
    card.style.transform = `translate(${coords.x}px, ${coords.y}px)`;
    if (!animate) {
      void card.offsetHeight;
      card.style.transition = '';
    }
  });
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function swapCards(slotA, slotB, speedMs) {
  const cardA = currentSlotCards[slotA];
  const cardB = currentSlotCards[slotB];

  const coordsA = getSlotCoordinates(slotA);
  const coordsB = getSlotCoordinates(slotB);

  document.documentElement.style.setProperty('--swap-speed', `${speedMs}ms`);
  cardA.style.zIndex = '10';
  cardB.style.zIndex = '5';
  cardA.classList.add('card-moving-top');
  cardB.classList.add('card-moving-bottom');

  SoundEffects.swap();


  cardA.style.transform = `translate(${coordsB.x}px, ${coordsB.y}px)`;
  cardB.style.transform = `translate(${coordsA.x}px, ${coordsA.y}px)`;


  await sleep(speedMs);


  cardA.classList.remove('card-moving-top');
  cardB.classList.remove('card-moving-bottom');
  cardA.style.zIndex = '1';
  cardB.style.zIndex = '1';


  currentSlotCards[slotA] = cardB;
  currentSlotCards[slotB] = cardA;


  await sleep(Math.max(40, Math.floor(speedMs * 0.15)));
}

async function performShuffleSequence() {
  gameState = 'SHUFFLING';
  setStatus('Keverés... Figyeld jól a kártyák mozgását!', 'action-state');

  const speedVal = parseInt(speedRange.value, 10);
  const config = SPEED_CONFIG[speedVal] || SPEED_CONFIG[2];

  let lastPair = null;


  for (let i = 0; i < config.swaps; i++) {

    const pairs = [
      [0, 1],
      [1, 2],
      [0, 2]
    ];


    const availablePairs = pairs.filter(
      (p) => !lastPair || !(p[0] === lastPair[0] && p[1] === lastPair[1])
    );

    const chosenPair = availablePairs[Math.floor(Math.random() * availablePairs.length)];
    lastPair = chosenPair;

    await swapCards(chosenPair[0], chosenPair[1], config.ms);
  }
}

function setCardsFlipped(flipped) {
  SoundEffects.flip();
  allCards.forEach((card) => {
    if (flipped) {
      card.classList.add('flipped');
    } else {
      card.classList.remove('flipped');
    }
  });
}


async function startGame() {
  if (gameState !== 'IDLE') return;


  startBtn.disabled = true;
  speedRange.disabled = true;


  allCards.forEach((c) => {
    c.classList.remove('highlight-correct', 'highlight-wrong', 'selectable');
  });

  shuffleArray(currentSlotCards);
  updateCardPositions(false);


  gameState = 'SHOWING';
  setCardsFlipped(false);

  setStatus('Figyeld meg a <strong>PIROS</strong> kártyát! Lefordítás: <strong>2 mp</strong>...', 'action-state');
  await sleep(1000);
  setStatus('Figyeld meg a <strong>PIROS</strong> kártyát! Lefordítás: <strong>1 mp</strong>...', 'action-state');
  await sleep(1000);

  gameState = 'FLIPPING';
  setStatus('Lefordítás... Készülj a keverésre!');
  setCardsFlipped(true);


  await sleep(750);


  await performShuffleSequence();


  gameState = 'WAITING_FOR_PICK';
  setStatus('<strong>Itt a piros, hol a piros?</strong> Kattints a választott kártyára!', 'action-state');
  allCards.forEach((c) => c.classList.add('selectable'));
}

async function handleCardSelection(selectedCard) {
  if (gameState !== 'WAITING_FOR_PICK') return;

  gameState = 'REVEALING';

  allCards.forEach((c) => c.classList.remove('selectable'));


  SoundEffects.flip();
  selectedCard.classList.remove('flipped');

  const isRed = selectedCard.dataset.color === 'piros';
  totalGames++;
  gamesCountEl.textContent = totalGames;

  await sleep(400);

  if (isRed) {

    wins++;
    winsCountEl.textContent = wins;
    selectedCard.classList.add('highlight-correct');
    SoundEffects.win();
    setStatus('<strong>Gratulálok! Eltaláltad, ez a PIROS!</strong> Nyertél!', 'win-state');
  } else {

    losses++;
    lossesCountEl.textContent = losses;
    selectedCard.classList.add('highlight-wrong');
    SoundEffects.lose();
    setStatus('<strong>Sajnos nem találtad el!</strong> Ez kék kártya volt.', 'lose-state');
  }


  await sleep(1000);
  SoundEffects.flip();
  allCards.forEach((c) => c.classList.remove('flipped'));

  gameState = 'IDLE';
  startBtn.disabled = false;
  speedRange.disabled = false;
  startBtn.innerHTML = '<span class="btn-icon">🔄</span> Új játék indítása';
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

startBtn.addEventListener('click', () => {

  getAudioContext();
  startGame();
});

allCards.forEach((card) => {
  card.addEventListener('click', () => {
    handleCardSelection(card);
  });
});


speedRange.addEventListener('input', () => {
  const val = parseInt(speedRange.value, 10);
  const config = SPEED_CONFIG[val] || SPEED_CONFIG[2];
  speedLabel.textContent = config.name;
});


soundToggleBtn.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  if (soundEnabled) {
    soundToggleBtn.textContent = '🔊 Hang: Be';
    getAudioContext();
  } else {
    soundToggleBtn.textContent = '🔇 Hang: Ki';
  }
});


window.addEventListener('resize', () => {
  updateCardPositions(false);
});

window.addEventListener('load', () => {
  updateCardPositions(false);
});


window.addEventListener('DOMContentLoaded', () => {

  updateCardPositions(false);

  setCardsFlipped(true);

  const initialSpeed = parseInt(speedRange.value, 10);
  speedLabel.textContent = (SPEED_CONFIG[initialSpeed] || SPEED_CONFIG[2]).name;
});
