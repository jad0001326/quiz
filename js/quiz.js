

// js/quiz.js
// Main quiz logic: fetches questions, renders UI, handles scoring + timer

import { getQuestions } from './api.js';
import { startTimer } from './timer.js';

// DOM helpers
const $ = sel => document.querySelector(sel);

// Elements
const card        = $('#card');
const qEl         = $('#question');
const answersEl   = $('#answers');
const nextBtn     = $('#next');
const scoreEl     = $('#score');
const timerEl     = $('#timer');
const endScreen   = $('#end-screen');
const finalMsgEl  = $('#final-msg');

// State
let questions = [];
let current   = 0;
let score     = 0;

// ────────────────────────────────────────────────────────────
// Init
// ────────────────────────────────────────────────────────────
init();

async function init() {
  // Read ?difficulty=easy|medium|hard (default = medium)
  const params     = new URLSearchParams(window.location.search);
  const difficulty = params.get('difficulty') || 'medium';

  try {
    questions = await getQuestions(10, difficulty);   // 10 Qs
    startTimer(120, updateTimer, endGame);            // 2‑min limit
    render();
  } catch (err) {
    qEl.textContent = '⚠️  Could not load questions. Please refresh.';
  }
}

// ────────────────────────────────────────────────────────────
// Rendering
// ────────────────────────────────────────────────────────────
function render() {
  const q = questions[current];
  qEl.textContent = q.question;

  answersEl.innerHTML = '';
  q.answers.forEach(text => {
    const li   = document.createElement('li');
    li.textContent = text;
    li.tabIndex    = 0;
    li.addEventListener('click', () => selectAnswer(li, q.correct));
    answersEl.appendChild(li);
  });

  scoreEl.textContent = `${score} / ${questions.length}`;
  nextBtn.classList.add('hidden');
  answersEl.classList.remove('locked');
  card.classList.remove('hidden');
}

// ────────────────────────────────────────────────────────────
// Interaction
// ────────────────────────────────────────────────────────────
function selectAnswer(li, correct) {
  if (answersEl.classList.contains('locked')) return; // ignore double clicks
  answersEl.classList.add('locked');

  // colour all answers
  [...answersEl.children].forEach(el => {
    el.classList.add(el.textContent === correct ? 'right' : 'wrong');
  });

  if (li.textContent === correct) score++;
  scoreEl.textContent = `${score} / ${questions.length}`;

  nextBtn.classList.remove('hidden');
}

nextBtn.addEventListener('click', () => {
  current += 1;
  if (current < questions.length) render();
  else endGame();
});

// ────────────────────────────────────────────────────────────
// Timer + end‑game
// ────────────────────────────────────────────────────────────
function updateTimer(sec) {
  const mm = String(Math.floor(sec / 60)).padStart(2, '0');
  const ss = String(sec % 60).padStart(2, '0');
  timerEl.textContent = `${mm}:${ss}`;
}

function endGame() {
  card.classList.add('hidden');
  endScreen.classList.remove('hidden');
  finalMsgEl.textContent = `You scored ${score} out of ${questions.length}!`;
}
