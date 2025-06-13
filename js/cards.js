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
    // If the card is not flipped, flip it and close all others
    if (!card.classList.contains('flipped')) {
      document.querySelectorAll('.card-flip.flipped').forEach(c => {
        if (c !== card) c.classList.remove('flipped');
      });
      card.classList.add('flipped');
      card.scrollIntoView({behavior:"smooth", block:"center"});
    } else {
      card.classList.remove('flipped');
    }
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

// --- Only 1 card fully visible, others fade & close ---
// Fade based on intersection with viewport, and close if scrolled away
const allCards = Array.from(document.querySelectorAll('.card-flip'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.intersectionRatio > 0.75) {
      entry.target.classList.add('visible');
    } else {
      entry.target.classList.remove('visible');
      entry.target.classList.remove('flipped');
    }
  });
}, {
  threshold: [0,0.75,1]
});
allCards.forEach(card => observer.observe(card));

// Center the cards container always
window.addEventListener('resize', () => {
  document.body.scrollIntoView({behavior:"auto", block:"center"});
});
