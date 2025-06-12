// Generator logic for compliment. Requires complimente.js loaded before this file.
document.addEventListener("DOMContentLoaded", () => {
  const complimentBox = document.getElementById("compliment");
  const generateBtn = document.getElementById("generateBtn");

  function afiseazaCompliment() {
    const randomIndex = Math.floor(Math.random() * complimente.length);
    // Add a fade-in animation
    complimentBox.classList.remove("compliment-fade");
    // Force reflow for repeated animation
    void complimentBox.offsetWidth;
    complimentBox.textContent = complimente[randomIndex];
    complimentBox.classList.add("compliment-fade");
  }

  generateBtn.addEventListener("click", afiseazaCompliment);
  afiseazaCompliment(); // Initial compliment on load
});
