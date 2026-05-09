// ===== REPRODUCTOR =====
const playlist = [
    "01. Daddy’s Groove - Stellar (Martin Garrix Remix).wav",
    "FTampa, The OtherZ, NUZB - Lakers (Extended Mix).mp3",
    "Make Up Your Mind vs Glitch (Martin Garrix Mashup).wav"
];

let currentIndex = 0;
let audio, playBtn, songNameEl, musicIcon, progressBar, progressBarWrap, player;

// Esperar que cargue el HTML
window.addEventListener("DOMContentLoaded", () => {

    audio = document.getElementById('bg-audio');
    playBtn = document.getElementById('play-btn');
    songNameEl = document.getElementById('song-name');
    musicIcon = document.getElementById('music-icon');
    progressBar = document.getElementById('progress-bar');
    progressBarWrap = document.getElementById('progress-bar-wrap');
    player = document.getElementById('music-player');

    window.setVolume = function (value) {
    audio.volume = value;
}

    // ===== Cargar canción =====
    function loadSong(index) {
        const fileName = playlist[index];
        audio.src = 'assets/audio/' + encodeURIComponent(fileName);
        songNameEl.textContent = fileName.replace(/\.[^.]+$/, '');
        progressBar.style.width = '0%';
    }

    window.toggleMusic = function () {
        if (audio.paused) {
            audio.play().then(() => {
                playBtn.textContent = '⏸';
                musicIcon.classList.add('spinning');
                player.classList.add('playing');
            });
        } else {
            audio.pause();
            playBtn.textContent = '▶';
            musicIcon.classList.remove('spinning');
            player.classList.remove('playing');
        }
    }

    window.nextSong = function () {
        currentIndex = (currentIndex + 1) % playlist.length;
        loadSong(currentIndex);
        audio.play();
    }

    audio.addEventListener('ended', () => nextSong());

    // ===== GUARDAR ESTADO =====
    window.addEventListener("beforeunload", () => {
        localStorage.setItem("musicTime", audio.currentTime);
        localStorage.setItem("musicPlaying", !audio.paused);
        localStorage.setItem("musicIndex", currentIndex);
    });

    // ===== RECUPERAR ESTADO =====
    const savedTime = localStorage.getItem("musicTime");
    const wasPlaying = localStorage.getItem("musicPlaying");
    const savedIndex = localStorage.getItem("musicIndex");

    if (savedIndex !== null) {
        currentIndex = parseInt(savedIndex);
    }

    loadSong(currentIndex);

    if (savedTime !== null) {
        audio.currentTime = parseFloat(savedTime);
    }

    if (wasPlaying === "true") {
        audio.play().then(() => {
            playBtn.textContent = '⏸';
            musicIcon.classList.add('spinning');
            player.classList.add('playing');
        });
    }

});