
const boardEl = document.getElementById("board");
const movesEl = document.getElementById("moves");
const matchesEl = document.getElementById("matches");
const msgEl = document.getElementById("msg");
const restartBtn = document.getElementById("restart");

const PAIRS = 8; // 8 pairs = 16 cards (4x4)

let cards = [];
let first = null;
let second = null;
let lock = false;
let moves = 0;
let matches = 0;

function shuffle(arr) {
  // Fisher-Yates
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildDeck() {
  const values = [];
  for (let v = 1; v <= PAIRS; v++) {
    values.push(v, v);
  }
  shuffle(values);

  cards = values.map((value, idx) => ({
    id: idx,
    value,
    flipped: false,
    matched: false
  }));
}

function render() {
  boardEl.innerHTML = "";
  for (const c of cards) {
    const btn = document.createElement("button");
    let classes = "aspect-square rounded-[14px] grid place-items-center cursor-pointer select-none text-[28px] font-bold shadow-[0_10px_20px_rgba(0,0,0,0.08)] transition-all duration-[120ms] ease-in-out hover:-translate-y-[1px]";
    
    if (c.matched) {
      classes += " bg-[#eafff2] text-[#065f46] cursor-default outline-2 outline-[#34d399]";
    } else if (c.flipped) {
      classes += " bg-white text-[#111827] cursor-default";
    } else {
      classes += " bg-[#111827] text-transparent";
    }
    
    btn.className = classes;
    btn.dataset.id = c.id;
    btn.textContent = c.value;
    btn.addEventListener("click", onCardClick);
    boardEl.appendChild(btn);
  }

  movesEl.textContent = String(moves);
  matchesEl.textContent = String(matches);
}

function resetTurn() {
  first = null;
  second = null;
  lock = false;
}

function flipCard(card) {
  card.flipped = true;
  render();
}

function unflipCards(a, b) {
  lock = true;
  setTimeout(() => {
    a.flipped = false;
    b.flipped = false;
    render();
    resetTurn();
  }, 700);
}

function markMatched(a, b) {
  a.matched = true;
  b.matched = true;
  matches++;
  render();
  resetTurn();

  if (matches === PAIRS) {
    msgEl.textContent = `🎉 You won in ${moves} moves!`;
  }
}

function onCardClick(e) {
  if (lock) return;

  const id = Number(e.currentTarget.dataset.id);
  const card = cards.find(c => c.id === id);

  if (!card || card.flipped || card.matched) return;

  // first click
  if (!first) {
    first = card;
    flipCard(card);
    msgEl.textContent = "";
    return;
  }

  // second click
  if (!second) {
    second = card;
    flipCard(card);
    moves++;
    movesEl.textContent = String(moves);

    if (first.value === second.value) {
      markMatched(first, second);
    } else {
      unflipCards(first, second);
    }
  }
}

function start() {
  moves = 0;
  matches = 0;
  msgEl.textContent = "";
  resetTurn();
  buildDeck();
  render();
}

restartBtn.addEventListener("click", start);

start();