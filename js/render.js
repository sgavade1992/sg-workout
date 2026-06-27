// RENDER FUNCTIONS

let chartPI=null, chartHI=null, chartMI=null, chartWI=null;
let calY=new Date().getFullYear(), calM=new Date().getMonth(), selCalDate=null;
let viewWeek=1, viewDay=0, selPlanWk=1, activePlanTab='hyrox';

// ── DASHBOARD ───────────────────────────────────────
function renderDash() {
  const activePlan=getActivePlan();
  const wk=Math.min(getWeek(), activePlan.length), pct=Math.round(wk/activePlan.length*100), plan=activePlan[wk-1];
  // Hero
  document.getElementById('d-pct').textContent=pct+'%';
  document.getElementById('d-phase').textContent=plan.phase;
  document.getElementById('d-sub').textContent=`Week ${wk} of ${activePlan.length} · ${plan.phase}`;
  document.getElementById('d-progbar').style.width=pct+'%';
  document.getElementById('d-remain').textContent=`${activePlan.length-wk} weeks remaining · ${getActiveProgramLabel()}`;
  // Update program label in hero
  const dlbl=document.getElementById('d-prog-label');
  if(dlbl)dlbl.textContent=getActiveProgramLabel();
  // Sync switcher button states
  ['hyrox','gym','wl','custom'].forEach(id=>{
    const b=document.getElementById('progBtn_'+id);
    if(b)b.classList.toggle('prog-btn-active',D.activeProgram===id);
  });
  // Stats
  const runs=D.logs.filter(l=>/run/i.test(l.type));
  const miles=D.logs.reduce((s,l)=>s+(+l.dist||0),0);
  const z2=D.logs.filter(l=>l.type==='Zone 2 Run'&&l.dist&&l.dur);
  let bz=null; z2.forEach(l=>{const p=paceMin(l.dist,l.dur);if(p&&(!bz||p<bz))bz=p;});
  const bzS=bz?`${Math.floor(bz)}:${String(Math.round((bz-Math.floor(bz))*60)).padStart(2,'0')}`:'—';
  document.getElementById('d-runs').textContent=runs.length;
  document.getElementById('d-miles').textContent=miles.toFixed(1);
  document.getElementById('d-z2').textContent=bzS+(bzS!=='—'?'/mi':'');
  document.getElementById('d-sess').textContent=D.logs.length;
  // Deltas
  const twk=D.logs.filter(l=>weekForDate(l.date)===wk);
  const lwk=D.logs.filter(l=>weekForDate(l.date)===wk-1);
  setDelta('d-runs-d',twk.filter(l=>/run/i.test(l.type)).length,lwk.filter(l=>/run/i.test(l.type)).length,'runs this week');
  document.getElementById('d-sess-d').textContent=`${twk.length} sessions this week`;
  renderCharts(); renderImprovements(); renderTodayCard(); renderWeekGlance(); renderRecentTable();
}

function setDelta(id,cur,prev,label){
  const el=document.getElementById(id);if(!el)return;
  const n=parseFloat(cur),p=parseFloat(prev);
  if(!p){el.className='stat-delta d-neutral';el.textContent=`${cur} ${label}`;return;}
  const up=n>=p;
  el.className=`stat-delta ${up?'d-up':'d-dn'}`;
  el.textContent=`${up?'▲':'▼'} ${Math.abs(n-p).toFixed(1)} vs last week`;
}

