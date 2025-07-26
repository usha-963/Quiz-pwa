const startBtn = document.getElementById('start-btn');
const installBtn = document.getElementById('install-btn');
const quizScreen = document.getElementById('quiz-screen');
const welcomeScreen = document.getElementById('welcome-screen');
const finalScreen = document.getElementById('final-screen');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const nextBtn = document.getElementById('next-btn');
const retakeBtn = document.getElementById('retake-btn');
const timerEl = document.getElementById('timer');
const scoreEl = document.getElementById('score');
const questionNumberEl = document.getElementById('question-number');

let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let timer;
let timeLeft = 20;

const allQuestions = [
  {
    question: "What does HTML stand for?",
    options: ["Hyperlinks and Text Markup Language", "Hyper Text Markup Language", "Home Tool Markup Language", "Hyper Tool Multi Language"],
    answer: 1
  },
  {
    question: "What is the correct syntax to link a CSS file?",
    options: ["<link src='style.css'>", "<style href='style.css'>", "<link rel='stylesheet' href='style.css'>", "<css link='style.css'>"],
    answer: 2
  },
  {
    question: "Which tag is used to define an unordered list?",
    options: ["<ul>", "<ol>", "<li>", "<list>"],
    answer: 0
  },
  {
    question: "Which property is used to change text color in CSS?",
    options: ["font-color", "color", "text-color", "style-color"],
    answer: 1
  },
  {
    question: "What does DOM stand for?",
    options: ["Document Object Model", "Data Object Management", "Display Output Model", "Document Oriented Markup"],
    answer: 0
  },
  {
    question: "Which symbol is used for comments in JavaScript?",
    options: ["<!-- -->", "//", "/* */", "#"],
    answer: 1
  },
  {
    question: "Which method adds a new element at the end of an array?",
    options: ["push()", "add()", "append()", "insert()"],
    answer: 0
  },
  {
    question: "How do you declare a variable in JavaScript?",
    options: ["v x = 10;", "variable x = 10;", "var x = 10;", "x := 10;"],
    answer: 2
  },
  {
    question: "Which HTML element is used for inserting a line break?",
    options: ["<break>", "<br>", "<lb>", "<line>"],
    answer: 1
  },
  {
    question: "Which CSS property controls the text size?",
    options: ["text-style", "font-size", "text-size", "font-style"],
    answer: 1
  }
];

startBtn.addEventListener('click', () => {
  welcomeScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');
  startQuiz();
});

retakeBtn.addEventListener('click', () => {
  finalScreen.classList.add('hidden');
  welcomeScreen.classList.remove('hidden');
});

nextBtn.addEventListener('click', () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showFinal();
  }
});

function startQuiz() {
  questions = shuffleArray([...allQuestions]);
  currentQuestionIndex = 0;
  score = 0;
  showQuestion();
}

function showQuestion() {
  resetState();
  const currentQuestion = questions[currentQuestionIndex];
  questionEl.textContent = currentQuestion.question;
  questionNumberEl.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;

  currentQuestion.options.forEach((option, index) => {
    const btn = document.createElement('button');
    btn.textContent = option;
    btn.classList.add('option');
    btn.addEventListener('click', () => selectAnswer(btn, index, currentQuestion.answer));
    optionsEl.appendChild(btn);
  });

  startTimer();
}

function resetState() {
  clearInterval(timer);
  timeLeft = 20;
  timerEl.textContent = `Time Left: ${timeLeft}s`;
  optionsEl.innerHTML = '';
  nextBtn.classList.add('hidden');
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `Time Left: ${timeLeft}s`;
    if (timeLeft === 0) {
      clearInterval(timer);
      showFinal();
    }
  }, 1000);
}

function selectAnswer(button, selected, correct) {
  clearInterval(timer);
  const allBtns = document.querySelectorAll('.option');
  allBtns.forEach(btn => btn.disabled = true);

  if (selected === correct) {
    button.classList.add('correct');
    score++;
  } else {
    button.classList.add('wrong');
    allBtns[correct].classList.add('correct');
  }

  nextBtn.classList.remove('hidden');
}

function showFinal() {
  quizScreen.classList.add('hidden');
  finalScreen.classList.remove('hidden');
  scoreEl.textContent = `You scored ${score} out of ${questions.length}`;
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

// PWA: Install prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.classList.remove('hidden');

  installBtn.addEventListener('click', () => {
    installBtn.classList.add('hidden');
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choice) => {
      if (choice.outcome === 'accepted') {
        console.log('App installed');
      }
      deferredPrompt = null;
    });
  });
});

window.addEventListener('load', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js');
  }
});
