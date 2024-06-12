const question = document.getElementById("question");
const choices = Array.from(document.querySelectorAll("#choice-text"));
const progressText = document.querySelector("#progressText");
const scoreText = document.querySelector("#score");
const winSound = new Audio("win.mp3");
const loseSound = new Audio("lose.mp3");

let currentQuestion = {};
let acceptingAnswers = true;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [
    {
        question: "What year was NES Tetris released in North America?",
        choice1: "1990",
        choice2: "1970",
        choice3: "1989",
        choice4: "1991",
        answer: 3,
    },
    {
        question: "Who was the 7-time Classic Tetris World Champion?",
        choice1: "Thor Aackerlund",
        choice2: "dogplayingtetris",
        choice3: "fractal161",
        choice4: "Jonas Neubauer",
        answer: 4,
    },
    {
        question: "What is the first level that displays the \"glitched colors\"?",
        choice1: "255",
        choice2: "100",
        choice3: "138",
        choice4: "256",
        answer: 3,
    },
    {
        question: "What is known to occur after completing level 255?",
        choice1: "Game crash",
        choice2: "Console Explosion",
        choice3: "1 million points added to current score",
        choice4: "Rebirth",
        answer: 4,
    },
    {
        question: "What is the playstyle that allows players to reach the highest levels?",
        choice1: "Hypertapping",
        choice2: "Rolling",
        choice3: "DAS",
        choice4: "Pressing the buttons with your feet",
        answer: 2,
    },
];

const SCORE_POINTS = 100;
const MAX_QUESTIONS = questions.length;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
};

getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter > MAX_QUESTIONS) {
        localStorage.setItem("mostRecentScore", score);
        return window.location.assign("end.html");
    }

    questionCounter++;
    progressText.innerText = `Question ${questionCounter} of ${MAX_QUESTIONS}`;
    progressBar.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionsIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionsIndex];
    question.innerText = currentQuestion.question;

    choices.forEach((choice) => {
        const number = choice.dataset["number"];
        choice.innerText = currentQuestion["choice" + number];
    });

    availableQuestions.splice(questionsIndex, 1);

    acceptingAnswers = true;
};

choices.forEach((choice) => {
    choice.addEventListener("click", e => {

        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];

        let classToApply = selectedAnswer == currentQuestion.answer ? "bg-success" : "bg-danger";

        if (classToApply === "bg-success") {
            winSound.play();
            incrementScore(SCORE_POINTS);
        }
        else {
            loseSound.play();
            // Add a class to the correct answer choice
            const correctChoice = choices.find(choice => choice.dataset["number"] == currentQuestion.answer);
            correctChoice.parentElement.classList.add("bg-success");
        }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            // Remove the class from the correct answer choice
            if (classToApply === "bg-danger") {
                const correctChoice = choices.find(choice => choice.dataset["number"] == currentQuestion.answer);
                correctChoice.parentElement.classList.remove("bg-success");
            }
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000); // Increase the delay to 2 seconds
    });
});

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
}

startGame();