// js/api.js  (The Trivia API version)
// Returns an array: { question, answers[4], correct }

const API_URL = 'https://the-trivia-api.com/api/questions';

// Allowed difficulty values the API accepts
const ALLOWED_DIFFICULTIES = ['easy', 'medium', 'hard'];

/**
 * Shuffle helper – Fisher‑Yates
 */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Fetch and shape questions from The Trivia API
 * @param {number} total
 * @param {'easy'|'medium'|'hard'} difficulty
 */
export async function getQuestions(total = 10, difficulty = 'medium') {
  const level = ALLOWED_DIFFICULTIES.includes(difficulty) ? difficulty : 'medium';

  const params = new URLSearchParams({
    categories: 'general_knowledge',
    limit: total,
    difficulty: level
  });

  const res = await fetch(`${API_URL}?${params}`);
  if (!res.ok) throw new Error(`Network error ${res.status}`);

  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Trivia API returned no questions');
  }

  return data.map(q => {
    const answers = shuffle([...q.incorrectAnswers, q.correctAnswer]);
    return {
      question: q.question,
      answers,
      correct: q.correctAnswer
    };
  });
}
