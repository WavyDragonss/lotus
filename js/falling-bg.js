// falling-bg.js - Create subtle falling hearts and stars in the background

document.addEventListener("DOMContentLoaded", function () {
  const symbols = ["❤️", "⭐"];
  const colors = ["#ff9ebf", "#ffb6d5", "#ffd6e7", "#fff5b6", "#fffbe6"];
  const root = document.createElement("div");
  root.className = "falling-bg-anim";
  document.body.prepend(root);

  function randomFloat(a, b) { return a + Math.random() * (b - a); }

  function spawnOne() {
    const el = document.createElement("span");
    el.className = "falling-item";
    el.textContent = symbols[Math.random() < 0.58 ? 0 : 1];
    const size = randomFloat(18, 40);
    el.style.left = `${randomFloat(1, 98)}vw`;
    el.style.fontSize = `${size}px`;
    el.style.opacity = randomFloat(0.35, 0.8);
    el.style.color = colors[Math.floor(Math.random() * colors.length)];
    el.style.filter = "blur(" + randomFloat(0, 0.7) + "px)";
    el.style.animationDuration = `${randomFloat(5.5, 11)}s`;
    el.style.animationDelay = `-${randomFloat(0, 5)}s`;
    root.appendChild(el);
    setTimeout(() => root.removeChild(el), 12000);
  }

  // spawn a new one every 350ms (staggered)
  setInterval(spawnOne, 350);
  // Start with a few for instant effect
  for (let i = 0; i < 10; ++i) setTimeout(spawnOne, 210 * i);
});
