// List of APIs
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
const activeContainer = document.getElementById('active-apis');
const inactiveContainer = document.getElementById('inactive-apis');
const allContainer = document.getElementById('all-apis');

// Function to create API card
function createApiCard(api) {
  const card = document.createElement('div');
  card.className = 'api-card';

  const name = document.createElement('h3');
  name.textContent = api.name;

  const button = document.createElement('button');
  button.textContent = "Go to API";
  button.onclick = () => window.open(api.url, '_blank');

  card.appendChild(name);
  card.appendChild(button);

  return card;
}

// Add APIs to sections
apis.forEach(api => {
  const card = createApiCard(api);

  // All APIs section
  allContainer.appendChild(createApiCard(api));

  // Active or inactive section
  if (api.active) {
    activeContainer.appendChild(card);
  } else {
    inactiveContainer.appendChild(card);
  }
});
