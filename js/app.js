// SG Workout — App State & Core Logic (Supabase backend)

let D = {
  logs:[], wkDone:{}, exNotes:{}, benchDone:{}, bodyWeight:[],
  programStart:null, activeProgram:'hyrox', settings:{},
};

// ── PLAN HELPERS ──────────────────────────────────────
function getActivePlan() {
  switch (D.activeProgram) {
    case 'gym':    return GYM_PLAN_FLAT;
    case 'wl':     return WL_PLAN_FLAT;
    case 'custom': return (D.customPlan?.weeks) || HP;
    default:       return HP;
  }
}
function getActiveProgramLabel() {
  return { hyrox:'HYROX 12-Week', gym:'Beginner Gym', wl:'Weight Loss', custom: D.customPlan?.name||'My Custom Plan' }[D.activeProgram] || 'HYROX 12-Week';
}

// ── PROGRAM SWITCHER ──────────────────────────────────
async function setActiveProgram(id) {
  if (id === 'custom' && !D.customPlan) {
    showToast('Build a custom plan first in Program → 🔨 Custom Builder', '#ff9a35');
    return;
  }
  D.activeProgram = id;
  await saveAll();
  ['hyrox','gym','wl','custom'].forEach(pid => {
    document.querySelectorAll('#progBtn_'+pid).forEach(b => b.classList.toggle('prog-btn-active', pid===id));
  });
  const active = document.querySelector('.screen.active')?.id?.replace('screen-','');
  ({dash:renderDash,calendar:renderCal,week:renderWeek,program:renderProgram})[active]?.();
  showToast(`✅ Switched to ${getActiveProgramLabel()}`);
}

// ── INIT ──────────────────────────────────────────────
async function initApp() {
  document.getElementById('loadingOverlay').style.display = 'flex';
  // Sync.load() checks auth first, redirects to index.html if not signed in
  const remote = await Sync.load();
  if (!remote) return; // redirected to login
  if (Object.keys(remote).length) D = { ...D, ...remote };
  if (!D.programStart) {
    D.programStart = new Date().toISOString().split('T')[0];
    await saveAll();
  }
  document.getElementById('loadingOverlay').style.display = 'none';
  // Update user info in header
  if (window.CURRENT_USER) {
    const name = CURRENT_USER.user_metadata?.full_name || CURRENT_USER.email?.split('@')[0] || 'Athlete';
    const el = document.getElementById('userInfo');
    if (el) el.innerHTML = `<span style="font-size:.72rem;color:var(--m2)">👋 ${name}</span>`;
  }
  viewWeek = getWeek(); viewDay = new Date().getDay();
  renderDash();
}

// ── SAVE — per-user localStorage key ─────────────────
async function saveAll() {
  const uid = window.CURRENT_USER?.id || 'anon';
  localStorage.setItem('hx_d_' + uid, JSON.stringify(D));
  await Sync.save(D);
}

