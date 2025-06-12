// Password lockscreen for galerie foto (carusel.html)
// Blocks all content until password is entered

(function(){
  const overlay = document.getElementById('lockscreen-overlay');
  const form = document.getElementById('lockscreen-form');
  const input = document.getElementById('lockscreen-input');
  const btn = document.getElementById('lockscreen-btn');
  if (!overlay || !form || !input || !btn) return;

  // Prevent right-click/context menu
  overlay.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('contextmenu', e => overlay.style.display !== "none" && e.preventDefault());

  // Prevent some devtools shortcuts (basic, not foolproof)
  window.addEventListener('keydown', function(e) {
    if (overlay.style.display !== "none") {
      // Block F12, Ctrl+Shift+I/J/C/U
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key.toUpperCase() === "U")
      ) {
        e.preventDefault(); e.stopPropagation();
      }
    }
  }, true);

  // Focus input on overlay
  setTimeout(() => { input.focus(); }, 200);

  // Submission handler
  form.addEventListener('submit', function(e){
    e.preventDefault();
    if(input.value === "2008") {
      overlay.classList.add('fadeout');
      setTimeout(function(){
        overlay.style.display = "none";
      }, 1050); // matches fadeout duration
    } else {
      alert("Try again, or not at all if you're not the love of my life.");
      input.value = "";
      input.focus();
    }
  });
})();
