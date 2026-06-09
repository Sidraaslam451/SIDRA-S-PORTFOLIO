/* ==================== TYPED.JS ==================== */
var typed = new Typed(".text-typed", {
  strings: [
    "Frontend Developer",
    "Full Stack Developer",
    "Python Learner",
    "Science Teacher",
    "ML Enthusiast",
  ],
  typeSpeed: 80,
  backSpeed: 50,
  backDelay: 1800,
  loop: true,
  showCursor: false,
});

/* ==================== PARTICLE CANVAS ==================== */
(function () {
  const canvas = document.getElementById("particleCanvas");
  const ctx = canvas.getContext("2d");
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.5 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,212,255,${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 90; i++) particles.push(new Particle());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,212,255,${0.12 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ==================== CURSOR GLOW ==================== */
const cursorGlow = document.getElementById("cursorGlow");
document.addEventListener("mousemove", (e) => {
  cursorGlow.style.left = e.clientX + "px";
  cursorGlow.style.top = e.clientY + "px";
});

/* ==================== HEADER SCROLL ==================== */
const header = document.getElementById("header");
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 50);
  highlightNav();
});

/* ==================== HAMBURGER ==================== */
const hamburger = document.getElementById("hamburger");
const navbar = document.getElementById("navbar");
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navbar.classList.toggle("open");
});
navbar.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => {
    hamburger.classList.remove("open");
    navbar.classList.remove("open");
  });
});

/* ==================== ACTIVE NAV HIGHLIGHT ==================== */
function highlightNav() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".navbar a");
  let current = "";
  sections.forEach((sec) => {
    if (window.scrollY >= sec.offsetTop - 200) current = sec.id;
  });
  navLinks.forEach((a) => {
    a.classList.remove("active");
    if (a.getAttribute("href") === "#" + current) a.classList.add("active");
  });
}

/* ==================== MODAL LOGIC ==================== */
document.addEventListener("click", function (e) {
  const trigger = e.target.closest(".modal-trigger");
  if (trigger) {
    e.preventDefault();
    const target = trigger.getAttribute("data-target");
    const modal = document.getElementById(target);
    if (modal) {
      modal.style.display = "flex";
      document.body.style.overflow = "hidden";
    }
  }
  if (e.target.classList.contains("modal-overlay")) {
    closeAllModals();
  }
  if (e.target.classList.contains("close-modal")) {
    closeAllModals();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAllModals();
});

function closeAllModals() {
  document
    .querySelectorAll(".modal-overlay")
    .forEach((m) => (m.style.display = "none"));
  document.body.style.overflow = "";
}

/* ==================== SCROLL REVEAL ==================== */
const revealEls = document.querySelectorAll(".reveal, .reveal-right");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        // Trigger skill animations when skills section is visible
        if (entry.target.closest("#skills")) {
          animateSkills();
        }
      }
    });
  },
  { threshold: 0.15 },
);
revealEls.forEach((el) => revealObserver.observe(el));

/* ==================== SKILLS ANIMATION ==================== */
let skillsAnimated = false;

function animateSkills() {
  if (skillsAnimated) return;
  skillsAnimated = true;

  // Progress bars
  document.querySelectorAll(".progress-line span").forEach((bar) => {
    setTimeout(() => {
      bar.style.transform = "scaleX(1)";
    }, 200);
  });

  // Radial bars
  const circumference = 2 * Math.PI * 80; // r=80 → ~502
  document.querySelectorAll(".progress-ring").forEach((ring) => {
    const pct = parseFloat(ring.getAttribute("data-pct")) / 100;
    const offset = circumference * (1 - pct);
    setTimeout(() => {
      ring.style.strokeDashoffset = offset;
    }, 300);
  });
}

// Add SVG gradient defs dynamically
(function addSvgGradient() {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.style.position = "absolute";
  const defs = document.createElementNS(ns, "defs");
  const grad = document.createElementNS(ns, "linearGradient");
  grad.setAttribute("id", "skillGrad");
  grad.setAttribute("x1", "0%");
  grad.setAttribute("y1", "0%");
  grad.setAttribute("x2", "100%");
  grad.setAttribute("y2", "0%");
  const stop1 = document.createElementNS(ns, "stop");
  stop1.setAttribute("offset", "0%");
  stop1.setAttribute("stop-color", "#00d4ff");
  const stop2 = document.createElementNS(ns, "stop");
  stop2.setAttribute("offset", "100%");
  stop2.setAttribute("stop-color", "#7b2fff");
  grad.appendChild(stop1);
  grad.appendChild(stop2);
  defs.appendChild(grad);
  svg.appendChild(defs);
  document.body.appendChild(svg);
})();

/* ==================== CONTACT FORM ==================== */
function sendMessage() {
  const name = document.getElementById("fname").value.trim();
  const email = document.getElementById("femail").value.trim();
  const subject = document.getElementById("fsubject").value;
  const message = document.getElementById("fmessage").value.trim();
  const status = document.getElementById("formStatus");
  const btn = document.getElementById("sendBtn");

  if (!name || !email || !subject || !message) {
    status.style.color = "#ff6b6b";
    status.textContent = "⚠️ Please fill in all fields.";
    return;
  }
  const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailReg.test(email)) {
    status.style.color = "#ff6b6b";
    status.textContent = "⚠️ Please enter a valid email.";
    return;
  }

  btn.textContent = "Sending…";
  btn.disabled = true;

  setTimeout(() => {
    status.style.color = "#0ef";
    status.textContent = "✅ Message sent! I'll get back to you soon.";
    btn.innerHTML = "Send Message <i class='bx bx-send'></i>";
    btn.disabled = false;
    document.getElementById("fname").value = "";
    document.getElementById("femail").value = "";
    document.getElementById("fsubject").value = "";
    document.getElementById("fmessage").value = "";
  }, 1400);
}