function renderCharts(){
  const gc='rgba(255,255,255,.04)',tc='rgba(255,255,255,.3)';
  const base={responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{backgroundColor:'#1a1a2e',titleColor:'#eeeef8',bodyColor:'#9090c0'}},scales:{x:{grid:{color:gc},ticks:{color:tc,font:{size:10}}},y:{grid:{color:gc},ticks:{color:tc,font:{size:10}}}}};

  // Pace
  const pd=D.logs.filter(l=>l.dist&&l.dur&&+l.dist>0).slice(-12);
  if(chartPI)chartPI.destroy();
  const ctxP=document.getElementById('chartPace')?.getContext('2d');
  if(ctxP){
    if(!pd.length){ctxP.canvas.parentElement.innerHTML='<div class="chart-empty">Log runs to see pace trend</div>';}
    else{chartPI=new Chart(ctxP,{type:'line',data:{labels:pd.map(l=>l.date?.slice(5)||''),datasets:[{data:pd.map(l=>+(+l.dur/+l.dist).toFixed(2)),borderColor:'#00c8f0',backgroundColor:'rgba(0,200,240,.08)',fill:true,tension:.4,pointRadius:3,pointBackgroundColor:'#00c8f0'}]},options:{...base,scales:{...base.scales,y:{...base.scales.y,reverse:true,ticks:{...base.scales.y.ticks,callback:v=>{const f=Math.floor(v),s=Math.round((v-f)*60);return`${f}:${String(s).padStart(2,'0')}`;}}}}}});}
  }
  // HR
  const hd=D.logs.filter(l=>l.hr&&+l.hr>0).slice(-12);
  if(chartHI)chartHI.destroy();
  const ctxH=document.getElementById('chartHR')?.getContext('2d');
  if(ctxH){
    if(!hd.length){ctxH.canvas.parentElement.innerHTML='<div class="chart-empty">Log HR to see trends</div>';}
    else{chartHI=new Chart(ctxH,{type:'line',data:{labels:hd.map(l=>l.date?.slice(5)||''),datasets:[{data:hd.map(l=>+l.hr),borderColor:'#ff3d55',backgroundColor:'rgba(255,61,85,.08)',fill:true,tension:.4,pointRadius:3,pointBackgroundColor:'#ff3d55'}]},options:base});}
  }
  // Miles
  const byW={};D.logs.filter(l=>l.dist&&+l.dist>0).forEach(l=>{const w=weekForDate(l.date);if(w)byW[w]=(byW[w]||0)+(+l.dist);});
  if(chartMI)chartMI.destroy();
  const ctxM=document.getElementById('chartMiles')?.getContext('2d');
  if(ctxM){
    const ent=Object.entries(byW).slice(-10);
    if(!ent.length){ctxM.canvas.parentElement.innerHTML='<div class="chart-empty">Log sessions to see weekly mileage</div>';}
    else{chartMI=new Chart(ctxM,{type:'bar',data:{labels:ent.map(([w])=>'Wk'+w),datasets:[{data:ent.map(([,m])=>+m.toFixed(1)),backgroundColor:'rgba(232,255,71,.5)',borderColor:'#e8ff47',borderWidth:1,borderRadius:4}]},options:base});}
  }
  // Weight
  const bw=(D.bodyWeight||[]).slice(0,20).reverse();
  if(chartWI)chartWI.destroy();
  const ctxW=document.getElementById('chartWeight')?.getContext('2d');
  if(ctxW){
    if(!bw.length){ctxW.canvas.parentElement.innerHTML='<div class="chart-empty">Log your weight to track progress</div>';}
    else{chartWI=new Chart(ctxW,{type:'line',data:{labels:bw.map(d=>d.date?.slice(5)||''),datasets:[{data:bw.map(d=>d.weight),borderColor:'#b47fff',backgroundColor:'rgba(180,127,255,.08)',fill:true,tension:.4,pointRadius:3,pointBackgroundColor:'#b47fff'}]},options:base});}
  }
}

function renderImprovements(){
  const el=document.getElementById('improveGrid');if(!el)return;
  if(D.logs.length<2){el.innerHTML='<div style="color:var(--m1);font-size:.76rem">Log 2+ sessions to track improvements here.</div>';return;}
  const metrics=[
    {name:'Z2 Pace',icon:'🏃',fil:l=>l.dist&&l.dur&&+l.dist>0,fmt:(c,p)=>{
      const cp=paceMin(c.dist,c.dur),pp=paceMin(p.dist,p.dur);if(!cp||!pp)return null;
      const f=m=>`${Math.floor(m)}:${String(Math.round((m-Math.floor(m))*60)).padStart(2,'0')}`;
      const diff=pp-cp;return{cur:f(cp)+'/mi',prev:f(pp)+'/mi',better:diff>0,diff:`${diff>0?'▼ faster':'▲ slower'} ${Math.abs(diff).toFixed(2)} min/mi`};
    }},
    {name:'Avg HR',icon:'❤️',fil:l=>l.hr&&+l.hr>0,fmt:(c,p)=>{
      const a=+c.hr,b=+p.hr,d=b-a;return{cur:a+' bpm',prev:b+' bpm',better:d>0,diff:`${d>0?'▼':'▲'} ${Math.abs(d)} bpm`};
    }},
    {name:'Cadence',icon:'🦶',fil:l=>l.cad&&+l.cad>100,fmt:(c,p)=>{
      const a=+c.cad,b=+p.cad,d=a-b;return{cur:a+' spm',prev:b+' spm',better:d>0,diff:`${d>0?'▲':'▼'} ${Math.abs(d)} spm`};
    }},
    {name:'Effort',icon:'💪',fil:l=>l.effort&&+l.effort>0,fmt:(c,p)=>{
      const a=+c.effort,b=+p.effort,d=b-a;return{cur:a+'/10',prev:b+'/10',better:d>=0,diff:d>0?`▼ ${d} easier`:d<0?`▲ ${Math.abs(d)} harder`:'Same'};
    }},
    {name:'Distance',icon:'📏',fil:l=>l.dist&&+l.dist>0,fmt:(c,p)=>{
      const a=+c.dist,b=+p.dist,d=a-b;return{cur:a.toFixed(1)+' mi',prev:b.toFixed(1)+' mi',better:d>=0,diff:`${d>=0?'▲':'▼'} ${Math.abs(d).toFixed(1)} mi`};
    }},
    {name:'Duration',icon:'⏱',fil:l=>l.dur&&+l.dur>0,fmt:(c,p)=>{
      const a=+c.dur,b=+p.dur,d=a-b;return{cur:a+' min',prev:b+' min',better:d>=0,diff:`${d>=0?'▲':'▼'} ${Math.abs(d)} min`};
    }},
  ];
  let html='',any=false;
  metrics.forEach(m=>{
    const fl=D.logs.filter(m.fil);if(fl.length<2)return;
    const r=m.fmt(fl[0],fl[1]);if(!r)return;
    any=true;
    html+=`<div class="improve-card">
      <div class="improve-icon">${m.icon}</div>
      <div style="flex:1;min-width:0">
        <div class="improve-name">${m.name}</div>
        <div class="improve-vals">${r.cur} <span style="color:var(--m1)">← ${r.prev}</span></div>
        <div><span class="improve-badge ${r.better?'ib-better':'ib-worse'}">${r.diff}</span></div>
        <div style="font-size:.6rem;color:var(--m1);margin-top:2px">${fl[0].date} vs ${fl[1].date}</div>
      </div>
    </div>`;
  });
  el.innerHTML=any?html:'<div style="color:var(--m1);font-size:.76rem">Keep logging to see improvements!</div>';
}

