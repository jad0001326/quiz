

// js/api.js
// Fetches multiple‑choice questions from Open Trivia DB
// Returns an array of objects: { question, answers[4], correct }
const API_URL = 'https://opentdb.com/api.php';

// Allowed difficulty values the API accepts
const ALLOWED_DIFFICULTIES = ['easy', 'medium', 'hard'];

// Singleton DOMParser reused for HTML‑entity decoding
const parser = new DOMParser();
const decode = txt => parser.parseFromString(txt, 'text/html').body.textContent;

/**
 * Fetch and shape questions
 * @param {number} total - number of questions to fetch
 * @param {'easy'|'medium'|'hard'} difficulty - difficulty level
 * @returns {Promise<Array<{question:string,answers:string[],correct:string}>>}
 */
export async function getQuestions(total = 10, difficulty = 'medium') {
  // Validate difficulty; fall back to 'medium' if caller passes something odd
  const level = ALLOWED_DIFFICULTIES.includes(difficulty) ? difficulty : 'medium';

  // Build query string with URLSearchParams for clarity
  const params = new URLSearchParams({
    amount: total,
    type: 'multiple',
    difficulty: level
  });

  try {
    const res = await fetch(`${API_URL}?${params}`);
    if (!res.ok) throw new Error(`Network error ${res.status}`);

    const data = await res.json();
    if (data.response_code !== 0 || !Array.isArray(data.results)) {
      throw new Error('Trivia API returned no questions');
    }

    // Shape each result into the lighter format our app expects
    return data.results.map(q => {
      const answers = [...q.incorrect_answers, q.correct_answer]
        .map(decode)
        .sort(() => Math.random() - 0.5); // basic shuffle

      return {
        question: decode(q.question),
        answers,
        correct: decode(q.correct_answer)
      };
    });
  } catch (err) {
    // Re‑throw with a readable message; caller decides how to show it
    throw new Error(`Failed to fetch questions: ${err.message}`);
  }
}
