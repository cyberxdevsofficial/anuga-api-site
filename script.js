// APIs
const apis=[
  {name:"Share Text API", url:"https://sharetextapi-anugasenithu.vercel.app/api/tool/sharetext?q=hello%20user", active:true, requests:120},
  {name:"Sticker Search API", url:"https://stickersearchapi-anugasenithu.vercel.app/api/search/sticker?q=baby", active:true, requests:80},
  {name:"Old API", url:"#", active:false, requests:0}
];

// DOM Elements
const apiTableBody=document.getElementById('api-table-body');
const totalApisEl=document.getElementById('total-apis');
const activeApisEl=document.getElementById('active-apis');
const inactiveApisEl=document.getElementById('inactive-apis');
const totalRequestsEl=document.getElementById('total-requests');
const sidebar=document.getElementById('sidebar');
const menuBtn=document.getElementById('menu-btn');

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

    // Show correct tab
    const tabId = btn.dataset.tab + '-tab';
    document.querySelectorAll('.tab-content').forEach(tab=>{
      if(tab.id === tabId) tab.classList.remove('hidden');
      else tab.classList.add('hidden');
    });

    // Close sidebar on mobile
    if(window.innerWidth <= 768){
      sidebar.classList.remove('show');
    }
  });
});

// Hamburger Menu Toggle
menuBtn.addEventListener('click',()=>sidebar.classList.toggle('show'));

// Show API Table
function showApiTable(filter){
  apiTableBody.innerHTML='';
  let filtered = filter==='all'?apis: filter==='active'?apis.filter(a=>a.active):apis.filter(a=>!a.active);
  if(filtered.length===0){
    const row=document.createElement('tr');
    const cell=document.createElement('td'); 
    cell.colSpan=3; cell.textContent='No APIs'; cell.style.textAlign='center';
    row.appendChild(cell); apiTableBody.appendChild(row); return;
  }
  filtered.forEach(api=>{
    const row=document.createElement('tr');
    const nameCell=document.createElement('td'); nameCell.textContent=api.name;
    const statusCell=document.createElement('td'); statusCell.textContent=api.active?'Active':'Inactive';
    const actionCell=document.createElement('td'); 
    const btn=document.createElement('button'); 
    btn.textContent='Go to API'; 
    btn.onclick=()=>window.open(api.url,'_blank'); 
    actionCell.appendChild(btn);
    row.appendChild(nameCell); row.appendChild(statusCell); row.appendChild(actionCell);
    apiTableBody.appendChild(row);
  });
}

// Filter Buttons
document.querySelectorAll('.filter-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    showApiTable(btn.dataset.filter);
  });
});

// Stats
totalApisEl.textContent=apis.length;
activeApisEl.textContent=apis.filter(a=>a.active).length;
inactiveApisEl.textContent=apis.filter(a=>!a.active).length;
totalRequestsEl.textContent=apis.reduce((sum,a)=>sum+a.requests,0);

// Initial Load
showApiTable('all');

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
window.addEventListener('resize',()=>{canvas.width=window.innerWidth;canvas.height=window.innerHeight;});