function renderTodayCard(){
  const activePlan=getActivePlan();
  const wk=Math.min(getWeek(),activePlan.length),plan=activePlan[wk-1],di=new Date().getDay(),day=plan.days[di];
  const col=TC[tclass(day.type)]||'#888',key=`${wk}-${di}`,done=D.wkDone[key+'_today'];
  document.getElementById('todayCard').innerHTML=`
    <div class="today-card">
      <div class="today-hdr">
        <div class="today-day">${day.d}</div>
        <div style="flex:1">
          <div style="margin-bottom:3px"><span class="badge ${bclass(day.type)}">${day.type.toUpperCase()}</span></div>
          <div class="today-title">${day.title}</div>
          <div class="today-sub">Week ${wk} · ${plan.phase}</div>
        </div>
        <div class="check-circle${done?' done':''}" onclick="togTodayDone('${key}')">${done?'✓':''}</div>
      </div>
      ${day.detail?`<div style="font-size:.73rem;color:var(--m2);margin-bottom:8px;line-height:1.5">${day.detail}</div>`:''}
      <div style="display:flex;flex-direction:column;gap:3px;margin-bottom:8px">
        ${day.exs.slice(0,5).map(e=>`<div style="font-size:.72rem;color:var(--m2);display:flex;gap:5px;align-items:center"><div style="width:4px;height:4px;border-radius:50%;background:${col};flex-shrink:0"></div>${e.name}${e.sets!=='1'?' — '+e.sets+'×'+e.reps:e.reps?' — '+e.reps:''}</div>`).join('')}
        ${day.exs.length>5?`<div style="font-size:.64rem;color:var(--m1)">+${day.exs.length-5} more exercises</div>`:''}
      </div>
      <button class="btn-open" onclick="viewWeek=${wk};viewDay=${di};nav('week')">Open Full Workout →</button>
    </div>`;
}

function togTodayDone(k){
  D.wkDone[k+'_today']=!D.wkDone[k+'_today'];saveAll();renderTodayCard();
  showToast(D.wkDone[k+'_today']?'✅ Great work today!':'Unmarked');
}

function renderWeekGlance(){
  const activePlan=getActivePlan();
  const wk=Math.min(getWeek(),activePlan.length),plan=activePlan[wk-1],di=new Date().getDay();
  document.getElementById('weekGlance').innerHTML=plan.days.map((day,i)=>{
    const col=TC[tclass(day.type)]||'#888';
    const dn=day.exs.filter((_,ei)=>D.wkDone[`w${wk}_d${i}_${ei}`]).length;
    const allDone=dn===day.exs.length&&dn>0;
    return`<div class="wg-day${i===di?' today-d':''}${allDone?' all-done':''}"
      onclick="viewWeek=${wk};viewDay=${i};nav('week')">
      <div class="wg-dn" style="color:${i===di?'var(--accent)':'var(--m1)'}">${day.d}</div>
      <div class="wg-dot" style="background:${allDone?'var(--green)':i===di?col:'var(--b2)'}"></div>
      <div style="font-size:.57rem;font-weight:700;text-transform:uppercase;color:${col}">${day.type}</div>
      <div class="wg-lbl">${day.title.split(' ').slice(0,2).join(' ')}</div>
    </div>`;
  }).join('');
}

