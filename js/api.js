

// Fetches questions from Open Trivia DB and returns them in a clean shape
// Each item: { question: string, answers: [4 strings], correct: string }
export async function getQuestions(total = 10, difficulty = 'medium') {
  const url = `https://opentdb.com/api.php?amount=${total}&type=multiple&difficulty=${difficulty}`;
  const { results } = await fetch(url).then(r => r.json());

  // helper: decode HTML entities (&quot;, &#039;, etc.) the API returns
  const decode = txt =>
    new DOMParser().parseFromString(txt, 'text/html').body.textContent;

  return results.map(q => {
    const answers = [...q.incorrect_answers, q.correct_answer]
      .map(decode)
      .sort(() => Math.random() - 0.5); // shuffle

    return {
      question: decode(q.question),
      answers,
      correct: decode(q.correct_answer)
    };
  });
}
