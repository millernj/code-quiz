const container = document.querySelector('.container');
const startButton = document.querySelector('#start-button');
const timer = document.querySelector('#timer');

let secondsRemaining = 15 * questions.length;
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
    let { style: { display } } = element
    if (display) {
      delete element.style.display;
    } else {
      element.setAttribute('style', 'display: none;');
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
  
  entry.options.shuffle().forEach((answer) => {
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

        }
      }
    }
  
    option.appendChild(button);
    options.appendChild(option);
  })
  
  container.appendChild(question);
  container.appendChild(options);
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
}

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

