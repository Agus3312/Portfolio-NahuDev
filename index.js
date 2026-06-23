/* ══════════════════════════════════════════════
   NahuDev Portfolio — Advanced Interactions
   ══════════════════════════════════════════════ */

// ── DARK MODE TOGGLE ──
(function initTheme() {
  const html = document.documentElement;
  const toggle = document.querySelector('.theme-toggle');

  // Restore saved preference
  const saved = localStorage.getItem('nahudev-theme');
  if (saved === 'dark') {
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

  const btn = document.getElementById('submit-btn');
  btn.disabled = true;
  btn.textContent = 'Enviando...';

  // Aqu\u00ed ir\u00eda el fetch al backend
  setTimeout(() => {
    document.getElementById('form-content').style.display = 'none';
    document.getElementById('success-msg').style.display = 'block';
  }, 1000);
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
