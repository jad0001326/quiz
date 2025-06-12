// js/quiz.js
// Main quiz logic: fetch questions, handle answers, score, and timer

import { getQuestions } from './api.js';
import { startTimer }     from './timer.js';

// ---------- DOM helpers ----------
const $ = sel => document.querySelector(sel);

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

  scoreEl.textContent = `${score} / ${questions.length}`;
  nextBtn.classList.add('hidden');
  answersEl.classList.remove('locked');
  card.classList.remove('hidden');
}

// ---------- Interaction ----------
function handleAnswer (li, correct) {
  if (answersEl.classList.contains('locked')) return; // ignore double click
  answersEl.classList.add('locked');

  [...answersEl.children].forEach(el => {
    el.classList.add(el.textContent === correct ? 'right' : 'wrong');
  });

  if (li.textContent === correct) score++;
  scoreEl.textContent = `${score} / ${questions.length}`;

  nextBtn.classList.remove('hidden');
}

nextBtn.addEventListener('click', () => {
  current++;
  if (current < questions.length) renderQuestion();
  else endGame();
});

// ---------- Timer & End ----------
function updateTimer (sec) {
  const mm = String(Math.floor(sec / 60)).padStart(2, '0');
  const ss = String(sec % 60).padStart(2, '0');
  timerEl.textContent = `${mm}:${ss}`;
}

function endGame () {
  if (stopClock) stopClock();
  card.classList.add('hidden');
  endScreen.classList.remove('hidden');
  finalMsgEl.textContent = `You scored ${score} out of ${questions.length}!`;
  // Celebrate perfect score with trophy animation
  if (score === questions.length) {
    const trophy = document.getElementById('trophy');
    if (trophy) {
      trophy.classList.remove('hidden');
      trophy.classList.add('celebrate');
    }
  }
}
