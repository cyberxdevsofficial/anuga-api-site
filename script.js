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
    document.querySelectorAll('.tab-content').forEach(tab=>tab.classList.add('hidden'));
    document.getElementById(btn.dataset.tab+'-tab').classList.remove('hidden');
    if(window.innerWidth<=768) sidebar.classList.remove('show');
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
    const cell=document.createElement('td'); cell.colSpan=3; cell.textContent='No APIs'; cell.style.textAlign='center';
    row.appendChild(cell); apiTableBody.appendChild(row); return;
  }
  filtered.forEach(api=>{
    const row=document.createElement('tr');
    const nameCell=document.createElement('td'); nameCell.textContent=api.name;
    const statusCell=document.createElement('td'); statusCell.textContent=api.active?'Active':'Inactive';
    const actionCell=document.createElement('td'); 
    const btn=document.createElement('button'); btn.text
