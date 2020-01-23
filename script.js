const container = document.querySelector('.container');
const startButton = document.querySelector('#start-button');
const restartButton = document.querySelector('#restart-button');
const timer = document.querySelector('#timer');

let secondsRemaining = 15 * questions.length;
let score;
let interval;
let currentQuestionIndex = 0;

Array.prototype.shuffle = function () {
  let input = this;

  for (let i = input.length - 1; i >= 0; i--) {

    let randomIndex = Math.floor(Math.random() * (i + 1));
    let itemAtIndex = input[randomIndex];

    input[randomIndex] = input[i];
    input[i] = itemAtIndex;
  }
  return input;
}

function toggleElements(selector) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    let { className } = element
    if (className.split(" ").includes('hidden')) {
      element.className = className.replace(/\bhidden\b/g, '');
    } else {
      element.className += " hidden";
    }
  })
}

function addBlankSpace (text) {
  return text.replace('#blank', '________');
}

function renderQuestion (entry) {
  let question = document.createElement('h2');
  question.innerHTML = addBlankSpace(entry.question);
  
  let options = document.createElement('ol');

  let answers = entry.options;

  // ensuring 'All of the above' is always the last option
  let aoaIndex = answers.indexOf('All of the above');
  if (aoaIndex > -1) {
    answers.splice(aoaIndex, 1);
    answers.shuffle();
    answers.push('All of the above');
  } else {
    answers.shuffle();
  }

  answers.forEach((answer) => {
    let option = document.createElement('li');
    let button = document.createElement('button');
  
    button.setAttribute('type', 'button');
    button.setAttribute('class', 'btn btn-primary');
  
    button.innerHTML = answer;
    if (answer !== entry.answer) {
      button.onclick = () => {
        secondsRemaining -= 10;
      }
    } else {
      button.onclick = () => {
        if (currentQuestionIndex < questions.length - 1) {
          currentQuestionIndex++;
          renderQuestion(questions[currentQuestionIndex])
        } else {
          container.querySelector('h2').remove();
          container.querySelector('ol').remove();
          renderFinish();
        }
      }
    }

    option.appendChild(button);
    options.appendChild(option);
  })

  // replacing elements rather than hiding old ones
  const previousQuestion = container.querySelector('h2');
  const previousOptions = container.querySelector('ol');

  if (previousQuestion || previousOptions) {
    previousQuestion.replaceWith(question);
    previousOptions.replaceWith(options);
  } else {
    container.appendChild(question);
    container.appendChild(options);
  }
}

function renderFinish () {
  const finalScore = document.getElementById('final-score');
  score = secondsRemaining;
  finalScore.innerHTML = score;
  toggleElements('.success');
}

function renderTime() {
  timer.innerHTML = `Time: <code>${secondsRemaining.toString().length > 1 ? secondsRemaining : '0' + secondsRemaining}</code>`;

  if (secondsRemaining <= 0) {
    timer.innerHTML = `Time: <code>00</code>`;
    stopTimer();
  }
}

function stopTimer() {
  clearInterval(interval);
  secondsRemaining = 15 * questions.length;
  container.querySelector('h2').remove();
  container.querySelector('ol').remove();
  toggleElements('.failure');
}

if (startButton) {
  startButton.onclick = () => {
    toggleElements('.opener');
    renderTime();
    interval = setInterval(function() {
      secondsRemaining--;
      renderTime();
    }, 1000);
    questions = questions.shuffle();
    renderQuestion(questions[currentQuestionIndex])
  }
}

if (restartButton) {
  restartButton.onclick = () => {
    toggleElements('.failure');
    toggleElements('.opener');
  }
}