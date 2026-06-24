/* ══════════════════════════════════════════════
   NahuDev Portfolio — Advanced Interactions
   ══════════════════════════════════════════════ */

// ── DARK MODE TOGGLE ──
(function initTheme() {
  const html = document.documentElement;
  const toggle = document.querySelector('.theme-toggle');

  // Restore saved preference, default to dark
  const saved = localStorage.getItem('nahudev-theme');
  if (saved === 'light') {
    html.setAttribute('data-theme', 'light');
  } else {
    html.setAttribute('data-theme', 'dark');
  }

  // Toggle on click
  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('nahudev-theme', next);
    });
  }
})();

// ── SCROLL REVEAL with blur transition ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── CHIPS ──
document.querySelectorAll('#chips .chip').forEach(c =>
  c.addEventListener('click', () => c.classList.toggle('active'))
);

// ── SUBMIT ──
function handleSubmit() {
  const nombre  = document.getElementById('nombre').value.trim();
  const tel     = document.getElementById('telefono').value.trim();
  const email   = document.getElementById('email').value.trim();
  const consent = document.getElementById('consent').checked;

  if (!nombre || !tel || !email) {
    alert('Complet\u00e1 nombre, tel\u00e9fono y email para poder responderte.');
    return;
  }
  if (!consent) {
    alert('Necesito tu consentimiento para guardar los datos.');
    return;
  }

  // Gather selected chips
  const chips = Array.from(document.querySelectorAll('#chips .chip.active'))
    .map(function (c) { return c.dataset.value; });

  const mensaje = document.getElementById('mensaje').value.trim();

  var btn = document.getElementById('submit-btn');
  var originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Enviando...';

  fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre: nombre, telefono: tel, email: email, chips: chips, mensaje: mensaje }),
  })
    .then(function (res) {
      if (!res.ok) return res.json().then(function (err) { throw err; });
      return res.json();
    })
    .then(function () {
      document.getElementById('form-content').style.display = 'none';
      document.getElementById('success-msg').style.display = 'block';
    })
    .catch(function (err) {
      console.error('Error al enviar:', err);
      alert(err && err.error ? err.error : 'Hubo un error al enviar. Intent\u00e1 de nuevo en unos minutos.');
      btn.disabled = false;
      btn.textContent = originalText;
    });
}

// ── PARALLAX EFFECT ON HERO (subtle) ──
(function initParallax() {
  // Skip if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const hero = document.querySelector('.hero');
  const heroLeft = document.querySelector('.hero-left');

  if (!hero || !heroLeft) return;

  let ticking = false;

  function updateParallax() {
    const rect = hero.getBoundingClientRect();
    const heroHeight = rect.height;
    const heroTop = rect.top;

    // Only apply when hero is partially visible
    if (heroTop > window.innerHeight || heroTop < -heroHeight) {
      ticking = false;
      return;
    }

    // Map scroll position to a factor from 0 (top of hero at top of viewport) to 1 (bottom at bottom)
    const factor = Math.max(0, Math.min(1, -heroTop / (heroHeight - window.innerHeight)));
    // Subtle displacement: max 16px
    const offset = factor * 16;

    heroLeft.style.transform = `translateY(${offset}px)`;

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

// ── MAGNETIC BUTTONS ──
(function initMagnetic() {
  const buttons = document.querySelectorAll('.btn-primary, .nav-cta');

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Max 6px pull
      const strength = 0.25;
      const tx = x * strength;
      const ty = y * strength;

      btn.style.transition = 'transform 0.15s ease-out';
      btn.style.transform = `translate(${tx}px, ${ty}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      btn.style.transform = 'translate(0, 0)';
    });
  });
})();

// ── RIPPLE EFFECT ON BUTTONS ──
(function initRipple() {
  const buttons = document.querySelectorAll('.btn-primary, .submit-btn, .nav-cta');

  buttons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      // Remove any existing ripples
      const existing = btn.querySelectorAll('.ripple');
      existing.forEach(r => r.remove());

      const ripple = document.createElement('span');
      ripple.className = 'ripple';

      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';

      btn.appendChild(ripple);

      // Cleanup after animation
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });
})();

// ── PARTICLES ANIMATION (Antigravity style) ──
(function initParticles() {
  // Skip if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;

  // Configuration
  const PARTICLE_COUNT = 60;
  const CONNECTION_DISTANCE = 150;
  const PARTICLE_SIZE = { min: 1, max: 3 };
  const SPEED = { min: 0.2, max: 0.8 };

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: PARTICLE_SIZE.min + Math.random() * (PARTICLE_SIZE.max - PARTICLE_SIZE.min),
      speedX: (Math.random() - 0.5) * SPEED.max * 2,
      speedY: (Math.random() - 0.5) * SPEED.max * 2,
      opacity: 0.3 + Math.random() * 0.5
    };
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }
  }

  function getParticleColor() {
    const theme = document.documentElement.getAttribute('data-theme');
    return theme === 'dark' ? '255, 255, 255' : '37, 99, 235';
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const color = getParticleColor();

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < CONNECTION_DISTANCE) {
          const opacity = (1 - distance / CONNECTION_DISTANCE) * 0.15;
          ctx.strokeStyle = `rgba(${color}, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(particle => {
      ctx.fillStyle = `rgba(${color}, ${particle.opacity})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function updateParticles() {
    particles.forEach(particle => {
      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // Wrap around edges
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;
    });
  }

  function animate() {
    updateParticles();
    drawParticles();
    animationId = requestAnimationFrame(animate);
  }

  // Initialize
  init();
  animate();

  // Handle resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      init();
    }, 250);
  });

  // Cleanup on page hide
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      animate();
    }
  });
})();
