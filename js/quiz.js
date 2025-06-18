// js/quiz.js
// Main quiz logic: fetch questions, handle answers, score, and timer

import { getQuestions } from './api.js';
import { startTimer }     from './timer.js';

// ---------- DOM helpers ----------
const $ = sel => document.querySelector(sel);

// ---------- Player name ----------
const playerName = localStorage.getItem('playerName') || '';

const card       = $('#card');
const qEl        = $('#question');
const answersEl  = $('#answers');
const nextBtn    = $('#next');
const scoreEl    = $('#score');
const timerEl    = $('#timer');
const endScreen  = $('#end-screen');
const finalMsgEl = $('#final-msg');

// ---------- State ----------
let questions = [];
let current   = 0;
let score     = 0;
let stopClock = null;

// ---------- Initialise ----------
(async function init () {
  const params     = new URLSearchParams(window.location.search);
  const difficulty = params.get('difficulty') || 'medium';

  try {
    questions = await getQuestions(10, difficulty);
    stopClock = startTimer(120, updateTimer, endGame); // 2‑min limit
    renderQuestion();
  } catch (err) {
    qEl.textContent = '⚠️  Could not load questions. Please refresh.';
  }
})();

// ---------- Render ----------
function renderQuestion () {
  const q = questions[current];
  qEl.textContent = q.question;

  answersEl.innerHTML = '';
  q.answers.forEach(text => {
    const li = document.createElement('li');
    li.textContent = text;
    li.tabIndex    = 0;
    li.addEventListener('click', () => handleAnswer(li, q.correct));
    answersEl.appendChild(li);
  });

  // show nothing on the first question so “0 / 10” doesn’t flash
scoreEl.textContent = (current === 0 && score === 0)
  ? ''
  : `${score}/${questions.length}`;
  nextBtn.classList.add('hidden');
  answersEl.classList.remove('locked');
  card.classList.remove('hidden');

  // ensure trophy hidden during the quiz
  document.getElementById('trophy')?.classList.add('hidden');
}

// ---------- Interaction ----------
function handleAnswer (li, correct) {
  if (answersEl.classList.contains('locked')) return; // ignore double click
  answersEl.classList.add('locked');

  [...answersEl.children].forEach(el => {
    el.classList.add(el.textContent === correct ? 'right' : 'wrong');
  });

  if (li.textContent === correct) score++;
  scoreEl.textContent = `${score}/${questions.length}`;

  nextBtn.classList.remove('hidden');
}

nextBtn.addEventListener('click', () => {
  current++;
  if (current < questions.length) renderQuestion();
  else endGame();
});

// ---------- Timer & End ----------
function updateTimer (sec) {
  // Some browsers deliver milliseconds → convert to seconds if value is too large
  if (sec > 600) {        // >10 minutes in seconds means it's probably ms
    sec = Math.round(sec / 1000);
  }

  // Clamp negative values
  if (sec < 0) sec = 0;

  const mm = String(Math.floor(sec / 60)).padStart(2, '0');
  const ss = String(sec % 60).padStart(2, '0');
  timerEl.textContent = `${mm}:${ss}`;
}

function endGame () {
  // stop the clock
  if (stopClock) stopClock();

  // hide the question card, show the end screen
  card.classList.add('hidden');
  nextBtn.classList.add('hidden');  // ensure Next button is hidden at quiz end
  endScreen.classList.remove('hidden');

  // bring the results section into view
  endScreen.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // show the final score
  if (playerName) {
    finalMsgEl.textContent = `${playerName}, you scored ${score} out of ${questions.length}! Well done!`;
  } else {
    finalMsgEl.textContent = `You scored ${score} out of ${questions.length}!`;
  }

  // clear the “0 / 10” score text so it’s not stuck on the end screen
  scoreEl.textContent = '';

  // Trophy celebration (any non-zero score)
  const trophy = document.getElementById('trophy');
  if (score >= 1 && trophy) {
    trophy.classList.remove('hidden');
    trophy.classList.add('celebrate');

    // auto-hide trophy after 5 seconds
    setTimeout(() => {
      trophy.classList.add('hidden');
    }, 5000);
  }
}
