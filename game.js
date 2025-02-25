let playerHealth = 100;
let enemyHealth = 100;
let currentQuestionIndex = 0;

const flashcards = [
  { term: "JavaScript", definition: "A programming language used to create interactive effects within web browsers." },
  { term: "HTML", definition: "The standard markup language for creating web pages and web applications." },
  { term: "CSS", definition: "A style sheet language used for describing the presentation of a document written in HTML or XML." }
];

const startButton = document.getElementById("start-game");
const submitButton = document.getElementById("submit-answer");
const answerInput = document.getElementById("answer");
const questionText = document.getElementById("question");
const playerHealthSpan = document.getElementById("player-health");
const enemyHealthSpan = document.getElementById("enemy-health");

function updateHealth() {
  playerHealthSpan.innerText = playerHealth;
  enemyHealthSpan.innerText = enemyHealth;
}

function displayQuestion() {
  const currentCard = flashcards[currentQuestionIndex];
  questionText.innerText = `What is ${currentCard.term}?`;
}

function handleAnswer() {
  const currentCard = flashcards[currentQuestionIndex];
  const userAnswer = answerInput.value.trim().toLowerCase();
  const correctAnswer = currentCard.definition.toLowerCase();

  if (userAnswer === correctAnswer) {
    enemyHealth -= 10; // Player deals 10 damage to enemy
    alert("Correct! You dealt 10 damage to the enemy.");
  } else {
    playerHealth -= 10; // Enemy attacks if the player is wrong
    alert("Incorrect! The enemy dealt 10 damage to you.");
  }

  if (enemyHealth <= 0) {
    alert("Congratulations! You defeated the enemy!");
    resetGame();
  } else if (playerHealth <= 0) {
    alert("Game Over! You were defeated.");
    resetGame();
  } else {
    // Move to the next question
    currentQuestionIndex++;
    if (currentQuestionIndex >= flashcards.length) {
      currentQuestionIndex = 0; // Loop back to the first question
    }
    displayQuestion();
  }

  updateHealth();
  answerInput.value = ""; // Clear the answer input
}

function resetGame() {
  playerHealth = 100;
  enemyHealth = 100;
  currentQuestionIndex = 0;
  displayQuestion();
  updateHealth();
}

startButton.addEventListener("click", () => {
  startButton.style.display = "none"; // Hide start button after the game starts
  displayQuestion();
  updateHealth();
});

submitButton.addEventListener("click", handleAnswer);
