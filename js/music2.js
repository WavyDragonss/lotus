// ... (other code above unchanged)

let lastSeekValue = 0;

// When user moves the slider, show preview time
music2seekbar.addEventListener('input', () => {
  if (music2audio.duration) {
    music2seekbardragging = true;
    const seekto = (music2seekbar.value / 1000) * music2audio.duration;
    music2currenttime.textContent = formattime(seekto);
    lastSeekValue = seekto;
  }
});

// Start dragging
['mousedown', 'touchstart'].forEach(evt =>
  music2seekbar.addEventListener(evt, () => {
    music2seekbardragging = true;
    lastSeekValue = (music2seekbar.value / 1000) * (music2audio.duration || 0);
  })
);

// Only update currentTime if different by >0.1s to prevent micro-pauses
function finishSeek() {
  if (music2audio.duration && music2seekbardragging) {
    const seekto = (music2seekbar.value / 1000) * music2audio.duration;
    if (Math.abs(seekto - music2audio.currentTime) > 0.10) {
      music2audio.currentTime = seekto;
    }
    music2currenttime.textContent = formattime(music2audio.currentTime);
  }
  music2seekbardragging = false;
}

['mouseup', 'touchend', 'change'].forEach(evt =>
  music2seekbar.addEventListener(evt, finishSeek)
);
