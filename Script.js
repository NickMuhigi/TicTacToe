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

function event(can) {
  reset.addEventListener('click', fnreset);
  for (let col of cols)
    if (can)
      col.addEventListener('click', play);
    else
      col.removeEventListener('click', play);
}

event(true);

function play(e) {
  const __ = e.target;
  if (!__.innerHTML && cur) {
    __.innerHTML = '<h1 name="O">O</h1>';
    move(parseInt(__.id.split(/\D+/g)[1]), 'O');
    if (!checkWin()) {
      cur = !cur; // Switch turn to computer AI
      setTimeout(computerMove, 500); // Delay computer's move for better user experience
    }
  }
}

function move(ind, sign) {
  arr[ind] = sign;
}

function checkWin() {
  for (let i = 0; i < wins.length; i++) {
    let [a, b, c] = wins[i];
    if (cmp(arr[a], arr[b], arr[c])) {
      console.log(arr[a], ' wins');
      highlightWinningCombo(a, b, c);
      event(false);
      return true;
    }
  }
  return false;
}

function cmp(a, b, c) {
  if (a && b && c)
    return (a === b) && (a === c) && (b === c);
}

function computerMove() {
  let emptyIndices = [];
  for (let i = 0; i < arr.length; i++) {
    if (!arr[i]) {
      emptyIndices.push(i);
    }
  }
  const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  cols[randomIndex].innerHTML = '<h1 name="X">X</h1>';
  move(randomIndex, 'X');
  checkWin();
  cur = !cur; // Switch turn back to user after computer AI's move
}

function highlightWinningCombo(a, b, c) {
  cols[a].classList.add('win');
  cols[b].classList.add('win');
  cols[c].classList.add('win');
}

function fnreset() {
  for (let col of cols) {
    col.classList.remove('win');
    col.innerHTML = '';
  }
  arr = new Array(9).fill(null);
  cur = true; // Reset turn to user starts first
  event(true);
}