function renderRecentTable(){
  const tbody=document.getElementById('recentBody');if(!tbody)return;
  if(!D.logs.length){tbody.innerHTML=`<tr><td colspan="8" style="text-align:center;padding:28px;color:var(--m1);font-size:.76rem">No sessions yet — tap "+ Log" to start!</td></tr>`;return;}
  tbody.innerHTML=D.logs.slice(0,7).map(l=>`<tr style="font-size:.75rem">
    <td style="padding:8px 12px;border-bottom:1px solid var(--b1)">${l.date||'—'}</td>
    <td style="padding:8px 12px;border-bottom:1px solid var(--b1)"><span class="badge ${bclass(l.type)}">${l.type}</span></td>
    <td style="padding:8px 12px;border-bottom:1px solid var(--b1)">${l.dist?l.dist+' mi':'—'}</td>
    <td style="padding:8px 12px;border-bottom:1px solid var(--b1)">${l.dur?l.dur+' min':'—'}</td>
    <td style="padding:8px 12px;border-bottom:1px solid var(--b1);color:var(--accent);font-weight:600">${paceStr(l.dist,l.dur)}</td>
    <td style="padding:8px 12px;border-bottom:1px solid var(--b1);color:var(--red)">${l.hr?l.hr+' bpm':'—'}</td>
    <td style="padding:8px 12px;border-bottom:1px solid var(--b1)">${l.cad?l.cad+' spm':'—'}</td>
    <td style="padding:8px 12px;border-bottom:1px solid var(--b1)">${l.effort?l.effort+'/10':'—'}</td>
  </tr>`).join('');
}

// ── CALENDAR ────────────────────────────────────────
function renderCal(){
  const activePlan=getActivePlan();
  document.getElementById('calTitle').textContent=`${MONTHS[calM]} ${calY}`;
  const today=new Date(),fd=new Date(calY,calM,1).getDay(),days=new Date(calY,calM+1,0).getDate();
  let h=DAYS.map(d=>`<div class="cal-hdr-cell">${d}</div>`).join('');
  for(let i=0;i<fd;i++)h+='<div class="cal-cell empty"></div>';
  for(let d=1;d<=days;d++){
    const date=new Date(calY,calM,d),w=weekForDate(date.toISOString().split('T')[0]);
    const isT=today.getDate()===d&&today.getMonth()===calM&&today.getFullYear()===calY;
    const isSel=selCalDate?.getDate()===d&&selCalDate?.getMonth()===calM&&selCalDate?.getFullYear()===calY;
    if(!w||w>activePlan.length){h+=`<div class="cal-cell${isT?' today-c':''} no-plan"><div class="cal-num">${d}</div></div>`;continue;}
    const plan=activePlan[w-1],di=date.getDay(),day=plan.days[di];
    const col=TC[tclass(day.type)]||'#888';
    const dn=day.exs.filter((_,ei)=>D.wkDone[`w${w}_d${di}_${ei}`]).length;
    const allDone=dn===day.exs.length&&dn>0;
    h+=`<div class="cal-cell${isT?' today-c':''}${isSel?' selected-c':''}" onclick="calClick(${calY},${calM},${d})">
      ${allDone?'<div class="cal-done-dot"></div>':''}
      <div class="cal-num">${d}</div>
      <div class="cal-dtype" style="color:${col}">${day.type}</div>
      <div class="cal-dlbl">${day.title}</div>
      <div class="cal-wk">W${w}</div>
    </div>`;
  }
  const rem=(7-(fd+days)%7)%7;for(let i=0;i<rem;i++)h+='<div class="cal-cell empty"></div>';
  document.getElementById('calGrid').innerHTML=h;
  if(selCalDate)renderDayPanel();
}

function calClick(y,m,d){
  selCalDate=new Date(y,m,d);renderCal();renderDayPanel();
  setTimeout(()=>document.getElementById('dayPanelWrap')?.scrollIntoView({behavior:'smooth',block:'start'}),80);
}

