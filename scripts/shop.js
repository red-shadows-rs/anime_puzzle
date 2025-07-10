/* 
  aPuzzle | RS PROJECT [ nightcoreat ]
*/


const shopList = document.getElementById("shop-list");
const coinsEl = document.getElementById("coins");

let coins = parseInt(localStorage.getItem("coins") || "500");
coinsEl.textContent = coins;

const progress = new Set(JSON.parse(localStorage.getItem("puzzleProgress") || "[]"));

fetch("assets/shop.json")
  .then(res => res.json())
  .then(data => {
    data.forEach(item => {
      const card = document.createElement("div");
      card.className = "shop-item";

      const isLevel = item.type === "level";
      const levelId = item.levelId;
      const isUnlockedFromProgress = isLevel && progress.has(levelId);
      const isUnlockedFromShop = isLevel && localStorage.getItem(`unlocked_level_${levelId}`) === "true";
      const isDirectlyStored = localStorage.getItem(item.id) === "true";

      let unlockMethod = null;
      if (isUnlockedFromShop || isDirectlyStored) unlockMethod = "shop";
      else if (isUnlockedFromProgress) unlockMethod = "progress";

      const isPurchased = unlockMethod !== null;

      const imageHtml = item.image
        ? `
          <div class="shop-image-wrapper">
            <img src="${item.image}" alt="${item.name}" class="shop-image">
            ${!isPurchased ? `<div class="lock-overlay">🔒</div>` : ""}
          </div>
        `
        : "";

      card.innerHTML = `
        ${imageHtml}
        <div>
          <h3>${item.name}</h3>
          <p>💰 السعر: ${item.price} عملة</p>
        </div>
      `;

      const btn = document.createElement("button");
      if (unlockMethod === "shop") {
        btn.textContent = "✅ تم الشراء";
        btn.disabled = true;
      } else if (unlockMethod === "progress") {
        btn.textContent = "🏆 تم الكسب";
        btn.disabled = true;
      } else {
        btn.textContent = "🛍️ شراء";
        btn.disabled = false;
        btn.onclick = () => {
          const cost = item.price;
          if (coins >= cost) {
            coins -= cost;
            localStorage.setItem("coins", coins);
            coinsEl.textContent = coins;

            if (isLevel) {
              localStorage.setItem(item.id, "true");
              localStorage.setItem(`unlocked_level_${levelId}`, "true");
              alert(`✅ تم فتح المستوى: ${item.name}`);
            } else {
              const existing = parseInt(localStorage.getItem(item.id) || "0");
              localStorage.setItem(item.id, existing + 1);
              alert(`✅ ${item.name} تمت إضافته لأدواتك.`);
            }

            location.reload();
          } else {
            alert("❌ لا توجد عملات كافية!");
          }
        };
      }

      card.appendChild(btn);
      shopList.appendChild(card);
    });
  });
