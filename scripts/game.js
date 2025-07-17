/* 
  aPuzzle | RS PROJECT [ nightcoreat ]
*/

const urlParams = new URLSearchParams(window.location.search);
const levelId = parseInt(urlParams.get("level") || "1");

const currentLevel = levels.find((l) => l.id === levelId);

const difficultyLabel = document.getElementById("difficulty-label");
difficultyLabel.textContent = currentLevel.difficulty || "غير معروف";
document.getElementById("level-title").textContent = `🧩 ${currentLevel.name}`;

const hintBtn = document.getElementById("hintButton");
const solveBtn = document.getElementById("solveButton");

let hintCount = parseInt(localStorage.getItem("hint") || "0");
let solveCount = parseInt(localStorage.getItem("autoSolve") || "0");

let startTime;
let timerInterval;

function updateToolButtons() {
  if (hintCount > 0) {
    hintBtn.disabled = false;
    hintBtn.textContent = `💡 تلميح (${hintCount})`;
  } else {
    hintBtn.disabled = true;
    hintBtn.textContent = "🔒 تلميح (غير متاح)";
  }

  if (solveCount > 0) {
    solveBtn.disabled = false;
    solveBtn.textContent = `🤖 حل تلقائي (${solveCount})`;
  } else {
    solveBtn.disabled = true;
    solveBtn.textContent = "🔒 حل تلقائي (غير متاح)";
  }
}

updateToolButtons();

hintBtn.onclick = () => {
  if (hintCount > 0) {
    hintCount--;
    localStorage.setItem("hint", hintCount);
    updateToolButtons();
  }
};

solveBtn.onclick = () => {
  if (solveCount > 0) {
    solveCount--;
    localStorage.setItem("autoSolve", solveCount);
    updateToolButtons();
  }
};

const board = document.getElementById("puzzle-board");

const rows = currentLevel.height;
const cols = currentLevel.width;
const imageSrc = currentLevel.image;

board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
board.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

let pieces = [];
for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    pieces.push({
      id: row * cols + col,
      row,
      col,
    });
  }
}

let shuffled = [...pieces].sort(() => Math.random() - 0.5);

function render() {
  if (!startTime) {
    startTime = Date.now();

    timerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const minutes = Math.floor(elapsed / 60);
      const seconds = elapsed % 60;
      const formatted = `${minutes} دقيقة و ${seconds} ثانية`;
      document.getElementById("timeSpent").textContent = `⏱️ الوقت: ${formatted}`;
    }, 1000);
  }

  board.innerHTML = "";

  shuffled.forEach((piece, index) => {
    const el = document.createElement("div");
    el.className = "puzzle-piece";
    el.dataset.index = index;
    el.draggable = true;

    const pieceWidth = board.clientWidth / cols;
    const pieceHeight = board.clientHeight / rows;

    el.style.width = pieceWidth + "px";
    el.style.height = pieceHeight + "px";

    el.style.backgroundImage = `url(${imageSrc})`;
    el.style.backgroundSize = `${cols * 100}% ${rows * 100}%`;
    el.style.backgroundPosition = `${(piece.col / (cols - 1)) * 100}% ${(piece.row / (rows - 1)) * 100}%`;

    board.appendChild(el);
  });

  const elements = board.querySelectorAll(".puzzle-piece");

  elements.forEach((el) => {
    el.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", el.dataset.index);
      el.classList.add("dragging");
    });

    el.addEventListener("dragend", () => {
      el.classList.remove("dragging");
    });

    el.addEventListener("dragover", (e) => {
      e.preventDefault();
      el.style.outline = "2px dashed #fff";
    });

    el.addEventListener("dragleave", () => {
      el.style.outline = "";
    });

    el.addEventListener("drop", (e) => {
      e.preventDefault();
      el.style.outline = "";
      const from = parseInt(e.dataTransfer.getData("text/plain"));
      const to = parseInt(el.dataset.index);

      [shuffled[from], shuffled[to]] = [shuffled[to], shuffled[from]];
      render();

      if (checkWin()) showWinModal();
    });
  });
}

function checkWin() {
  for (let i = 0; i < shuffled.length; i++) {
    if (shuffled[i].id !== i) return false;
  }
  return true;
}

function showWinModal() {
  clearInterval(timerInterval);

  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const formatted = `${minutes} دقيقة و ${seconds} ثانية`;

  document.getElementById("winModal").style.display = "flex";
  document.getElementById("winTime").textContent = `🕒 الوقت المستغرق: ${formatted}`;

  const pieces = board.querySelectorAll(".puzzle-piece");
  pieces.forEach((el) => {
    el.style.cursor = "default";
    el.style.border = "none";
    el.draggable = false;
  });

  let coins = parseInt(localStorage.getItem("coins") || "0");
  let reward = 0;

  switch (currentLevel.difficulty) {
    case "سهل":
      reward = 30;
      break;
    case "متوسط":
      reward = 50;
      break;
    case "صعب":
      reward = 80;
      break;
    case "خبير":
      reward = 120;
      break;
    default:
      reward = 50;
  }

  coins += reward;
  localStorage.setItem("coins", coins);

  const progress = JSON.parse(localStorage.getItem("puzzleProgress") || "[]");
  if (!progress.includes(currentLevel.id + 1)) {
    progress.push(currentLevel.id + 1);
    localStorage.setItem("puzzleProgress", JSON.stringify(progress));
  }
}

function closeWinModal() {
  window.location.href = "levels.html";
}

function useHint() {
  for (let i = 0; i < shuffled.length; i++) {
    if (shuffled[i].id !== i) {
      const targetPiece = board.querySelector(`[data-index="${i}"]`);
      if (targetPiece) {
        targetPiece.style.outline = "3px solid gold";
        setTimeout(() => (targetPiece.style.outline = ""), 1500);
      }
      alert(`📍 القطعة رقم ${i + 1} تحتاج للنقل.`);
      break;
    }
  }
}

function autoSolve() {
  shuffled = [...pieces];
  render();
  setTimeout(showWinModal, 500);
}

document.getElementById("hintButton").onclick = () => {
  const hints = parseInt(localStorage.getItem("hint") || "0");
  if (hints > 0) {
    localStorage.setItem("hint", hints - 1);
    useHint();
  } else {
    alert("❌ لا تملك أدوات تلميح.");
  }
};

document.getElementById("solveButton").onclick = () => {
  const auto = parseInt(localStorage.getItem("autoSolve") || "0");
  if (auto > 0) {
    localStorage.setItem("autoSolve", auto - 1);
    autoSolve();
  } else {
    alert("❌ لا تملك أدوات حل تلقائي.");
  }
};

render();
