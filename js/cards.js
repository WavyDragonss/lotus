// --- Card Data ---
const cardTexts = [
  "Zâmbetul tău îmi luminează ziua, chiar și atunci când e mohorât afară.",
  "Ești frumoasă în cele mai simple moduri, iar frumusețea ta mă cucerește mereu.",
  "Îți pasă de mine cu o grijă pe care n-am mai simțit-o niciodată.",
  "Mă susții mereu, mai ales atunci când simt că nu pot.",
  "Iubesc cât de generoasă ești — dai fără să aștepți nimic în schimb.",
  "Ai un suflet mare și o inimă care știe să iubească frumos.",
  "Nu uiți niciodată să mă lauzi când reușesc ceva, și asta mă motivează enorm.",
  "Râzi cu mine din tot sufletul, și umorul tău e perfect pentru sufletul meu.",
  "Faptul că faci sacrificii pentru mine îmi arată cât de profund mă iubești.",
  "Ești mereu atentă ca și mie să-mi fie bine, chiar și când e greu.",
  "Îmi ești cea mai bună prietenă și cea mai dulce iubită în același timp.",
  "Când sunt cu tine, chiar și cele mai plictisitoare momente devin magice.",
  "Mă iubești fix așa cum sunt, fără să încerci să mă schimbi.",
  "Mă faci să mă simt norocos în fiecare zi că te am în viața mea.",
  "Iubesc cum ne completăm — tu ești calmul din furtuna mea.",
  "Te gândești mereu la mine și îmi arăți asta prin cele mai mici gesturi.",
  "Privirea ta are ceva ce nu pot explica, dar mă face să mă simt acasă.",
  "Ești mai mică cu un an, dar ai o maturitate care mă impresionează.",
  "Când ne întâlnim la școală, toată lumea dispare din jurul meu — rămâi doar tu.",
  "Claudia, ești persoana mea preferată din tot universul, și nu mi-aș putea dori pe altcineva."
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
