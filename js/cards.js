// --- Card Data ---
const cardTexts = [
  "Your smile lights up my day.",
  "You make me feel safe and loved.",
  "You laugh at my dumb jokes.",
  "You’re my favorite person in the universe.",
  "I admire your strength and resilience.",
  "You always believe in me.",
  "Every moment with you feels special.",
  "You inspire me to be better.",
  "We make the best memories together.",
  "Your kindness melts my heart.",
  "I love our late-night talks.",
  "You know how to cheer me up.",
  "I love the way you look at me.",
  "Your hugs feel like home.",
  "You are my light on dark days.",
  "You listen even when I ramble.",
  "You make ordinary days magical.",
  "I love your creativity.",
  "Being with you feels like destiny.",
  "You are my forever person."
];

// --- Card Generation ---
const cardsContainer = document.getElementById('cards-container');

cardTexts.forEach((text, idx) => {
  const card = document.createElement('div');
  card.className = 'card-flip card-fade';
  card.tabIndex = 0;
  card.innerHTML = `
    <div class="card-inner">
      <div class="card-front">
        <span>Click me</span>
        <span class="heart" aria-hidden="true">❤️</span>
      </div>
      <div class="card-back">${text}</div>
    </div>
  `;
  // Flip logic
  function flipCard() {
    card.classList.toggle('flipped');
  }
  card.addEventListener('click', flipCard);
  card.addEventListener('keydown', e => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      flipCard();
    }
  });
  cardsContainer.appendChild(card);
});

// --- Scroll Fade Animation ---
const allCards = Array.from(document.querySelectorAll('.card-flip'));
const visibleCount = 4;

function handleCardFade() {
  const winH = window.innerHeight;
  allCards.forEach(card => {
    const rect = card.getBoundingClientRect();
    // Show only cards that are at least partially in viewport (centered)
    if (
      rect.top < winH - 60 &&
      rect.bottom > 60
    ) {
      card.classList.add('visible');
    } else {
      card.classList.remove('visible');
    }
  });
}
window.addEventListener('scroll', handleCardFade, {passive:true});
window.addEventListener('resize', handleCardFade);
setTimeout(handleCardFade, 80);

// --- Accessibility: Ensure tabIndex and keyboard flip

// --- Touch accessibility is ensured via click handler ---
