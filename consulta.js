const TOTAL_STEPS = 5;
let currentStep = 1;

// State
const state = {
  service: null,
  presencia: null,
  objetivos: [],
  detalle: '',
  budget: '$150.000',
  urgency: null,
  nombre: '',
  telefono: '',
  email: ''
};

// Accordion select
function selectAccordion(el, group) {
  const allOptions = el.closest('.options').querySelectorAll('.accordion-option');
  allOptions.forEach(o => {
    if (o !== el) o.classList.remove('open');
  });
  el.classList.toggle('open');
  allOptions.forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  state[group] = el.dataset.value;
}

// Regular option select (non-accordion)

const budgetValues = [
  '$50.000', '$80.000', '$150.000', '$200.000',
  '$300.000', '$400.000', '$500.000', '$700.000', '$500.000+'
];

const serviceLabels = {
  web: 'Sitio web completo', landing: 'Landing page',
  chatbot: 'Chatbot', automatizacion: 'Automatizaci\u00f3n',
  dashboard: 'Dashboard / reportes', reservas: 'Sistema de turnos',
  'nos\u00e9': 'No s\u00e9 todav\u00eda'
};

const presenciaLabels = {
  no: 'Sin presencia digital', redes: 'Solo redes sociales',
  'web-vieja': 'Web desactualizada', 'web-ok': 'Web funcionando'
};

const urgencyLabels = {
  flexible: 'Sin apuro', '1mes': 'Pr\u00f3ximo mes',
  '2semanas': 'En 2 semanas', ya: 'Lo antes posible'
};

function updateProgress() {
  const pct = ((currentStep - 1) / (TOTAL_STEPS - 1)) * 100;
  document.getElementById('progress-bar').style.width = pct + '%';
}

function showStep(n) {
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  document.querySelector(`.step[data-step="${n}"]`).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  updateProgress();
}

function nextStep() {
  // Validation per step
  if (currentStep === 1 && !state.service) {
    shake('service-options'); return;
  }
  if (currentStep === 2 && !document.getElementById('rubro').value.trim()) {
    document.getElementById('rubro').focus(); return;
  }
  if (currentStep === 4 && !state.urgency) {
    shake('urgency-grid'); return;
  }
  if (currentStep === 5) { submitForm(); return; }

  currentStep++;
  if (currentStep === 5) buildSummary();
  showStep(currentStep);
}

function prevStep() {
  if (currentStep > 1) { currentStep--; showStep(currentStep); }
}

function selectOption(el, group) {
  el.closest('.options').querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  state[group] = el.dataset.value;
}

function toggleChip(el) {
  el.classList.toggle('selected');
  const v = el.dataset.value;
  if (el.classList.contains('selected')) {
    state.objetivos.push(v);
  } else {
    state.objetivos = state.objetivos.filter(x => x !== v);
  }
}

function selectUrgency(el) {
  document.querySelectorAll('.urgency-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  state.urgency = el.dataset.value;
}

function updateBudget(val) {
  state.budget = budgetValues[val];
  document.getElementById('budget-val').textContent = budgetValues[val].replace('$','');
}

function buildSummary() {
  state.detalle = document.getElementById('detalle').value;
  const rows = [
    { label: 'Servicio', value: serviceLabels[state.service] || state.service },
    { label: 'Rubro', value: document.getElementById('rubro').value || '\u2014' },
    { label: 'Presencia actual', value: presenciaLabels[state.presencia] || '\u2014' },
    { label: 'Objetivos', value: state.objetivos.length ? state.objetivos.join(', ') : '\u2014' },
    { label: 'Presupuesto aprox.', value: state.budget },
    { label: 'Urgencia', value: urgencyLabels[state.urgency] || '\u2014' },
  ];
  document.getElementById('summary-card').innerHTML = rows.map(r =>
    `<div class="summary-row"><span class="label">${r.label}</span><span class="value">${r.value}</span></div>`
  ).join('');
}

function shake(id) {
  const el = document.getElementById(id);
  el.style.animation = 'none';
  el.offsetHeight; // reflow
  el.style.animation = 'shake 0.4s ease';
}

function submitForm() {
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

  const btn = document.getElementById('btn-submit');
  btn.disabled = true;
  btn.textContent = 'Enviando...';

  // Ac\u00e1 ir\u00eda el fetch al backend
  setTimeout(() => {
    document.getElementById('form-steps').style.display = 'none';
    document.getElementById('success-screen').classList.add('show');
    document.getElementById('progress-bar').style.width = '100%';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 1000);
}

// Shake keyframe
const style = document.createElement('style');
style.textContent = `@keyframes shake {
  0%,100%{transform:translateX(0)}
  20%{transform:translateX(-6px)}
  40%{transform:translateX(6px)}
  60%{transform:translateX(-4px)}
  80%{transform:translateX(4px)}
}`;
document.head.appendChild(style);

updateProgress();
