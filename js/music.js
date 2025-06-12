// music.js - Standalone music player logic (bubble) for all pages

document.addEventListener("DOMContentLoaded", function () {
  // --- CONFIG ---
  const playlist = [
    { src: "music/preput.mp3", title: "Preput" },
    { src: "music/lotus_ambient.mp3", title: "I Wanna Be Yours" }
  ];
  const DEFAULT_VOLUME = 0.3;
  const AUTOPLAY = true;

  // --- ELEMENTS ---
  const audio = document.getElementById("audio-player");
  const playPauseBtn = document.getElementById("playpause-btn");
  const playPauseIcon = document.getElementById("playpause-icon");
  const nextBtn = document.getElementById("next-btn");
  const prevBtn = document.getElementById("prev-btn");
  const seekbar = document.getElementById("seekbar");
  const currentTimeEl = document.getElementById("current-time");
  const durationEl = document.getElementById("duration");
  const volumeSlider = document.getElementById("volume-slider");
  const musicTitle = document.getElementById("music-title");
  const bubble = document.getElementById("music-bubble");
  const controls = document.getElementById("music-controls");
  const iconBtn = document.getElementById("music-icon-btn");
  const closeMobileBtn = document.getElementById("close-mobile-controls");

  if (!audio || !playPauseBtn || !playPauseIcon || !nextBtn || !prevBtn || !seekbar || !currentTimeEl || !durationEl || !volumeSlider || !musicTitle || !bubble || !controls || !iconBtn) return;

  let currentTrack = 0;
  let seekbarChanging = false;
  let wasPlaying = false;
  let controlsVisible = false;
  let isMobile = false;

  function loadTrack(idx, autoPlay = false) {
    if (idx < 0) idx = playlist.length - 1;
    if (idx >= playlist.length) idx = 0;
    currentTrack = idx;
    audio.src = playlist[currentTrack].src;
    musicTitle.textContent = playlist[currentTrack].title;
    seekbar.value = 0;
    currentTimeEl.textContent = "0:00";
    durationEl.textContent = "0:00";
    if (autoPlay) {
      audio.play();
    } else {
      updatePlayPause();
    }
  }

  // -- Audio events --
  audio.addEventListener("loadedmetadata", () => {
    seekbar.max = Math.floor(audio.duration);
    durationEl.textContent = formatTime(audio.duration);
    // If was playing before seeking, keep playing after seek
    if (wasPlaying) audio.play();
  });
  audio.addEventListener("timeupdate", () => {
    if (!seekbarChanging) {
      seekbar.value = Math.floor(audio.currentTime);
      currentTimeEl.textContent = formatTime(audio.currentTime);
    }
  });
  audio.addEventListener("ended", () => {
    loadTrack(currentTrack + 1, true);
  });

  // --- Play/Pause UI ---
  function updatePlayPause() {
    playPauseIcon.innerHTML = audio.paused ? "&#9654;" : "&#10073;&#10073;";
  }
  playPauseBtn.addEventListener("click", () => {
    if (audio.paused) audio.play();
    else audio.pause();
    updatePlayPause();
  });
  audio.addEventListener("play", updatePlayPause);
  audio.addEventListener("pause", updatePlayPause);

  // --- Next/Prev ---
  nextBtn.addEventListener("click", () => {
    loadTrack(currentTrack + 1, !audio.paused);
  });
  prevBtn.addEventListener("click", () => {
    loadTrack(currentTrack - 1, !audio.paused);
  });

  // --- Seekbar: allow seeking without restarting (draggable and resumes if playing) ---
  seekbar.addEventListener("input", function () {
    seekbarChanging = true;
    currentTimeEl.textContent = formatTime(this.value);
  });
  seekbar.addEventListener("change", function () {
    wasPlaying = !audio.paused;
    audio.currentTime = this.value;
    seekbarChanging = false;
    if (wasPlaying) audio.play();
  });

  // --- Volume ---
  volumeSlider.addEventListener("input", function () {
    audio.volume = this.value;
  });
  audio.volume = DEFAULT_VOLUME;
  volumeSlider.value = DEFAULT_VOLUME;

  function formatTime(sec) {
    sec = Math.floor(sec);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  // --- Autoplay (browser restriction safe) ---
  let audioInitiated = false;
  function unlockAudio() {
    if (!audioInitiated && AUTOPLAY) {
      audio.volume = DEFAULT_VOLUME;
      audio.play().catch(()=>{});
      audioInitiated = true;
    }
  }
  document.body.addEventListener("click", unlockAudio, { once: true });
  document.body.addEventListener("touchstart", unlockAudio, { once: true });

  // --- Mobile/touch logic ---
  function detectMobile() {
    isMobile = window.matchMedia("(pointer: coarse), (max-width:768px)").matches;
  }
  detectMobile();
  window.addEventListener("resize", detectMobile);

  function showControls() { bubble.classList.add("show-controls"); controlsVisible = true; }
  function hideControls() { bubble.classList.remove("show-controls"); controlsVisible = false; }

  bubble.addEventListener("mouseenter", function () {
    if (!isMobile) showControls();
  });
  bubble.addEventListener("mouseleave", function () {
    if (!isMobile) hideControls();
  });
  iconBtn.addEventListener("click", function (e) {
    if (isMobile) {
      controlsVisible ? hideControls() : showControls();
      e.stopPropagation();
    }
  });
  if (closeMobileBtn) {
    closeMobileBtn.addEventListener("click", function () {
      hideControls();
      controls.classList.remove("expanded");
    });
  }
  document.addEventListener("click", function (e) {
    if (isMobile && controlsVisible && !bubble.contains(e.target)) hideControls();
  });
  window.addEventListener("keydown", function (e) {
    if (isMobile && controlsVisible && e.key === "Escape") hideControls();
  });
  iconBtn.type = "button";

  // --- Initialize ---
  loadTrack(0, false);
  updatePlayPause();
});
