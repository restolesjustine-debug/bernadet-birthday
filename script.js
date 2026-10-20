const openButton = document.getElementById("openLetter");
const letterPaper = document.getElementById("letterPaper");
openButton.addEventListener("click", () => {
  const opening = letterPaper.hidden;
  letterPaper.hidden = !opening;
  openButton.setAttribute("aria-expanded", String(opening));
  openButton.innerHTML = opening ? 'Close your letter <span>×</span>' : 'Open your letter <span>↗</span>';
  if (opening) setTimeout(() => letterPaper.scrollIntoView({behavior:"smooth",block:"start"}), 100);
});

const music = document.getElementById("birthdayMusic");
const musicToggle = document.getElementById("musicToggle");
const musicLabel = document.getElementById("musicLabel");
musicToggle.addEventListener("click", async () => {
  if (music.paused) {
    try { await music.play(); musicLabel.textContent = "Pause the music"; musicToggle.setAttribute("aria-pressed","true"); }
    catch { musicLabel.textContent = "Add music.mp3 first"; }
  } else { music.pause(); musicLabel.textContent = "Play a little music"; musicToggle.setAttribute("aria-pressed","false"); }
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); } });
}, {threshold:0.12});
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

/* Soft floating petals and tiny sparkles. */
const canvas = document.getElementById("petals");
const ctx = canvas.getContext("2d");
let w, h, particles = [];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  w = window.innerWidth; h = window.innerHeight;
  canvas.width = w * dpr; canvas.height = h * dpr;
  canvas.style.width = w + "px"; canvas.style.height = h + "px";
  ctx.setTransform(dpr,0,0,dpr,0,0);
  particles = Array.from({length: reduceMotion ? 0 : Math.min(34, Math.floor(w / 24))}, () => newPetal(true));
}
function newPetal(randomY=false) {
  return {x:Math.random()*w,y:randomY?Math.random()*h:-20,size:3+Math.random()*5,speed:.35+Math.random()*.75,drift:(Math.random()-.5)*.55,angle:Math.random()*Math.PI*2,spin:(Math.random()-.5)*.025,alpha:.25+Math.random()*.45,petal:Math.random()>.35};
}
function draw() {
  ctx.clearRect(0,0,w,h);
  particles.forEach(p => {
    p.y += p.speed; p.x += Math.sin(p.angle)*.45+p.drift; p.angle += p.spin;
    if (p.y > h+20) Object.assign(p,newPetal());
    ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.angle); ctx.globalAlpha=p.alpha;
    ctx.fillStyle=p.petal ? "#c98c91" : "#b5ad87";
    if (p.petal) { ctx.beginPath(); ctx.ellipse(0,0,p.size*.65,p.size*1.2,0,0,Math.PI*2); ctx.fill(); }
    else { ctx.font=`${p.size*2.5}px Georgia`; ctx.fillText("✧",0,0); }
    ctx.restore();
  });
  if (!reduceMotion) requestAnimationFrame(draw);
}
window.addEventListener("resize",resize);
resize();
if (!reduceMotion) draw();