function renderDayPanel(){
  const activePlan=getActivePlan();
  const el=document.getElementById('dayPanelWrap');if(!selCalDate){el.innerHTML='';return;}
  const ds=selCalDate.toISOString().split('T')[0],w=weekForDate(ds);
  if(!w||w>activePlan.length){el.innerHTML='';return;}
  const plan=activePlan[w-1],di=selCalDate.getDay(),day=plan.days[di];
  el.innerHTML=`<div class="day-panel-wrap"><div class="dp-hdr"><div>
    <div style="font-weight:700;font-size:.94rem;margin-bottom:3px">
      <span class="badge ${bclass(day.type)}" style="margin-right:7px">${day.type.toUpperCase()}</span>
      ${selCalDate.toLocaleDateString('en-US',{weekday:'long',month:'short',day:'numeric'})} — ${day.title}
    </div>
    <div style="font-size:.7rem;color:var(--m2)">Week ${w} · ${plan.phase}</div>
  </div>
  <button class="dp-close-btn" onclick="selCalDate=null;document.getElementById('dayPanelWrap').innerHTML='';renderCal()">Close ✕</button>
  </div><div id="dpBody"></div></div>`;
  renderExList(day.exs, `w${w}_d${di}`, document.getElementById('dpBody'));
}

// ── WEEK VIEW ────────────────────────────────────────
function renderWeek(){
  const activePlan=getActivePlan();
  viewWeek=Math.min(viewWeek||getWeek(), activePlan.length); viewDay=viewDay??new Date().getDay();
  const cw=Math.min(getWeek(),activePlan.length),plan=activePlan[viewWeek-1];
  document.getElementById('wkTitle').innerHTML=`Week ${viewWeek} — ${plan.phase}${viewWeek===cw?'<span class="cur-wk-badge">current</span>':''}`;
  document.getElementById('wkPrev').disabled=viewWeek<=1;
  document.getElementById('wkNext').disabled=viewWeek>=activePlan.length;
  // Day tabs
  document.getElementById('dayTabsRow').innerHTML=plan.days.map((day,i)=>{
    const col=TC[tclass(day.type)]||'#888';
    const dn=day.exs.filter((_,ei)=>D.wkDone[`w${viewWeek}_d${i}_${ei}`]).length;
    const allDone=dn===day.exs.length&&dn>0;
    const isT=viewWeek===cw&&i===new Date().getDay();
    return`<button class="day-tab-btn${i===viewDay?' active':''}" onclick="viewDay=${i};renderWeek()">
      <span style="font-size:.62rem;color:${i===viewDay?col:'var(--m1)'}">${day.d}</span>
      <div class="day-tab-dot" style="background:${allDone?'var(--green)':i===viewDay?col:'var(--b2)'}${isT?';box-shadow:0 0 0 2px rgba(232,255,71,.3)':''}"></div>
      <span class="day-tab-lbl">${day.title.split(' ').slice(0,2).join(' ')}</span>
    </button>`;
  }).join('');
  // Day content
  const day=plan.days[viewDay],col=TC[tclass(day.type)]||'#888';
  const c=document.getElementById('wkDayContent');
  c.innerHTML=`<div style="margin-bottom:10px">
    <span class="badge ${bclass(day.type)}" style="margin-right:8px">${day.type.toUpperCase()}</span>
    <span style="font-weight:700;font-size:.92rem">${day.title}</span>
    ${day.detail?`<div style="font-size:.73rem;color:var(--m2);margin-top:5px;line-height:1.55">${day.detail}</div>`:''}
  </div><div id="wkExCont"></div>`;
  renderExList(day.exs, `w${viewWeek}_d${viewDay}`, document.getElementById('wkExCont'));
}

// ── PROGRAM ──────────────────────────────────────────
function renderProgram(){
  selPlanWk=selPlanWk||getWeek();
  renderWkSelGrid();
  renderPlanWkDetail(selPlanWk);
}

function switchPlanTab(id,btn){
  activePlanTab=id;
  document.querySelectorAll('.plan-tab-btn').forEach(b=>b.classList.remove('active'));
  if(btn)btn.classList.add('active');
  ['hyrox','gym','wl','stations','benchmarks','builder'].forEach(t=>{
    const el=document.getElementById('pt-'+t);if(el)el.style.display=t===id?'':'none';
  });
  if(id==='hyrox'){renderWkSelGrid();renderPlanWkDetail(selPlanWk);}
  if(id==='gym')renderGym();
  if(id==='wl')renderWL();
  if(id==='stations')renderStationsTab();
  if(id==='benchmarks')renderBenches();
  if(id==='builder')renderBuilder();
}

function renderWkSelGrid(){
  const activePlan=getActivePlan(), cw=Math.min(getWeek(),activePlan.length);
  document.getElementById('wkSelGrid').innerHTML=activePlan.map(p=>`
    <button class="wk-sel-btn${p.w===selPlanWk?' active-wk':''}" onclick="selPlanWk=${p.w};renderPlanWkDetail(${p.w});document.querySelectorAll('.wk-sel-btn').forEach((b,i)=>{b.className='wk-sel-btn'+(i+1===${p.w}?' active-wk':'');})">
      W${p.w}${p.w===cw?' ◉':''}
    </button>`).join('');
}

