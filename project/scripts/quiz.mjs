const questions = [
  {
    q: "How many states does Nigeria have, excluding the FCT?",
    options: ["30", "36", "37", "40"],
    answer: 1,
    fact: "Nigeria has 36 states. The Federal Capital Territory is a separate federal territory.",
  },
  {
    q: "Which city is the capital of the Federal Capital Territory?",
    options: ["Lagos", "Kano", "Abuja", "Kaduna"],
    answer: 2,
    fact: "Abuja is Nigeria's capital city and is located in the Federal Capital Territory.",
  },
  {
    q: "Which geopolitical zone includes Lagos State?",
    options: ["South-East", "South-West", "North-East", "South-South"],
    answer: 1,
    fact: "Lagos State is part of Nigeria's South-West geopolitical zone.",
  },
  {
    q: "What is Nigeria's official language?",
    options: ["Yoruba", "Hausa", "English", "Igbo"],
    answer: 2,
    fact: "English is Nigeria's official language and is widely used in government and formal education.",
  },
  {
    q: "Which state has Umuahia as its capital?",
    options: ["Abia", "Anambra", "Imo", "Enugu"],
    answer: 0,
    fact: "Umuahia is the capital of Abia State.",
  },
  {
    q: "Which geopolitical zone includes Borno State?",
    options: ["North-East", "North-West", "North-Central", "South-East"],
    answer: 0,
    fact: "Borno State is in the North-East geopolitical zone.",
  },
  {
    q: "What is the capital of Rivers State?",
    options: ["Uyo", "Yenagoa", "Port Harcourt", "Calabar"],
    answer: 2,
    fact: "Port Harcourt is the capital of Rivers State.",
  },
  {
    q: "How many geopolitical zones are commonly used in Nigeria?",
    options: ["4", "5", "6", "7"],
    answer: 2,
    fact: "Nigeria is commonly grouped into six geopolitical zones.",
  },
];
let index = 0,
  score = 0,
  answered = false;
const $ = (s) => document.querySelector(s);
const bestKey = "ngde-quiz-best";
const best = () => Number(localStorage.getItem(bestKey) || 0);
function render() {
  answered = false;
  const item = questions[index];
  $("#questionCount").textContent =
    `Question ${index + 1} of ${questions.length}`;
  $("#questionText").textContent = item.q;
  $("#score").textContent = score;
  $("#sideScore").textContent = score;
  $("#bestScore").textContent = best();
  $("#progress").setAttribute("aria-valuenow", String(index));
  $("#progressBar").style.width = `${(index / questions.length) * 100}%`;
  $("#feedback").textContent = "Choose an answer to see feedback.";
  $("#nextQuestion").disabled = true;
  $("#nextQuestion").textContent =
    index === questions.length - 1 ? "See results →" : "Next question →";
  $("#answers").innerHTML = item.options
    .map(
      (option, i) =>
        `<button class="answer" type="button" data-answer="${i}" aria-pressed="false">${String.fromCharCode(65 + i)}. ${option}</button>`,
    )
    .join("");
}
$("#answers").addEventListener("click", (event) => {
  const button = event.target.closest("[data-answer]");
  if (!button || answered) return;
  answered = true;
  const correct = Number(button.dataset.answer) === questions[index].answer;
  if (correct) score++;
  $("#answers")
    .querySelectorAll("button")
    .forEach((b, i) => {
      b.disabled = true;
      b.setAttribute(
        "aria-pressed",
        String(i === Number(button.dataset.answer)),
      );
      if (i === questions[index].answer) b.style.borderColor = "#166534";
    });
  $("#score").textContent = score;
  $("#sideScore").textContent = score;
  $("#feedback").textContent =
    `${correct ? "Correct!" : "Not quite."} ${questions[index].fact}`;
  $("#nextQuestion").disabled = false;
  $("#progressBar").style.width = `${((index + 1) / questions.length) * 100}%`;
});
$("#nextQuestion").addEventListener("click", () => {
  if (!answered) return;
  if (index < questions.length - 1) {
    index++;
    render();
    return;
  }
  if (score > best()) localStorage.setItem(bestKey, String(score));
  $("#questionText").textContent = "Quiz complete!";
  $("#answers").innerHTML = "";
  $("#questionCount").textContent = "Results";
  $("#feedback").textContent =
    `You scored ${score} out of ${questions.length}. ${score === questions.length ? "Excellent work!" : "Review the explanations and try again to improve your score."}`;
  $("#nextQuestion").disabled = true;
  $("#nextQuestion").textContent = "Completed";
  $("#bestScore").textContent = best();
  $("#progressBar").style.width = "100%";
});
$("#restartQuiz").addEventListener("click", () => {
  index = 0;
  score = 0;
  render();
});
render();
