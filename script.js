// Arrays
let apis=[
  {name:"Share Text API", url:"https://sharetextapi-anugasenithu.vercel.app/api/tool/sharetext?q=hello%20user", active:true, requests:120},
  {name:"Sticker Search API", url:"https://stickersearchapi-anugasenithu.vercel.app/api/search/sticker?q=baby", active:true, requests:80}
];
let apiKeys=[];

// DOM Elements
const apiTableBody=document.getElementById('api-table-body');
const totalApisEl=document.getElementById('total-apis');
const activeApisEl=document.getElementById('active-apis');
const inactiveApisEl=document.getElementById('inactive-apis');
const totalRequestsEl=document.getElementById('total-requests');
const sidebar=document.getElementById('sidebar');
const menuBtn=document.getElementById('menu-btn');
const apiKeyTableBody=document.getElementById('apikey-table-body');

// Theme toggle
document.getElementById('theme-toggle').addEventListener('click',()=>{
  document.body.classList.toggle('light');
  document.body.classList.toggle('dark');
});

// Sidebar Tabs
document.querySelectorAll('.tab-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const tabId = btn.dataset.tab + '-tab';
    document.querySelectorAll('.tab-content').forEach(tab=>{
      tab.id===tabId?tab.classList.remove('hidden'):tab.classList.add('hidden');
    });
    if(window.innerWidth<=768) sidebar.classList.remove('show');
  });
});

// Hamburger Menu
menuBtn.addEventListener('click',()=>sidebar.classList.toggle('show'));

// Show API Table
function showApiTable(filter){
  apiTableBody.innerHTML='';
  let filtered = filter==='all'?apis: filter==='active'?apis.filter(a=>a.active):apis.filter(a=>!a.active);
  if(filtered.length===0){
    const row=document.createElement('tr');
    const cell=document.createElement('td'); cell.colSpan=3; cell.textContent='No APIs'; cell.style.textAlign='center';
    row.appendChild(cell); apiTableBody.appendChild(row); return;
  }
  filtered.forEach(api=>{
    const row=document.createElement('tr');
    const nameCell=document.createElement('td'); nameCell.textContent=api.name;
    const statusCell=document.createElement('td'); statusCell.textContent=api.active?'Active':'Inactive';
    const actionCell=document.createElement('td'); 
    const btn=document.createElement('button'); btn.textContent='Go to API'; btn.onclick=()=>window.open(api.url,'_blank'); 
    actionCell.appendChild(btn);
    row.appendChild(nameCell); row.appendChild(statusCell); row.appendChild(actionCell);
    apiTableBody.appendChild(row);
  });
  updateStats();
}

// Filter Buttons
document.querySelectorAll('.filter-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    showApiTable(btn.dataset.filter);
  });
});

// Update Stats
function updateStats(){
  totalApisEl.textContent=apis.length;
  activeApisEl.textContent=apis.filter(a=>a.active).length;
  inactiveApisEl.textContent=apis.filter(a=>!a.active).length;
  totalRequestsEl.textContent=apis.reduce((sum,a)=>sum+a.requests,0);
}

// API Key Management
function showApiKeys(){
  apiKeyTableBody.innerHTML='';
  apiKeys.forEach((key,index)=>{
    const row=document.createElement('tr');
    const keyCell=document.createElement('td'); keyCell.textContent=key;
    const actionCell=document.createElement('td');
    const btn=document.createElement('button'); btn.textContent='Revoke'; btn.onclick=()=>{apiKeys.splice(index,1); showApiKeys();}
    actionCell.appendChild(btn);
    row.appendChild(keyCell); row.appendChild(actionCell);
    apiKeyTableBody.appendChild(row);
  });
}

// Generate API Key
document.getElementById('generate-apikey').addEventListener('click',()=>{
  const name=document.getElementById('apikey-name').value || 'API_KEY';
  const key=name+'-'+Math.random().toString(36).substring(2,12);
  apiKeys.push(key);
  document.getElementById('apikey-name').value='';
  showApiKeys();
});

// Create new API
document.getElementById('add-api').addEventListener('click',()=>{
  const name=document.getElementById('api-name').value;
  const url=document.getElementById('api-url').value;
  const status=document.getElementById('api-status').value==='true';
  if(name && url){
    apis.push({name, url, active:status, requests:0});
    document.getElementById('api-name').value='';
    document.getElementById('api-url').value='';
    showApiTable('all');
  }
});

// Initial load
showApiTable('all');
showApiKeys();

// Matrix Background
const canvas=document.getElementById('matrix-bg');
const ctx=canvas.getContext('2d');
canvas.width=window.innerWidth; canvas.height=window.innerHeight;
const letters='ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%';
const fontSize=16; const columns=canvas.width/fontSize; const drops=[];
for(let x=0;x<columns;x++)drops[x]=1;
function draw(){
  ctx.fillStyle='rgba(0,0,0,0.05)'; ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle='#0f0'; ctx.font=fontSize+'px monospace';
  for(let i=0;i<drops.length;i++){
    const text=letters.charAt(Math.floor(Math.random()*letters.length));
    ctx.fillText(text,i*fontSize,drops[i]*fontSize);
    if(drops[i]*fontSize>canvas.height && Math.random()>0.975)drops[i]=0;
    drops[i]++;
  }
}
setInterval(draw,50);
window.addEventListener('resize',()=>{canvas.width=window.innerWidth;canvas.height=window.innerHeight;});setInterval(draw,50);
window.addEventListener('resize',()=>{canvas.width=window.innerWidth;canvas.height=window.innerHeight;});
