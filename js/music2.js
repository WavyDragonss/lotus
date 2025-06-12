// music2.js - Second, independent music player popup for lotus.
// Robust slider (seekbar) logic: allows skipping to any part of the song by dragging.
// Comments included for clarity and maintenance.

// --- Music Track List ---
// Customize with your own tracks and titles!
const music2_tracks = [
  { src: 'music/lotus_ambient.mp3', title: 'I wanna be yours' },
  { src: 'music/preput.mp3', title: 'Preput' }
];

// --- DOM CONSTRUCTION ---
const music2Bubble = document.createElement('div');
music2Bubble.className = 'music2-bubble';
music2Bubble.innerHTML = `
  <div class="music2-controls" id="music2-controls">
    <div class="music2-title" id="music2-title"></div>
    <div class="music2-controls-row">
      <button class="music2-btn" id="music2-prev" title="anterior">&#9198;</button>
      <button class="music2-btn" id="music2-playpause" title="play/pause">
        <span id="music2-playpause-icon">&#9654;</span>
      </button>
      <button class="music2-btn" id="music2-next" title="următor">&#9197;</button>
    </div>
    <div class="music2-controls-row">
      <span class="music2-time" id="music2-current-time">0:00</span>
      <input class="music2-seekbar" id="music2-seekbar" type="range" min="0" max="1000" value="0" step="1" disabled>
      <span class="music2-time" id="music2-duration">0:00</span>
    </div>
    <div class="music2-controls-row">
      <span style="font-size:1.1rem;color:#a70042;">🔊</span>
      <input class="music2-slider" id="music2-volume" type="range" min="0" max="1" step="0.01" value="0.5" title="volum">
    </div>
  </div>
  <button class="music2-icon-btn" id="music2-icon-btn" aria-label="control muzică" tabindex="0">
    <span style="pointer-events:none;">&#119070;</span>
  </button>
  <audio class="music2-audio" id="music2-audio"></audio>
`;
document.body.appendChild(music2Bubble);

// --- DOM REFERENCES ---
const music2Audio = music2Bubble.querySelector('#music2-audio');
const music2Title = music2Bubble.querySelector('#music2-title');
const music2PlayPauseBtn = music2Bubble.querySelector('#music2-playpause');
const music2PlayPauseIcon = music2Bubble.querySelector('#music2-playpause-icon');
const music2PrevBtn = music2Bubble.querySelector('#music2-prev');
const music2NextBtn = music2Bubble.querySelector('#music2-next');
const music2Seekbar = music2Bubble.querySelector('#music2-seekbar');
const music2CurrentTime = music2Bubble.querySelector('#music2-current-time');
const music2Duration = music2Bubble.querySelector('#music2-duration');
const music2Volume = music2Bubble.querySelector('#music2-volume');
const music2IconBtn = music2Bubble.querySelector('#music2-icon-btn');
const music2Controls = music2Bubble.querySelector('.music2-controls');

// --- State Variables ---
let music2Index = 0;
let music2IsPlaying = false;
let music2SeekbarDragging = false;

// --- Popup Show/Hide ---
music2IconBtn.addEventListener('click', () => {
  music2Bubble.classList.toggle('show-controls');
});

// --- Track Controls ---
function music2SetTrack(idx, autoplay = false) {
  music2Index = idx;
  const track = music2_tracks[idx];
  music2Audio.src = track.src;
  music2Title.textContent = track.title;
  music2Seekbar.value = 0;
  music2Seekbar.disabled = true;
  music2CurrentTime.textContent = "0:00";
  music2Duration.textContent = "0:00";
  if (autoplay) {
    music2Audio.play();
    music2IsPlaying = true;
    music2PlayPauseIcon.innerHTML = "&#10073;&#10073;";
  } else {
    music2Audio.pause();
    music2IsPlaying = false;
    music2PlayPauseIcon.innerHTML = "&#9654;";
  }
}
music2PrevBtn.addEventListener('click', () => {
  music2SetTrack((music2Index-1+music2_tracks.length)%music2_tracks.length, music2IsPlaying);
});
music2NextBtn.addEventListener('click', () => {
  music2SetTrack((music2Index+1)%music2_tracks.length, music2IsPlaying);
});
music2PlayPauseBtn.addEventListener('click', () => {
  if (music2Audio.paused) {
    music2Audio.play();
  } else {
    music2Audio.pause();
  }
});
music2Audio.addEventListener('play', () => {
  music2IsPlaying = true;
  music2PlayPauseIcon.innerHTML = "&#10073;&#10073;";
});
music2Audio.addEventListener('pause', () => {
  music2IsPlaying = false;
  music2PlayPauseIcon.innerHTML = "&#9654;";
});
music2Audio.addEventListener('ended', () => {
  // Auto-next
  music2SetTrack((music2Index+1)%music2_tracks.length, true);
});

// --- Volume Control ---
music2Volume.addEventListener('input', () => {
  music2Audio.volume = music2Volume.value;
});
music2Audio.volume = music2Volume.value;

// --- Time Slider Logic ---
// Enable slider when metadata loads (duration known)
music2Audio.addEventListener('loadedmetadata', () => {
  music2Duration.textContent = formatTime(music2Audio.duration);
  music2CurrentTime.textContent = formatTime(music2Audio.currentTime);
  music2Seekbar.disabled = false;
  // Set slider to current time if track is resumed
  music2Seekbar.value = music2Audio.duration ? Math.round((music2Audio.currentTime / music2Audio.duration) * 1000) : 0;
});

// Update slider as track plays (unless user is dragging)
music2Audio.addEventListener('timeupdate', () => {
  if (!music2SeekbarDragging && music2Audio.duration) {
    music2Seekbar.value = Math.round((music2Audio.currentTime / music2Audio.duration) * 1000);
    music2CurrentTime.textContent = formatTime(music2Audio.currentTime);
  }
});

// When user drags slider, show preview time (but only set .currentTime on release)
music2Seekbar.addEventListener('input', () => {
  if (music2Audio.duration) {
    music2SeekbarDragging = true;
    const seekTo = (music2Seekbar.value / 1000) * music2Audio.duration;
    music2CurrentTime.textContent = formatTime(seekTo);
  }
});
['mousedown', 'touchstart'].forEach(evt =>
  music2Seekbar.addEventListener(evt, () => music2SeekbarDragging = true)
);
['mouseup', 'touchend', 'change'].forEach(evt =>
  music2Seekbar.addEventListener(evt, () => {
    if (music2Audio.duration && music2SeekbarDragging) {
      const seekTo = (music2Seekbar.value / 1000) * music2Audio.duration;
      music2Audio.currentTime = seekTo;
      music2CurrentTime.textContent = formatTime(music2Audio.currentTime);
    }
    music2SeekbarDragging = false;
  })
);

// --- Utility: Format seconds as mm:ss ---
function formatTime(time) {
  time = Math.floor(time || 0);
  const m = Math.floor(time / 60);
  const s = time % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

// --- Initialize ---
music2SetTrack(0);

// --- End of music2.js ---
/*
How the slider works:
- The seekbar input has a range from 0 to 1000 (for precision).
- On timeupdate, the seekbar position is updated to reflect currentTime.
- When the user drags the slider (input), the preview time is shown.
- On mouseup/touchend/change, the audio jumps to the chosen time.
- The slider is disabled until the track's metadata is loaded.
- This player is visually and functionally independent from the existing system.
*/
