import { getQuestions } from './api.js';
import { startTimer } from './timer.js';

// ---------- DOM helpers ----------
const $ = sel => document.querySelector(sel);

// ---------- Player name ----------
const playerName = localStorage.getItem('playerName') || '';

// ---------- Element references ----------
const card       = $('#card');
const qEl        = $('#question');
const answersEl  = $('#answers');
const nextBtn    = $('#next');
const scoreEl    = $('#score');
const timerEl    = $('#timer');
const endScreen  = $('#end-screen');
const finalMsgEl = $('#final-msg');
const trophy     = $('#trophy');

// ---------- State ----------
let questions = [];
let current   = 0;
let score     = 0;
let stopClock = null;

// ---------- Initialise ----------
(async function init() {
  const params = new URLSearchParams(window.location.search);
  const difficulty = params.get('difficulty') || 'medium';

  try {
    questions = await getQuestions(10, difficulty);
    stopClock = startTimer(120, updateTimer, endGame);
    renderQuestion();
  } catch (err) {
    qEl.textContent = '⚠️ Could not load questions. Please refresh.';
  }
})();

// ---------- Render ----------
function renderQuestion() {
  const q = questions[current];
  qEl.textContent = q.question;

  answersEl.innerHTML = '';
  q.answers.forEach(text => {
    const li = document.createElement('li');
    li.textContent = text;
    li.tabIndex = 0;
    li.addEventListener('click', () => handleAnswer(li, q.correct));
    answersEl.appendChild(li);
  });

  scoreEl.textContent = (current === 0 && score === 0) 
    ? '' 
    : `${score}/${questions.length}`;

  nextBtn.classList.add('hidden');
  answersEl.classList.remove('locked');
  card.classList.remove('hidden');
  card.style.display = 'block';

  // ensure trophy hidden during the quiz
  trophy.classList.add('hidden');
}

// ---------- Interaction ----------
function handleAnswer(li, correct) {
  if (answersEl.classList.contains('locked')) return;
  answersEl.classList.add('locked');

  Array.from(answersEl.children).forEach(el => {
    if (el.textContent === correct) {
      el.classList.add('right');
    } else {
      el.classList.add('wrong');
    }
  });

  if (li.textContent === correct) score++;
  scoreEl.textContent = `${score}/${questions.length}`;

  nextBtn.classList.remove('hidden');
}

nextBtn.addEventListener('click', () => {
  current++;
  if (current < questions.length) {
    renderQuestion();
  } else {
    endGame();
  }
});

// ---------- Timer & End ----------
function updateTimer(sec) {
  if (sec > 600) sec = Math.round(sec / 1000);
  if (sec < 0) sec = 0;
  const mm = String(Math.floor(sec / 60)).padStart(2, '0');
  const ss = String(sec % 60).padStart(2, '0');
  timerEl.textContent = `${mm}:${ss}`;
}

function endGame() {
  if (stopClock) stopClock();

  card.classList.add('hidden');
  card.style.display = 'none';
  nextBtn.classList.add('hidden');
  document.getElementById('status').classList.add('hidden');
  endScreen.classList.remove('hidden');
  scoreEl.textContent = '';
  timerEl.textContent = '';

  if (playerName) {
    finalMsgEl.textContent = `${playerName}, you scored ${score} out of ${questions.length}! Well done!`;
  } else {
    finalMsgEl.textContent = `You scored ${score} out of ${questions.length}!`;
  }

  trophy.classList.remove('hidden');
  trophy.classList.add('celebrate');
}
