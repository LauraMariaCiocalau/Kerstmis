// ===== Audio controls =====
const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const muteBtn = document.getElementById("muteBtn");

let playing = false;

function setPlayUI() {
  playBtn.textContent = playing ? "⏸ Pauze" : "▶ Kerstlied afspelen";
}

playBtn.addEventListener("click", async () => {
  try {
    if (!playing) {
      await audio.play(); // browsers require user gesture
      playing = true;
      setPlayUI();
    } else {
      audio.pause();
      playing = false;
      setPlayUI();
    }
  } catch (e) {
    alert("Afspelen is geblokkeerd door je browser. Probeer opnieuw.");
    console.error(e);
  }
});

audio.addEventListener("ended", () => {
  playing = false;
  setPlayUI();
});

muteBtn.addEventListener("click", () => {
  audio.muted = !audio.muted;
  muteBtn.setAttribute("aria-pressed", String(audio.muted));
  muteBtn.textContent = audio.muted ? "🔇 Gedempt" : "🔊 Geluid";
});

// ===== Snow animation (canvas) =====
const canvas = document.getElementById("snow");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const flakes = [];
const FLAKE_COUNT = 140;

const rand = (min, max) => Math.random() * (max - min) + min;

function initFlakes() {
  flakes.length = 0;
  for (let i = 0; i < FLAKE_COUNT; i++) {
    flakes.push({
      x: rand(0, window.innerWidth),
      y: rand(0, window.innerHeight),
      r: rand(1.2, 3.6),
      vy: rand(0.6, 2.0),
      vx: rand(-0.35, 0.35),
      a: rand(0.35, 0.9),
    });
  }
}

initFlakes();

function tick() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (const f of flakes) {
    f.x += f.vx + Math.sin((f.y + f.r) * 0.01) * 0.3;
    f.y += f.vy;

    if (f.y > window.innerHeight + 10) {
      f.y = -10;
      f.x = rand(0, window.innerWidth);
    }
    if (f.x < -20) f.x = window.innerWidth + 20;
    if (f.x > window.innerWidth + 20) f.x = -20;

    ctx.globalAlpha = f.a;
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
  }

  ctx.globalAlpha = 1;
  requestAnimationFrame(tick);
}

tick();

// ===== Greeting light + text =====
const greetBtn = document.getElementById("greetBtn");
const lightOverlay = document.getElementById("lightOverlay");
const greeting = document.getElementById("greeting");

let greetingOn = false;

greetBtn.addEventListener("click", () => {
  // toggle on/off
  greetingOn = !greetingOn;

  if (greetingOn) {
    lightOverlay.classList.remove("on");
    greeting.classList.remove("on");

    // restart animations reliably
    void lightOverlay.offsetWidth;
    void greeting.offsetWidth;

    lightOverlay.classList.add("on");
    greeting.classList.add("on");
    greeting.setAttribute("aria-hidden", "false");
    greetBtn.textContent = "✨ Verberg"; // "Ascunde"
  } else {
    lightOverlay.classList.remove("on");
    greeting.classList.remove("on");
    greeting.setAttribute("aria-hidden", "true");
    greetBtn.textContent = "✨ Wens";
  }
});
