// entrance.js - Adds entrance animation to content container on DOM ready

document.addEventListener("DOMContentLoaded", function () {
  const el = document.querySelector(".compliment-container") ||
             document.querySelector(".container") ||
             document.body;
  if (el) {
    el.classList.add("page-entrance");
  }
});
