// API List
const apis = [
  {
    name: "Share Text API",
    url: "https://sharetextapi-anugasenithu.vercel.app/api/tool/sharetext?q=hello%20user",
    active: true
  },
  {
    name: "Sticker Search API",
    url: "https://stickersearchapi-anugasenithu.vercel.app/api/search/sticker?q=baby",
    active: true
  }
];

// Containers
const apiContainer = document.getElementById('api-container');

// Theme Toggle
const themeBtn = document.getElementById('theme-toggle');
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('light');
  document.body.classList.toggle('dark');
});

// Create API Card
function createApiCard(api) {
  const card = document.createElement('div');
  card.className = 'api-card';

  const title = document.createElement('h3');
  title.textContent = api.name;

  const btn = document.createElement('button');
  btn.textContent = 'Go to API';
  btn.onclick = () => window.open(api.url, '_blank');

  card.appendChild(title);
  card.appendChild(btn);
  return card;
}

// Show APIs based on type
function showApis(type) {
  apiContainer.innerHTML = '';

  if(type === 'inactive') {
    apiContainer.textContent = 'No inactive APIs';
    apiContainer.style.color = '#0f0';
    return;
  }

  const filtered = type === 'active' ? apis.filter(a => a.active) : apis;
  filtered.forEach(api => {
    apiContainer.appendChild(createApiCard(api));
  });
}

// Initial load: show all APIs
showApis('all');

// Tab buttons
const tabButtons = document.querySelectorAll('.api-tabs button');
tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.getAttribute('data-tab');
    showApis(tab);
  });
});

/* Hacker Matrix Background Animation */
const canvas = document.getElementById('matrix-bg');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%';
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = [];

for (let x = 0; x < columns; x++) drops[x] = 1;

function draw() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#0f0';
  ctx.font = fontSize + 'px monospace';

  for (let i = 0; i < drops.length; i++) {
    const text = letters.charAt(Math.floor(Math.random() * letters.length));
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

setInterval(draw, 50);

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