function renderPlanWkDetail(w){
  const activePlan=getActivePlan();
  selPlanWk=w;
  const plan=activePlan[w-1];if(!plan)return;
  const cw=Math.min(getWeek(),activePlan.length),di=new Date().getDay();
  document.getElementById('planWkTitle').textContent=`Week ${w} — ${plan.phase}`;
  document.getElementById('planWkBody').innerHTML=plan.days.map((day,i)=>{
    const col=TC[tclass(day.type)]||'#888',isT=w===cw&&i===di;
    const dn=day.exs.filter((_,ei)=>D.wkDone[`w${w}_d${i}_${ei}`]).length;
    return`<div style="display:flex;align-items:flex-start;gap:9px;padding:9px 0;border-bottom:1px solid var(--b1)">
      <div style="font-size:.6rem;font-weight:700;text-transform:uppercase;color:${isT?'var(--accent)':'var(--m1)'};min-width:24px;padding-top:1px;flex-shrink:0">${day.d}</div>
      <div style="flex:1;min-width:0">
        <div style="margin-bottom:3px"><span class="badge ${bclass(day.type)}" style="margin-right:5px">${day.type}</span><span style="font-weight:700;font-size:.82rem">${day.title}</span></div>
        ${day.detail?`<div style="font-size:.69rem;color:var(--m2);margin-bottom:3px;line-height:1.5">${day.detail}</div>`:''}
        <div style="display:flex;flex-direction:column;gap:1px">${day.exs.map(e=>`<div style="font-size:.67rem;color:var(--m2)">▸ ${e.name}${e.sets!=='1'?' '+e.sets+'×':''} ${e.reps||''}${e.load&&e.load!=='—'?' ('+e.load+')':''}</div>`).join('')}</div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:3px;flex-shrink:0">
        <button onclick="viewWeek=${w};viewDay=${i};nav('week')" style="font-size:.6rem;color:var(--accent);cursor:pointer;background:none;border:none;white-space:nowrap">Open →</button>
        ${dn>0?`<span style="font-size:.58rem;color:var(--green)">${dn}/${day.exs.length}✓</span>`:''}
      </div>
    </div>`;
  }).join('');
}

function renderGym(){
  const el=document.getElementById('pt-gym');if(!el)return;
  let h='';
  GYM_PHASES.forEach(ph=>{
    h+=`<div class="card" style="border-left:2px solid ${ph.col};margin-bottom:14px">
      <div class="ctitle" style="color:${ph.col}">Phase ${ph.num} (Weeks ${ph.weeks}) — ${ph.name}</div>
      <p style="font-size:.77rem;color:var(--m2);margin-bottom:12px;line-height:1.65">${ph.desc}</p>`;
    ph.sessions.forEach(sess=>{
      h+=`<div style="margin-bottom:12px"><div style="font-weight:700;font-size:.83rem;margin-bottom:6px;padding-bottom:4px;border-bottom:1px solid var(--b1)">${sess.name}</div>`;
      sess.exs.forEach(e=>{
        h+=`<div style="display:flex;gap:8px;padding:5px 0;border-bottom:1px solid var(--b1);font-size:.74rem;flex-wrap:wrap">
          <span style="color:var(--m2);min-width:155px;flex-shrink:0">${e.name}</span>
          <span style="color:var(--accent);font-weight:600;min-width:80px">${e.sets}×${e.reps}</span>
          <span style="color:var(--m1)">${e.load}</span>
          ${e.cues?`<span style="color:var(--m1);font-style:italic;font-size:.68rem">${e.cues}</span>`:''}
        </div>`;
      });
      h+='</div>';
    });
    h+=`<div style="margin-top:8px"><div style="font-size:.62rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--m1);margin-bottom:6px">Phase ${ph.num} Benchmarks</div>
      ${ph.benchmarks.map((b,i)=>{const k=`gym_b${ph.num}_${i}`,done=D.benchDone[k];return`<div class="b-item${done?' achieved':''}" onclick="togBench('${k}')"><div class="b-chk">${done?'✓':''}</div><div><div class="b-name">${b}</div></div></div>`;}).join('')}
    </div></div>`;
  });
  el.innerHTML=h;
}

