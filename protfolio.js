/* ============================================================
   DEVOPS PORTFOLIO — script.js
   Animations: Loader, Particles, Cursor, Scroll Reveal,
   Terminal Typewriter, Pipeline, Counter, Form
   ============================================================ */

/* ===== 1. LOADER ===== */
const loaderMessages = [
  '> Initializing environment...',
  '> Pulling Docker images...',
  '> Configuring CI/CD pipeline...',
  '> Deploying to AWS...',
  '> All systems go ✓',
];

const loaderText     = document.getElementById('loaderText');
const loaderProgress = document.getElementById('loaderProgress');
const loader         = document.getElementById('loader');

let msgIdx = 0;
let charIdx = 0;
let loaderInterval;

function typeLoaderMessage() {
  if (msgIdx >= loaderMessages.length) {
    clearInterval(loaderInterval);
    setTimeout(() => loader.classList.add('done'), 300);
    return;
  }
  const msg = loaderMessages[msgIdx];
  if (charIdx < msg.length) {
    loaderText.textContent = msg.slice(0, ++charIdx);
    const pct = ((msgIdx / loaderMessages.length) + (charIdx / msg.length / loaderMessages.length)) * 100;
    loaderProgress.style.width = pct + '%';
  } else {
    charIdx = 0;
    msgIdx++;
    setTimeout(() => {}, 200);
  }
}
loaderInterval = setInterval(typeLoaderMessage, 28);

/* ===== 2. CUSTOM CURSOR ===== */
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left  = mouseX + 'px';
  cursorDot.style.top   = mouseY + 'px';
});

function animateCursor() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .skill-pill, .project-card, .contact-item, .footer-top-btn')
  .forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovered'));
  });

/* ===== 3. NAV SCROLL ===== */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

/* ===== 4. PARTICLE CANVAS ===== */
const canvas = document.getElementById('bgCanvas');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const PARTICLE_COUNT = 90;
const particles = [];

class Particle {
  constructor() { this.reset(true); }
  reset(init = false) {
    this.x  = Math.random() * canvas.width;
    this.y  = init ? Math.random() * canvas.height : canvas.height + 10;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = -(Math.random() * 0.4 + 0.1);
    this.r  = Math.random() * 1.5 + 0.3;
    this.a  = Math.random() * 0.6 + 0.1;
    this.life = 1;
    this.decay = Math.random() * 0.003 + 0.001;
  }
  update() {
    this.x    += this.vx;
    this.y    += this.vy;
    this.life -= this.decay;
    if (this.life <= 0 || this.y < -10) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,229,255,${this.a * this.life})`;
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

// Connection lines
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        const alpha = (1 - dist / 120) * 0.12;
        ctx.strokeStyle = `rgba(0,229,255,${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ===== 5. SCROLL REVEAL ===== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal, .reveal-up, .section-label')
  .forEach(el => revealObserver.observe(el));

/* ===== 6. TERMINAL TYPEWRITER ===== */
const termCommands = [
  { cmd: 'docker build -t myapp:latest .', out: '✓ Successfully built a3f91c2d' },
  { cmd: 'kubectl apply -f deployment.yaml', out: '✓ deployment.apps/myapp configured' },
  { cmd: 'terraform apply --auto-approve',   out: '✓ Apply complete! 6 added, 0 destroyed' },
  { cmd: 'git push origin main',             out: '✓ Pipeline triggered on GitHub Actions' },
  { cmd: 'aws s3 sync ./dist s3://mybucket', out: '✓ Upload: dist/index.html to s3://mybucket' },
];

const termCmd    = document.getElementById('termCmd');
const termOutput = document.getElementById('termOutput');
let tIdx = 0;

function runTerminal() {
  const item = termCommands[tIdx % termCommands.length];
  termCmd.textContent    = '';
  termOutput.textContent = '';
  let i = 0;
  const typing = setInterval(() => {
    termCmd.textContent = item.cmd.slice(0, ++i);
    if (i >= item.cmd.length) {
      clearInterval(typing);
      setTimeout(() => {
        termOutput.textContent = item.out;
        tIdx++;
        setTimeout(runTerminal, 2800);
      }, 400);
    }
  }, 48);
}
setTimeout(runTerminal, 1800);

/* ===== 7. PIPELINE ANIMATION ===== */
const pipeSteps  = document.querySelectorAll('.pipe-step');
const pipeArrows = document.querySelectorAll('.arrow-fill');
let pipeIdx = 0;
let pipeAnimating = false;

function animatePipeline() {
  if (pipeAnimating) return;
  pipeAnimating = true;

  // Reset
  pipeSteps.forEach(s => s.classList.remove('active'));
  pipeArrows.forEach(a => { a.classList.remove('flowing'); a.style.left = '-100%'; });
  pipeIdx = 0;

  function nextStep() {
    if (pipeIdx >= pipeSteps.length) {
      setTimeout(() => { pipeAnimating = false; setTimeout(animatePipeline, 1500); }, 800);
      return;
    }
    pipeSteps[pipeIdx].classList.add('active');
    if (pipeIdx < pipeArrows.length) {
      setTimeout(() => {
        pipeArrows[pipeIdx].classList.add('flowing');
      }, 200);
    }
    pipeIdx++;
    setTimeout(nextStep, 700);
  }
  nextStep();
}

// Start when pipeline enters viewport
const pipelineSection = document.querySelector('.pipeline-section');
const pipeObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    setTimeout(animatePipeline, 300);
    pipeObs.disconnect();
  }
}, { threshold: 0.3 });
if (pipelineSection) pipeObs.observe(pipelineSection);

