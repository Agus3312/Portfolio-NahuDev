// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Stat cards observer (slide from right)
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.stat-card').forEach(el => statObserver.observe(el));

// Chips
document.querySelectorAll('#chips .chip').forEach(c =>
  c.addEventListener('click', () => c.classList.toggle('active'))
);

// Submit
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

  // Ac\u00e1 ir\u00eda el fetch al backend
  setTimeout(() => {
    document.getElementById('form-content').style.display = 'none';
    document.getElementById('success-msg').style.display = 'block';
  }, 1000);
}
