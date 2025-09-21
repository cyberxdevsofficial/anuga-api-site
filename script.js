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