/* ===== 8. COUNTER ANIMATION ===== */
const counters = document.querySelectorAll('.stat-num');
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseInt(el.dataset.target);
    let current = 0;
    const step = target / 40;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current);
      if (current >= target) clearInterval(timer);
    }, 30);
    counterObs.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObs.observe(c));

/* ===== 9. CONTACT FORM ===== */
const sendBtn     = document.getElementById('sendBtn');
const sendBtnText = document.getElementById('sendBtnText');
const formSuccess = document.getElementById('formSuccess');

if (sendBtn) {
  sendBtn.addEventListener('click', () => {
    const name    = document.getElementById('fname')?.value.trim();
    const email   = document.getElementById('femail')?.value.trim();
    const message = document.getElementById('fmessage')?.value.trim();

    if (!name || !email || !message) {
      sendBtn.style.boxShadow = '0 0 0 2px rgba(255,80,80,0.5)';
      setTimeout(() => sendBtn.style.boxShadow = '', 1200);
      return;
    }
    sendBtnText.textContent = 'Sending...';
    sendBtn.disabled = true;
    setTimeout(() => {
      sendBtnText.textContent = 'Message Sent ✓';
      formSuccess.classList.add('show');
      setTimeout(() => {
        sendBtnText.textContent = 'Send Message';
        sendBtn.disabled = false;
        formSuccess.classList.remove('show');
        document.getElementById('fname').value = '';
        document.getElementById('femail').value = '';
        document.getElementById('fmessage').value = '';
      }, 3000);
    }, 1500);
  });
}

/* ===== 10. SCROLL-TO-TOP ===== */
document.getElementById('topBtn')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ===== 11. NAV ACTIVE LINK ===== */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const activeLinkObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.style.color = '');
      const match = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
      if (match) match.style.color = 'var(--accent)';
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => activeLinkObs.observe(s));

/* ===== 12. SKILL PILL HOVER RIPPLE ===== */
document.querySelectorAll('.skill-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    pill.classList.toggle('active');
  });
});

/* ===== 13. TILT EFFECT ON PROJECT CARDS ===== */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ===== 14. SECTION ENTRANCE LINE ===== */
// Animate the label lines width on reveal
document.querySelectorAll('.label-line').forEach(line => {
  line.style.width = '0';
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      line.style.transition = 'width 0.6s ease 0.2s';
      line.style.width = '40px';
      obs.disconnect();
    }
  });
  obs.observe(line);
});

/* ===== 15. PAGE LOAD FADE IN ===== */
window.addEventListener('load', () => {
  document.body.style.opacity = '1';
});
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease 0.2s';
