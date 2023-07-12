
const _question = document.getElementById('question');
const _options = document.querySelector('.quiz-options');
const _correctScore = document.getElementById('correct-score');
const _totalQuestion = document.getElementById('total-question');
const _checkBtn = document.getElementById('check-answer');
const _playAgain = document.getElementById('play-again');
const _result = document.getElementById('result');

let correctAnswer = "";
let correctScore = 0;
let askedCount = 0;
const totalQuestion = 10;

function eventListeners() {
  _checkBtn.addEventListener('click', checkAnswer);
  _playAgain.addEventListener('click', resetQuiz);
}

document.addEventListener('DOMContentLoaded', () => {
  _totalQuestion.textContent = totalQuestion;
  _correctScore.textContent = correctScore;
  eventListeners();
});

async function loadQuestion() {
  const APIurl = 'https://opentdb.com/api.php?amount=1';
  try {
    const result = await fetch(APIurl);
    const data = await result.json();
    _result.innerHTML = "";
    showQuestion(data.results[0]);
  } catch (error) {
    console.error('Error fetching question:', error);
  }
}

function showQuestion(data) {
  _checkBtn.disabled = false;
  correctAnswer = data.correct_answer;
  const incorrectAnswer = data.incorrect_answers;
  const optionsList = [...incorrectAnswer];
  optionsList.splice(
    Math.floor(Math.random() * (incorrectAnswer.length + 1)),
    0,
    correctAnswer
  );

  _question.innerHTML = `${data.question} <br> <span class="category">${data.category}</span>`;
  _options.innerHTML = optionsList
    .map(
      (option, index) =>
        `<li>${index + 1}. <span>${option}</span></li>`
    )
    .join('');

  selectOption();
}

function selectOption() {
  _options.querySelectorAll('li').forEach((option) => {
    option.addEventListener('click', () => {
      if (_options.querySelector('.selected')) {
        const activeOption = _options.querySelector('.selected');
        activeOption.classList.remove('selected');
      }
      option.classList.add('selected');
    });
  });
}

function checkAnswer() {
  _checkBtn.disabled = true;
  if (_options.querySelector('.selected')) {
    let selectedAnswer = _options.querySelector('.selected span').textContent;
    if (selectedAnswer.trim() === HTMLDecode(correctAnswer)) {
      correctScore++;
      _result.innerHTML = '<p><i class="fas fa-check"></i> Correct Answer!</p>';
    } else {
      _result.innerHTML = `<p><i class="fas fa-times"></i> Incorrect Answer! <small><p>Correct Answer: <b>${correctAnswer}</b></small></p>`;
    }
  }
  askedCount++;
  setCount();
  if (askedCount === totalQuestion) {
    _result.innerHTML += `<p>Your Score is ${correctScore}.</p>`;
    endQuiz();
  } else {
    setTimeout(() => {
      resetQuestion();
    }, 700);
  }
}

function resetQuestion() {
  _checkBtn.disabled = false;
  _result.innerHTML = '';
  _options.innerHTML = '';
  loadQuestion();
}

function resetQuiz() {
  correctScore = 0;
  askedCount = 0;
  setCount();
  resetQuestion();
}

function setCount() {
  _correctScore.textContent = correctScore;
  _totalQuestion.textContent = totalQuestion;
}

function HTMLDecode(textString) {
  let doc = new DOMParser().parseFromString(textString, 'text/html');
  return doc.documentElement.textContent;
}

loadQuestion();








