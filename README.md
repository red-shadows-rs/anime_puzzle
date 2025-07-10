# 🍬 aPuzzle - Anime Puzzle Game

🎮 **aPuzzle** is a visual anime-themed puzzle game where you assemble scattered image pieces into their correct positions.  
Each level features a unique anime artwork sliced into a grid, with increasing difficulty and challenge.

🌟 This project is part of **Red Shadows | RS Project** 🌟

---

## 🧩 How to Play

- Each level includes a puzzle image divided into a grid (e.g., 4x4 or 8x8).
- Your goal is to correctly arrange the tiles to form the original image.
- Completing levels rewards you with **coins** that can be used in the shop to unlock new levels or purchase tools.

👉 The entry point for the game is aPuzzle.html — open this file in your browser to begin playing

---

## 📁 Project Structure

- 📦 **Add character images (puzzles):**  
  Place your puzzle images inside:  
  `assets/puzzles`

- 🧩 **Add new levels:**  
  Edit the file:  
  `scripts/levels.js`  
  Add new level entries with grid size, image path, and difficulty.

- 🛒 **Add items to the shop:**  
  Use the file:  
  `assets/shop.json`  
  Add levels or tools (e.g., hints, auto-solve) with pricing and details.

---

## 🌍 Language Support

> The game is fully developed in **Arabic**.  
> If you wish to use another language, you will need to manually translate the following:
- `aPuzzle.html`
- `levels.html`
- `play.html`
- `shop.html`
- As well as script files like:  
  `scripts/levels.js`, `scripts/game.js`, and `assets/shop.json`

---

## 🚧 Developer Notes

- Player progress (coins, unlocked levels) is stored using **localStorage**.
- All assets are locally loaded for better performance and offline use.
- The shop interface distinguishes between:
  - Items purchased with coins.
  - Levels unlocked by completing previous ones.

---

🔗 This project is a simple yet elegant web game, built with **HTML + CSS + JavaScript**, with anime-inspired visual design.

