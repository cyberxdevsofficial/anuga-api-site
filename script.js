// APIs
const apis = [
  {name: "Share Text API", url: "https://sharetextapi-anugasenithu.vercel.app/api/tool/sharetext?q=hello%20user", active:true},
  {name: "Sticker Search API", url: "https://stickersearchapi-anugasenithu.vercel.app/api/search/sticker?q=baby", active:true}
];

// DOM
const apiContainer = document.getElementById('api-container');
const totalApisEl = document.getElementById('total-apis');
const activeApisEl = document.getElementById('active-apis');
const inactiveApisEl = document.getElementById('inactive-apis');

// Theme Toggle
document.getElementById('theme-toggle').addEventListener('click',()=>{
  document.body.classList.toggle('light');
  document.body.classList.toggle('dark');
});

// Sidebar Tabs
document.querySelectorAll('.sidebar nav button').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.sidebar nav button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab-content').forEach(tab=>tab.classList.add('hidden'));
    document.getElementById(btn.dataset.tab+'-tab').classList.remove('hidden');
  });
});

// API Cards
function createApiCard(api){
  const card = document.createElement('div');
  card.className='api-card';
  const h3=document.createElement('h3');
  h3.textContent=api.name;
  const btn=document.createElement('button');
  btn.textContent='Go to API';
  btn.onclick=()=>window.open(api.url,'_blank');
  card.appendChild(h3);
  card.appendChild(btn);
  return card;
}

// Filter APIs
function showApis(filter){
  apiContainer.innerHTML='';
  let filtered=[];
  if(filter==='inactive'){
    apiContainer.textContent='No inactive APIs';
    apiContainer.style.color=document.body.classList.contains('light')?'#0f0':'#0f0';
    return;
  } else if(filter==='active'){
    filtered=apis.filter(a=>a.active);
  } else {
    filtered=apis;
  }
  filtered.forEach(a=>apiContainer.appendChild(createApiCard(a)));
}

// Filter Buttons
document.querySelectorAll('.filter-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    showApis(btn.dataset.filter);
  });
});

// Stats
totalApisEl.textContent=apis.length;
activeApisEl.textContent=apis.filter(a=>a.active).length;
inactiveApisEl.textContent=apis.filter(a=>!a.active).length;

// Initial Load
showApis('all');

// Matrix Background
const canvas=document.getElementById('matrix-bg');
const ctx=canvas.getContext('2d');
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
const letters='ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%';
const fontSize=16;
const columns=canvas.width/fontSize;
const drops=[];
for(let x=0;x<columns;x++)drops[x]=1;
function draw(){
  ctx.fillStyle='rgba(0,0,0,0.05)';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle='#0f0';
  ctx.font=fontSize+'px monospace';
  for(let i=0;i<drops.length;i++){
    const text=letters.charAt(Math.floor(Math.random()*letters.length));
    ctx.fillText(text,i*fontSize,drops[i]*fontSize);
    if(drops[i]*fontSize>canvas.height && Math.random()>0.975)drops[i]=0;
    drops[i]++;
  }
}
setInterval(draw,50);
window.addEventListener('resize',()=>{
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;
});