function renderWL(){
  const el=document.getElementById('pt-wl');if(!el)return;
  let h=`<div class="card card-accent" style="margin-bottom:14px">
    <div class="ctitle">🔥 Weight Loss Program Goal</div>
    <p style="font-size:.78rem;color:var(--m2);line-height:1.65">Burn fat, preserve muscle, build sustainable habits. 12 weeks, progressive intensity. Combine with 300–500 cal/day deficit for optimal results.</p>
  </div>`;
  WL_PHASES.forEach(ph=>{
    h+=`<div class="card" style="border-left:2px solid ${ph.col};margin-bottom:14px">
      <div class="ctitle" style="color:${ph.col}">Phase ${ph.num} (Weeks ${ph.weeks}) — ${ph.name}</div>
      <p style="font-size:.77rem;color:var(--m2);margin-bottom:12px;line-height:1.65">${ph.desc}</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:8px">`;
    ph.weekly.forEach(day=>{
      const col=TC[tclass(day.type)]||'#888';
      h+=`<div style="background:var(--panel);border:1px solid var(--b1);border-radius:var(--rsm);padding:12px">
        <div style="display:flex;align-items:center;gap:7px;margin-bottom:7px">
          <span class="badge ${bclass(day.type)}">${day.type.toUpperCase()}</span>
          <span style="font-weight:700;font-size:.78rem;color:${col}">${day.d}</span>
        </div>
        <div style="font-size:.77rem;font-weight:600;margin-bottom:4px">${day.title}</div>
        ${day.exs.slice(0,4).map(e=>`<div style="font-size:.67rem;color:var(--m2);padding:2px 0">▸ ${e.n} ${e.s!=='1'?e.s+'×'+e.r:e.r}</div>`).join('')}
        ${day.exs.length>4?`<div style="font-size:.63rem;color:var(--m1)">+${day.exs.length-4} more</div>`:''}
      </div>`;
    });
    h+='</div></div>';
  });
  // Tips
  h+=`<div class="card"><div class="ctitle">💡 Nutrition & Lifestyle Tips</div>
    ${WL_TIPS.map(t=>`<div style="display:flex;gap:8px;padding:6px 0;border-bottom:1px solid var(--b1);font-size:.74rem;color:var(--m2)"><span style="color:var(--accent);flex-shrink:0">▸</span>${t}</div>`).join('')}
  </div>`;
  // Benchmarks
  const wlBenches=['4 weeks consistent training (habit formed)','Lose 1–2 lb/week consistently','Zone 2 run 30 min without stopping','10 push-ups unbroken','Waist measurement decreased 1+ inch','Run 5K under 40 min'];
  h+=`<div class="card"><div class="ctitle">🏆 Weight Loss Checkpoints</div>
    <div class="bench-grid">${wlBenches.map((b,i)=>{const k=`wl_b${i}`,done=D.benchDone[k];return`<div class="b-item${done?' achieved':''}" onclick="togBench('${k}');renderWL()"><div class="b-chk">${done?'✓':''}</div><div><div class="b-name">${b}</div></div></div>`;}).join('')}</div>
  </div>`;
  el.innerHTML=h;
}

function renderStationsTab(){
  const el=document.getElementById('pt-stations');if(!el)return;
  let h=`<div style="background:linear-gradient(135deg,var(--panel),#0a0a1a);border:1px solid var(--b2);border-radius:var(--r);padding:18px;margin-bottom:16px">
    <div style="display:flex;flex-wrap:wrap;gap:8px 24px;margin-bottom:10px">
      <div><span style="font-family:var(--ffd);font-size:1.6rem;font-weight:900;color:var(--accent)">8 × 1km</span> <span style="font-size:.78rem;color:var(--m2)">runs + 8 stations = full race</span></div>
      <div style="font-size:.76rem;color:var(--m2)">Running total <strong style="color:var(--text)">8km</strong></div>
      <div style="font-size:.76rem;color:var(--m2)">Avg Open finish <strong style="color:var(--orange)">~90 min</strong></div>
      <div style="font-size:.76rem;color:var(--m2)">Your target <strong style="color:var(--accent)">Sub-1:45</strong></div>
    </div>
    <div style="background:rgba(232,255,71,.05);border:1px solid rgba(232,255,71,.15);border-radius:var(--rsm);padding:10px;font-size:.74rem;line-height:1.6">
      <strong>Race order is fixed:</strong> SkiErg → Sled Push → Sled Pull → Burpee Broad Jumps → Row → Farmer's Carry → Sandbag Lunges → Wall Balls
    </div>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:12px;margin-bottom:16px">`;
  STATIONS.forEach(s=>{
    h+=`<div style="background:var(--panel);border:1px solid var(--b1);border-radius:var(--r);padding:15px;display:flex;flex-direction:column;gap:7px">
      <div style="display:flex;align-items:center;gap:7px">
        <div style="font-family:var(--ffd);font-size:1.5rem;font-weight:900;color:${s.col};opacity:.3">${String(s.num).padStart(2,'0')}</div>
        <div style="font-size:1.2rem">${s.emoji}</div>
      </div>
      <div style="font-weight:700;font-size:.9rem">${s.name}</div>
      <div style="font-size:.68rem;font-weight:700;color:${s.col}">${s.spec}</div>
      <div style="font-size:.68rem;color:var(--m2)">${s.weight} · ${s.muscles}</div>
      <div style="background:rgba(232,255,71,.04);border:1px solid rgba(232,255,71,.12);border-radius:5px;padding:7px 9px;font-size:.68rem;line-height:1.55">${s.tip}</div>
      <div><div style="font-size:.6rem;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:var(--m1);margin-bottom:4px">Training Exercises</div>
        ${s.training.map(t=>`<div style="display:flex;gap:8px;padding:4px 0;border-bottom:1px solid var(--b1);font-size:.68rem"><span style="color:${s.col};font-weight:600;min-width:145px;flex-shrink:0">${t.e}</span><span style="color:var(--m2)">${t.d}</span></div>`).join('')}
      </div>
    </div>`;
  });
  h+='</div>';
  el.innerHTML=h;
}