// ── TIME UTILS ────────────────────────────────────────
function getWeek() {
  if (!D.programStart) return 1;
  const d = Math.floor((Date.now() - new Date(D.programStart)) / (7*24*60*60*1000));
  return Math.min(Math.max(d + 1, 1), 12);
}
function weekForDate(ds) {
  if (!D.programStart || !ds) return null;
  const w = Math.floor((new Date(ds) - new Date(D.programStart)) / (7*24*60*60*1000)) + 1;
  return (w >= 1 && w <= 12) ? w : null;
}
function paceStr(dist, dur) {
  if (!dist || !dur || +dist === 0) return '—';
  const m = +dur/+dist, f = Math.floor(m), s = Math.round((m-f)*60);
  return `${f}:${String(s).padStart(2,'0')}`;
}
function paceMin(dist, dur) { return (!dist||!dur||+dist===0) ? null : +dur/+dist; }
function fmtSec(s) { return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`; }

function showToast(msg, col) {
  const el = document.getElementById('toast');
  el.textContent = msg; el.style.background = col||'var(--accent)';
  el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 2400);
}

// ── NAV ───────────────────────────────────────────────
function nav(id, btn) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.npill').forEach(b => b.classList.remove('active'));
  document.getElementById('screen-'+id)?.classList.add('active');
  btn ? btn.classList.add('active') : document.querySelector(`[data-nav="${id}"]`)?.classList.add('active');
  ({dash:renderDash,calendar:renderCal,week:renderWeek,program:renderProgram,log:renderLog,settings:renderSettings})[id]?.();
}

// ── MODAL ─────────────────────────────────────────────
function openModal() {
  document.getElementById('mfDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('modalBg').classList.add('open');
}
function closeModal() { document.getElementById('modalBg').classList.remove('open'); }

// ── TIMERS ────────────────────────────────────────────
const TM = {};
function startTimer(id, sec) {
  if (TM[id]?.running) return;
  if (!TM[id]) TM[id] = {rem:sec, running:false};
  if (TM[id].rem <= 0) TM[id].rem = sec;
  TM[id].running = true;
  TM[id].iv = setInterval(() => {
    TM[id].rem--;
    renderTimerUI(id, sec);
    if (TM[id].rem <= 0) { clearInterval(TM[id].iv); TM[id].running = false; }
  }, 1000);
  renderTimerUI(id, sec);
}
function pauseTimer(id, sec) { clearInterval(TM[id]?.iv); if (TM[id]) TM[id].running = false; renderTimerUI(id, sec); }
function resetTimer(id, sec) { clearInterval(TM[id]?.iv); TM[id] = {rem:sec, running:false}; renderTimerUI(id, sec); }

function renderTimerUI(id, total) {
  const el = document.getElementById('tmr_'+id); if (!el) return;
  const s = TM[id] || {rem:total, running:false};
  const r = s.rem, pct = Math.min((1-r/total)*100, 100);
  const circ = 2*Math.PI*14;
  const col = r/total>.5?'#3df59e':r/total>.2?'#ff9a35':'#ff3d55';
  const done = r<=0, run = s.running;
  el.innerHTML = `
    <div class="timer-ring">
      <svg class="timer-svg" width="32" height="32" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="14" fill="none" stroke="#1a1a2e" stroke-width="3"/>
        <circle cx="16" cy="16" r="14" fill="none" stroke="${col}" stroke-width="3"
          stroke-dasharray="${circ.toFixed(2)}" stroke-dashoffset="${(circ*(1-pct/100)).toFixed(2)}"
          stroke-linecap="round"/>
      </svg>
      <div class="timer-center" style="color:${col}">${fmtSec(r)}</div>
    </div>
    <span class="timer-lbl">${done?'Done ✓':run?'Running…':r<total?'Paused':'Ready'}</span>
    ${done
      ? `<button class="tbtn tbtn-reset" onclick="resetTimer('${id}',${total})">↺</button>`
      : run
        ? `<button class="tbtn tbtn-pause" onclick="pauseTimer('${id}',${total})">⏸</button>`
        : `<button class="tbtn tbtn-start" onclick="startTimer('${id}',${total})">▶ Go</button>`
    }
    ${!run&&r<total&&r>0?`<button class="tbtn tbtn-reset" onclick="resetTimer('${id}',${total})" style="margin-left:3px">↺</button>`:''}`;
}

// ── EXERCISE CARD ─────────────────────────────────────
function exCardHTML(ex, pfx, idx) {
  const k = `${pfx}_${idx}`, done = !!D.wkDone[k], note = D.exNotes['n_'+k]||'';
  const tid = `t_${k}`;
  const ytLink = (typeof getYTLink === 'function') ? getYTLink(ex.name) : null;
  return `<div class="ex-card${done?' done':''}" id="ec_${k}">
    <div class="ex-card-row">
      <div class="ex-chk" onclick="togEx('${k}')">${done?'✓':''}</div>
      <div class="ex-body">
        <div class="ex-name-row">
          <span class="ex-name">${ex.name}${ex.isCardio?'<span class="cardio-pill">cardio</span>':''}</span>
          ${ytLink?`<a href="${ytLink}" target="_blank" rel="noopener" class="yt-btn" title="Watch demo on YouTube">▶ Demo</a>`:''}
        </div>
        <div class="ex-meta">
          ${ex.sets&&ex.sets!=='1'?`<span><strong>${ex.sets}</strong> sets</span>`:''}
          ${ex.reps?`<span><strong>${ex.reps}</strong></span>`:''}
          ${ex.load&&ex.load!=='—'?`<span>Load: <strong>${ex.load}</strong></span>`:''}
          ${ex.rest>0?`<span>rest <strong>${ex.rest}s</strong></span>`:''}
        </div>
        ${ex.cues?`<div class="ex-cues">${ex.cues}</div>`:''}
        ${ex.timer&&ex.timer>0?`<div class="timer-row" id="tmr_${tid}"></div>`:''}
        <textarea class="ex-note" rows="1" placeholder="Notes / weight / time…"
          onchange="D.exNotes['n_${k}']=this.value;saveAll()"
          oninput="this.style.height='auto';this.style.height=this.scrollHeight+'px'"
          style="overflow:hidden">${note}</textarea>
      </div>
    </div>
  </div>`;
}

function togEx(k) {
  D.wkDone[k] = !D.wkDone[k]; saveAll();
  const c = document.getElementById('ec_'+k); if (!c) return;
  const chk = c.querySelector('.ex-chk'), nm = c.querySelector('.ex-name');
  c.classList.toggle('done', D.wkDone[k]);
  chk.textContent = D.wkDone[k] ? '✓' : '';
  nm.style.textDecoration = D.wkDone[k] ? 'line-through' : '';
  nm.style.color = D.wkDone[k] ? 'var(--m1)' : '';
  updDayProg();
}

function updDayProg() {
  const pb = document.getElementById('dpb'), pt = document.getElementById('dpt'); if (!pb) return;
  const all = document.querySelectorAll('.ex-card'), done = document.querySelectorAll('.ex-card.done');
  const pct = all.length ? Math.round(done.length/all.length*100) : 0;
  pb.style.width = pct+'%'; if (pt) pt.textContent = `${done.length}/${all.length} complete`;
}

function renderExList(exs, pfx, container) {
  const dn = exs.filter((_,i) => D.wkDone[`${pfx}_${i}`]).length;
  const pct = exs.length ? Math.round(dn/exs.length*100) : 0;
  let h = `<div class="prog-row">
    <span id="dpt" style="min-width:88px;flex-shrink:0">${dn}/${exs.length} complete</span>
    <div class="prog-bar-thin"><div class="prog-fill-thin" id="dpb" style="width:${pct}%"></div></div>
    <span style="font-size:.68rem;color:var(--m2)">${pct}%</span>
  </div>`;
  exs.forEach((e,i) => h += exCardHTML(e, pfx, i));
  container.innerHTML = h;
  exs.forEach((e,i) => {
    if (e.timer && e.timer > 0) {
      const tid = `t_t_${pfx}_${i}`;
      if (!TM[tid]) TM[tid] = {rem:e.timer, running:false};
      renderTimerUI(tid, e.timer);
    }
  });
}

// ── LOG ───────────────────────────────────────────────
function saveLog() {
  const g = id => document.getElementById(id)?.value||'';
  const entry = {
    id:Date.now(), type:g('mfType')||g('fType'), date:g('mfDate')||g('fDate'),
    dist:g('mfDist')||g('fDist'), dur:g('mfDur')||g('fDur'),
    hr:g('mfHR')||g('fHR'), cad:g('mfCad')||g('fCad'),
    effort:g('mfEffort')||g('fEffort'), weight:g('mfWeight')||g('fWeight'),
    notes:g('mfNotes')||g('fNotes'),
  };
  if (!entry.dist && !entry.dur && !entry.hr) { showToast('Add at least one metric','#ff3d55'); return; }
  D.logs.unshift(entry);
  if (entry.weight && +entry.weight > 0) {
    D.bodyWeight = (D.bodyWeight||[]);
    D.bodyWeight.unshift({date:entry.date, weight:+entry.weight});
    D.bodyWeight = D.bodyWeight.slice(0, 90);
  }
  saveAll();
  ['mfDist','mfDur','mfHR','mfCad','mfEffort','mfWeight','mfNotes','fDist','fDur','fHR','fCad','fEffort','fWeight','fNotes'].forEach(id=>{const e=document.getElementById(id);if(e)e.value='';});
  closeModal();
  showToast('✅ Session saved!');
  if (document.getElementById('screen-dash')?.classList.contains('active')) renderDash();
  if (document.getElementById('screen-log')?.classList.contains('active')) renderLog();
}

function delLog(id) {
  if (!confirm('Delete?')) return;
  D.logs = D.logs.filter(l => l.id !== id); saveAll(); renderLog(); showToast('Deleted');
}

function exportCSV() {
  if (!D.logs.length) { showToast('No sessions','#ff3d55'); return; }
  const rows = D.logs.map(l=>[l.date,l.type,l.dist,l.dur,paceStr(l.dist,l.dur),l.hr,l.cad,l.effort,l.weight,(l.notes||'').replace(/,/g,';')].join(','));
  dlFile('sg-workout-log.csv',['date,type,dist,dur,pace,hr,cadence,effort,weight,notes',...rows].join('\n'),'text/csv');
  showToast('✅ CSV exported!');
}
function exportJSON() {
  dlFile('sg-workout-data.json', JSON.stringify(D,null,2), 'application/json');
  showToast('✅ JSON exported!');
}
function dlFile(n,c,m){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([c],{type:m}));a.download=n;a.click();}
