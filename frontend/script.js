async function apiGet(url){return(await fetch(url,{credentials:'include'})).json();}
async function apiPost(url,body){return(await fetch(url,{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify(body||{})})).json();}

const sidebar=document.getElementById('sidebar');
const menuBtn=document.getElementById('menu-btn');
const userArea=document.getElementById('user-area');
menuBtn.addEventListener('click',()=>sidebar.classList.toggle('show'));

document.querySelectorAll('.tab-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const tabId=btn.dataset.tab+'-tab';
    document.querySelectorAll('.tab-content').forEach(t=>t.classList.toggle('hidden',t.id!==tabId));
    if(window.innerWidth<=768) sidebar.classList.remove('show');
  });
});

async function loadUserAndData(){
  const userRes=await apiGet('/api/user');
  if(!userRes.loggedIn){
    userArea.innerHTML=`<a href="/auth/github" style="color:#0f0">Login with GitHub</a>`;
    return;
  }
  const user=userRes.user;
  userArea.innerHTML=`${user.displayName||user.username} <a href="/auth/logout" style="color:#0f0;margin-left:8px">Logout</a>`;
  await loadApis('all');
  await loadKeys();
}

async function loadApis(filter){
  const data=await apiGet('/api/my-apis');
  const apis=Array.isArray(data)?data:[];
  const tbody=document.getElementById('api-table-body');
  tbody.innerHTML='';
  const filtered=filter==='all'?apis:filter==='active'?apis.filter(a=>a.active):apis.filter(a=>!a.active);
  if(filtered.length===0){tbody.innerHTML=`<tr><td colspan="4" style="text-align:center">No APIs</td></tr>`;}
  else{
    for(const api of filtered){
      const tr=document.createElement('tr');
      tr.innerHTML=`<td>${escapeHtml(api.name)}</td><td>${api.active?'Active':'Inactive'}</td><td>${api.requests||0}</td><td><button data-url="${escapeHtml(api.url)}">Go</button></td>`;
      tbody.appendChild(tr);
    }
    tbody.querySelectorAll('button').forEach(b=>b.addEventListener('click',e=>window.open(e.currentTarget.dataset.url,'_blank')));
  }
  document.getElementById('total-apis').textContent=apis.length;
  document.getElementById('active-apis').textContent=apis.filter(a=>a.active).length;
  document.getElementById('inactive-apis').textContent=apis.filter(a=>!a.active).length;
  document.getElementById('total-requests').textContent=apis.reduce((s,a)=>s+(a.requests||0),0);
}

async function loadKeys(){
  const data=await apiGet('/api/my-keys');
  const keys=Array.isArray(data)?data:[];
  const tbody=document.getElementById('apikey-table-body'); tbody.innerHTML='';
  for(const k of keys){
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${escapeHtml(k.key)}</td><td>${escapeHtml(k.name||'')}</td><td><button data-key="${escapeHtml(k.key)}">Revoke</button></td>`;
    tbody.appendChild(tr);
  }
  tbody.querySelectorAll('button').forEach(b=>b.addEventListener('click',async e=>{const key=e.currentTarget.dataset.key; await apiPost('/api/revoke-key',{key}); await loadKeys();}));
}

document.getElementById('generate-apikey').addEventListener('click',async()=>{
  const name=document.getElementById('apikey-name').value||'API_KEY';
  await apiPost('/api/generate-key',{name});
  document.getElementById('apikey-name').value='';
  await loadKeys();
});

document.getElementById('add-api').addEventListener('click',async()=>{
  const name=document.getElementById('api-name').value;
  const url=document.getElementById('api-url').value;
  const active=document.getElementById('api-status').value==='true';
  if(!name||!url)return alert('Name and URL required');
  await apiPost('/api/add-api',{name,url,active});
  document.getElementById('api-name').value=''; document.getElementById('api-url').value='';
  await loadApis('all');
});

document.querySelectorAll('.filter-btn').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  loadApis(btn.dataset.filter);
}));

function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

(function matrix(){
  const canvas=document.getElementById('matrix-bg');const ctx=canvas.getContext('2d');
  function setup(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;}
  setup(); window.addEventListener('resize',setup);
  const letters='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*'; const fontSize=14;
  let columns=Math.floor(canvas.width/fontSize); let drops=new Array(columns).fill(1);
  function draw(){ctx.fillStyle='rgba(0,0,0,0.06)';ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle='#0f0';ctx.font=fontSize+'px monospace';
    drops.forEach((y,i)=>{const text=letters[Math.floor(Math.random()*letters.length)];ctx.fillText(text,i*fontSize,y*fontSize); if(y*fontSize>canvas.height&&Math.random()>0.975)drops[i]=0; drops[i]++;});}
  setInterval(draw,50);
})();

loadUserAndData();