function renderBenches(){
  [4,8,12].forEach(wk=>{
    const el=document.getElementById('bench'+wk);if(!el)return;
    el.innerHTML=BENCHMARKS[wk].map((b,i)=>{
      const k=`h${wk}_${i}`,done=D.benchDone[k];
      return`<div class="b-item${done?' achieved':''}" onclick="togBench('${k}')">
        <div class="b-chk">${done?'✓':''}</div>
        <div><div class="b-name">${b.n}</div><div class="b-tgt">${b.t}</div><div class="b-wk">WK${wk}</div></div>
      </div>`;
    }).join('');
  });
}
function togBench(k){D.benchDone[k]=!D.benchDone[k];saveAll();renderBenches();showToast(D.benchDone[k]?'🏆 Benchmark achieved!':'Unmarked');}

// ── LOG ─────────────────────────────────────────────
function renderLog(){
  const runs=D.logs.filter(l=>/run/i.test(l.type));
  const miles=D.logs.reduce((s,l)=>s+(+l.dist||0),0);
  const avgHR=D.logs.filter(l=>l.hr&&+l.hr>0);
  const mHR=avgHR.length?Math.round(avgHR.reduce((s,l)=>s+(+l.hr),0)/avgHR.length):0;
  document.getElementById('logStats').innerHTML=[
    [D.logs.length,'Total Sessions','var(--accent)'],
    [runs.length,'Runs','var(--blue)'],
    [miles.toFixed(1),'Total Miles','var(--green)'],
    [mHR||'—','Avg HR (bpm)','var(--red)'],
  ].map(([v,l,c])=>`<div class="card" style="text-align:center;padding:14px 10px">
    <div style="font-family:var(--ffd);font-size:1.8rem;font-weight:800;color:${c}">${v}</div>
    <div style="font-size:.6rem;text-transform:uppercase;letter-spacing:1px;color:var(--m1);margin-top:4px">${l}</div>
  </div>`).join('');
  document.getElementById('logList').innerHTML=D.logs.length
    ?D.logs.slice(0,30).map(l=>`<div class="log-item">
        <div class="log-lh"><div><span class="badge ${bclass(l.type)}">${l.type}</span><span style="font-size:.67rem;color:var(--m1);margin-left:7px">${l.date||''}</span></div>
        <button class="btn-del" onclick="delLog(${l.id})">✕</button></div>
        <div class="log-metrics">
          ${l.dist?`<span>Dist <strong>${l.dist} mi</strong></span>`:''}
          ${l.dur?`<span>Time <strong>${l.dur} min</strong></span>`:''}
          ${l.dist&&l.dur?`<span>Pace <strong>${paceStr(l.dist,l.dur)}/mi</strong></span>`:''}
          ${l.hr?`<span>HR <strong style="color:var(--red)">${l.hr} bpm</strong></span>`:''}
          ${l.cad?`<span>Cad <strong>${l.cad} spm</strong></span>`:''}
          ${l.effort?`<span>Effort <strong>${l.effort}/10</strong></span>`:''}
          ${l.weight?`<span>Wt <strong>${l.weight} lb</strong></span>`:''}
        </div>
        ${l.notes?`<div style="font-size:.7rem;color:var(--m1);margin-top:4px;font-style:italic">${l.notes}</div>`:''}
      </div>`).join('')
    :'<div style="text-align:center;padding:30px;color:var(--m1)">No sessions yet. Start logging!</div>';
}
