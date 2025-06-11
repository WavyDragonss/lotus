// =====================
// main.js
// =====================

// --- MUSIC PLAYER LOGIC ---
const playlist = [
  { src: 'music/preput.mp3', title: 'Preput' },
  { src: 'music/lotus_ambient.mp3', title: 'I Wanna Be Yours' }
];
const DEFAULT_VOLUME = 0.3;
const AUTOPLAY = true;
const audio = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('playpause-btn');
const playPauseIcon = document.getElementById('playpause-icon');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const seekbar = document.getElementById('seekbar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeSlider = document.getElementById('volume-slider');
const musicTitle = document.getElementById('music-title');
const bubble = document.getElementById('music-bubble');
const controls = document.getElementById('music-controls');
const iconBtn = document.getElementById('music-icon-btn');
const closeMobileBtn = document.getElementById('close-mobile-controls');

let currentTrack = 0, seekbarChanging = false, controlsVisible = false, isMobile = false;
function loadTrack(idx, autoPlay = false) {
  if (idx < 0) idx = playlist.length - 1;
  if (idx >= playlist.length) idx = 0;
  currentTrack = idx;
  audio.src = playlist[currentTrack].src;
  musicTitle.textContent = playlist[currentTrack].title;
  seekbar.value = 0;
  currentTimeEl.textContent = '0:00';
  durationEl.textContent = '0:00';
  if (autoPlay) audio.play();
  else updatePlayPause();
}
audio.addEventListener('loadedmetadata', () => {
  seekbar.max = Math.floor(audio.duration);
  durationEl.textContent = formatTime(audio.duration);
});
audio.addEventListener('timeupdate', () => {
  if (!seekbarChanging) {
    seekbar.value = Math.floor(audio.currentTime);
    currentTimeEl.textContent = formatTime(audio.currentTime);
  }
});
audio.addEventListener('ended', () => { loadTrack(currentTrack + 1, true); });
function updatePlayPause() {
  playPauseIcon.innerHTML = audio.paused ? '&#9654;' : '&#10073;&#10073;';
}
playPauseBtn.onclick = () => { audio.paused ? audio.play() : audio.pause(); updatePlayPause(); };
audio.addEventListener('play', updatePlayPause);
audio.addEventListener('pause', updatePlayPause);
nextBtn.onclick = () => { loadTrack(currentTrack + 1, !audio.paused); };
prevBtn.onclick = () => { loadTrack(currentTrack - 1, !audio.paused); };
seekbar.oninput = function() { seekbarChanging = true; currentTimeEl.textContent = formatTime(this.value); };
seekbar.onchange = function() { audio.currentTime = this.value; seekbarChanging = false; };
volumeSlider.oninput = function() { audio.volume = this.value; };
audio.volume = DEFAULT_VOLUME; volumeSlider.value = DEFAULT_VOLUME;
function formatTime(sec) {
  sec = Math.floor(sec);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
let audioInitiated = false;
function unlockAudio() {
  if (!audioInitiated && AUTOPLAY) {
    audio.volume = DEFAULT_VOLUME;
    audio.play().catch(()=>{});
    audioInitiated = true;
  }
}
document.body.addEventListener('click', unlockAudio, {once:true});
document.body.addEventListener('touchstart', unlockAudio, {once:true});
function detectMobile() {
  isMobile = window.matchMedia("(pointer: coarse), (max-width:768px)").matches;
}
detectMobile();
window.addEventListener('resize', detectMobile);
function showControls() { bubble.classList.add('show-controls'); controlsVisible = true; }
function hideControls() { bubble.classList.remove('show-controls'); controlsVisible = false; }
bubble.addEventListener('mouseenter', function() { if (!isMobile) showControls(); });
bubble.addEventListener('mouseleave', function() { if (!isMobile) hideControls(); });
iconBtn.onclick = function(e) { if (isMobile) { controlsVisible ? hideControls() : showControls(); e.stopPropagation(); } };
closeMobileBtn.addEventListener("click", function () {
  hideControls();
  controls.classList.remove("expanded");
});
document.addEventListener('click', function(e) { if (isMobile && controlsVisible && !bubble.contains(e.target)) hideControls(); });
window.addEventListener('keydown', function(e) { if(isMobile && controlsVisible && e.key === "Escape") hideControls(); });
iconBtn.type = 'button';
loadTrack(0, false); updatePlayPause();


// --- CAROUSEL LOGIC (only on carusel.html) ---
if (document.getElementById('carousel-image-wrapper')) {
  /*
    === CAROUSEL CONFIGURATION ===
    - To add/remove images: set imageCount and manage files in /images/ as 1.jpg, 2.jpg, ...
    - To change transition speed: set autoSlideInterval (ms)
    - To customize captions: edit getCaption(idx)
    - All IDs/classes/paths are lowercase for case-sensitive hosting
  */
  const imageCount = 15; // number of images
  const autoSlideInterval = 6000; // ms (set to 0 to disable)
  function getCaption(idx) { return `Imaginea ${idx+1}`; }
  const wrapper = document.getElementById('carousel-image-wrapper');
  const indicators = document.getElementById('carousel-indicators');
  const caption = document.getElementById('carousel-caption');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');
  let currentImg = 0, images = [], dots = [], timer = null, startX = 0, moveX = 0;

  function buildCarousel() {
    for (let i = 0; i < imageCount; i++) {
      const img = document.createElement('img');
      img.src = `images/${i+1}.jpg`;
      img.className = 'carousel-image' + (i === 0 ? ' active' : '');
      img.draggable = false;
      wrapper.appendChild(img);
      images.push(img);
      // preload next for smoothness
      if (i < imageCount-1) { new Image().src = `images/${i+2}.jpg`; }
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => showImg(i));
      indicators.appendChild(dot);
      dots.push(dot);
    }
    setCaption(0);
  }
  function setCaption(idx) { caption.textContent = getCaption(idx); }
  function showImg(idx) {
    if (idx < 0) idx = imageCount-1;
    if (idx >= imageCount) idx = 0;
    images[currentImg].classList.remove('active');
    dots[currentImg].classList.remove('active');
    images[idx].classList.add('active');
    dots[idx].classList.add('active');
    setCaption(idx);
    currentImg = idx;
  }
  function prevImg() { showImg(currentImg - 1); resetAuto(); }
  function nextImg() { showImg(currentImg + 1); resetAuto(); }
  prevBtn.onclick = prevImg;
  nextBtn.onclick = nextImg;
  wrapper.addEventListener('touchstart', e => { if (e.touches.length === 1) startX = e.touches[0].clientX; });
  wrapper.addEventListener('touchmove', e => { if (e.touches.length === 1) moveX = e.touches[0].client
