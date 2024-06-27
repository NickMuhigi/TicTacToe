'use strict';

const _ = document,
  cols = Array.from(_.querySelectorAll('.board > span')),
  reset = _.querySelector('#reset');
let cur = true; // Start with user's turn
let arr = new Array(9).fill(null);
const wins = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// Function to initialize game event listeners
function initGame() {
  reset.addEventListener('click', fnreset);
  for (let col of cols) {
    col.addEventListener('click', play);
  }
}

// Initialize game
initGame();

// Function to handle user's move
function play(e) {
  const __ = e.target;
  if (!__.innerHTML && cur) {
    __.innerHTML = '<h1 name="O">O</h1>';
    move(parseInt(__.id.split(/\D+/g)[1]), 'O');
    if (!checkWin()) {
      cur = false; // Switch turn to computer AI
      setTimeout(computerMove, 500); // Delay computer's move for better user experience
    }
  }
}

// Function to make a move
function move(ind, sign) {
  arr[ind] = sign;
}

// Function to check for a win
function checkWin() {
  for (let i = 0; i < wins.length; i++) {
    let [a, b, c] = wins[i];
    if (cmp(arr[a], arr[b], arr[c])) {
      if (arr[a] === 'O') {
        showMessage('YOU WON!');
      } else if (arr[a] === 'X') {
        showMessage('YOU LOSE!');
      }
      highlightWinningCombo(a, b, c);
      removeGameListeners(); // Disable further clicks
      return true;
    }
  }
  return false;
}

// Function to compare moves
function cmp(a, b, c) {
  if (a && b && c)
    return (a === b) && (a === c) && (b === c);
}

// Function for computer's move
function computerMove() {
  let moveIndex = findWinningMove('X');
  
  if (moveIndex === -1) {
    moveIndex = findWinningMove('O');
  }
  
  if (moveIndex === -1) {
    let emptyIndices = [];
    for (let i = 0; i < arr.length; i++) {
      if (!arr[i]) {
        emptyIndices.push(i);
      }
    }
    moveIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  }

  cols[moveIndex].innerHTML = '<h1 name="X">X</h1>';
  move(moveIndex, 'X');
  checkWin();
  cur = true; // Switch turn back to user after computer AI's move
}

// Function to find a winning move for the given sign
function findWinningMove(sign) {
  for (let i = 0; i < wins.length; i++) {
    let [a, b, c] = wins[i];
    if (arr[a] === sign && arr[b] === sign && !arr[c]) {
      return c;
    }
    if (arr[a] === sign && arr[c] === sign && !arr[b]) {
      return b;
    }
    if (arr[b] === sign && arr[c] === sign && !arr[a]) {
      return a;
    }
  }
  return -1; // No winning move found
}

// Function to highlight the winning combination
function highlightWinningCombo(a, b, c) {
  cols[a].classList.add('win');
  cols[b].classList.add('win');
  cols[c].classList.add('win');
}

// Function to reset the game
function fnreset() {
  for (let col of cols) {
    col.classList.remove('win');
    col.innerHTML = '';
  }
  arr = new Array(9).fill(null);
  cur = true; // Reset turn to user starts first
  initGame(); // Re-enable game event listeners
}

// Function to show a message
function showMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.textContent = message;
  document.body.appendChild(messageElement);

  setTimeout(() => {
    messageElement.classList.add('show');
  }, 100);

  setTimeout(() => {
    messageElement.classList.remove('show');
    setTimeout(() => {
      messageElement.remove();
    }, 300);
  }, 2500);
}

// Function to remove game event listeners
function removeGameListeners() {
  for (let col of cols) {
    col.removeEventListener('click', play);
  }
}
