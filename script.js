// select div with class name. quarySelector just return first proper element
const playBoard = document.querySelector('.play-board');
const scoreElement = document.querySelector('.score');
const highScoreElement = document.querySelector('.high-score');
const controls = document.querySelectorAll('.controls i');

let gameOver = false;
let foodX, foodY;
let snakeX = 5,
  snakeY = 10;
let snakeBody = [];
let velocityX = 0,
  velocityY = 0;
let setIntervalId;
let score = 0;

// getting high score from the local storage
let highScore = localStorage.getItem('high-score') || 0;
highScoreElement.innerText = `Score : ${highScore}`;

const changeFoodPosition = () => {
  // passing a random 0 - 30 value as food position
  foodX = Math.floor(Math.random() * 30) + 1;
  // math.random() will generate random value >= 0 and < 1
  // math.floor() will round down a decimal number to the nearest integer
  foodY = Math.floor(Math.random() * 30) + 1;
};

const handleGameOver = () => {
  clearInterval(setIntervalId);
  alert('Game Over! Press OK to replay...');
  location.reload();
};

const changeDirection = (e) => {
  // changing velocity value based on key press
  if (e.key === 'ArrowUp' && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.key === 'ArrowDown' && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.key === 'ArrowLeft' && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.key === 'ArrowRight' && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  }
};

controls.forEach((key) => {
  // calling changeDirection on each key click and passing key dataset value as an object
  key.addEventListener('click', () => changeDirection({ key: key.dataset.key }));
});

const initGame = () => {
  if (gameOver) return handleGameOver();

  // this is arrow function. in tradional function like : function initGame() {}
  // () detemines function do no need any arguments
  let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

  // checking if the snake hit the food
  if (snakeX === foodX && snakeY === foodY) {
    changeFoodPosition();
    snakeBody.push([foodX, foodY]); // pushing food position to snake body array

    // update score
    score++;

    highScore = score >= highScore ? score : highScore;
    localStorage.setItem('high-score', highScore);
    scoreElement.innerText = `Score : ${score}`;
    highScoreElement.innerText = `Score : ${highScore}`;
  }

  for (let i = snakeBody.length - 1; i > 0; i--) {
    // shifting forward the values of the elements in the snake body by one
    snakeBody[i] = snakeBody[i - 1];
  }

  // setting first element of snake body to current snake position
  snakeBody[0] = [snakeX, snakeY];

  // updating the snake's head position based on the current velocity
  snakeX += velocityX;
  snakeY += velocityY;

  // checking if the snake's head hits the wall so gameOver is true
  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    gameOver = true;
  }

  for (let i = 0; i < snakeBody.length; i++) {
    // adding a div for each part of the snake's body
    // grid-area = grid-row-start / grid-column-start
    // snakeBody is two dimensional array so in the row grid we get Y value, that means index-1
    // -- then column grid we get X value, that means index-0
    htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;

    // checking if the snake head hits the body so gameOver is true
    if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
      gameOver = true;
    }
  }

  playBoard.innerHTML = htmlMarkup;
};

changeFoodPosition();
setIntervalId = setInterval(initGame, 125);
document.addEventListener('keydown', changeDirection);
